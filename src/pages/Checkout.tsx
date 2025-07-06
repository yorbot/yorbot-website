
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Smartphone, Wallet, QrCode } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout: React.FC = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUpiQr, setShowUpiQr] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [upiPaymentId, setUpiPaymentId] = useState<string>("");

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    paymentMethod: "card",
    notes: ""
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
      return;
    }

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [cartItems, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: value }));
    setShowUpiQr(false);
    setQrCodeUrl("");
  };

  const validateForm = () => {
    if (!formData.customerName || !formData.email || !formData.phone || !formData.address) {
      toast("Please fill in all required fields", { description: "Name, email, phone, and address are required." });
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast("Invalid email format", { description: "Please enter a valid email address." });
      return false;
    }
    
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      toast("Invalid phone number", { description: "Please enter a valid 10-digit Indian phone number." });
      return false;
    }
    
    return true;
  };

  const createRazorpayOrder = async () => {
    try {
      console.log("Creating Razorpay order with method:", formData.paymentMethod);
      
      const response = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: cartTotal,
          currency: 'INR',
          receipt: `order_${Date.now()}`,
          payment_method: formData.paymentMethod
        }
      });

      if (response.error) {
        console.error("Error creating order:", response.error);
        throw new Error(response.error.message || "Failed to create order");
      }

      console.log("Order created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in createRazorpayOrder:", error);
      throw error;
    }
  };

  const handleUpiPayment = async () => {
    try {
      setIsProcessing(true);
      const orderData = await createRazorpayOrder();
      
      if (orderData.qr_code_data) {
        setQrCodeUrl(orderData.qr_code_data.qr_code_url);
        setShowUpiQr(true);
        setUpiPaymentId(orderData.order.id);
        
        toast("UPI QR Code Generated", {
          description: "Scan the QR code with any UPI app to pay",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("UPI payment error:", error);
      toast("UPI Payment Failed", {
        description: "Unable to generate UPI QR code. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardPayment = async () => {
    try {
      setIsProcessing(true);
      const orderData = await createRazorpayOrder();

      const options = {
        key: orderData.razorpay_key_id,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "YorBot",
        description: "Order Payment",
        order_id: orderData.order.id,
        handler: async (response: any) => {
          console.log("Payment successful:", response);
          await handlePaymentSuccess(response, orderData.order);
        },
        prefill: {
          name: formData.customerName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#f97316",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast("Payment cancelled", {
              description: "You can try again when ready.",
            });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Card payment error:", error);
      toast("Payment Failed", {
        description: "Unable to process payment. Please try again.",
      });
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentResponse: any, orderDetails: any) => {
    try {
      console.log("Verifying payment:", paymentResponse);
      
      const verifyResponse = await supabase.functions.invoke('verify-razorpay-payment', {
        body: {
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          order_details: {
            user_id: user?.id,
            customer_name: formData.customerName,
            customer_email: formData.email,
            customer_phone: formData.phone,
            shipping_address: {
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zip_code: formData.zipCode
            },
            items: cartItems,
            subtotal: cartTotal,
            total_amount: cartTotal,
            notes: formData.notes
          }
        }
      });

      if (verifyResponse.data?.verified) {
        clearCart();
        toast("Payment Successful!", {
          description: "Your order has been placed successfully.",
          duration: 5000,
        });
        navigate("/order-success", { 
          state: { 
            orderId: paymentResponse.razorpay_order_id,
            amount: cartTotal 
          } 
        });
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      toast("Payment Verification Failed", {
        description: "Please contact support with your payment ID.",
      });
    }
  };

  const handleCashOnDelivery = async () => {
    try {
      setIsProcessing(true);
      
      // Create order without payment
      const { error } = await supabase.from('orders').insert({
        user_id: user?.id,
        customer_name: formData.customerName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode
        },
        items: cartItems,
        subtotal: cartTotal,
        total_amount: cartTotal,
        payment_method: 'cod',
        payment_status: 'pending',
        order_status: 'confirmed',
        notes: formData.notes
      });

      if (error) throw error;

      clearCart();
      toast("Order Placed!", {
        description: "Your cash on delivery order has been confirmed.",
        duration: 5000,
      });
      navigate("/order-success", { 
        state: { 
          orderId: `COD_${Date.now()}`,
          amount: cartTotal,
          paymentMethod: 'cod'
        } 
      });
    } catch (error) {
      console.error("COD order error:", error);
      toast("Order Failed", {
        description: "Unable to place order. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    switch (formData.paymentMethod) {
      case 'upi':
        await handleUpiPayment();
        break;
      case 'card':
        await handleCardPayment();
        break;
      case 'cod':
        await handleCashOnDelivery();
        break;
      default:
        toast("Invalid payment method", { description: "Please select a valid payment method." });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Form */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping & Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      required
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Shipping Address</h3>
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Payment Method</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        formData.paymentMethod === 'card' 
                          ? 'border-yorbot-orange bg-orange-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handlePaymentMethodChange('card')}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <CreditCard className="w-8 h-8 text-yorbot-orange" />
                        <span className="text-sm font-medium">Credit/Debit Card</span>
                      </div>
                    </div>
                    
                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        formData.paymentMethod === 'upi' 
                          ? 'border-yorbot-orange bg-orange-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handlePaymentMethodChange('upi')}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <QrCode className="w-8 h-8 text-yorbot-orange" />
                        <span className="text-sm font-medium">UPI QR Code</span>
                      </div>
                    </div>

                    <div
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        formData.paymentMethod === 'cod' 
                          ? 'border-yorbot-orange bg-orange-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handlePaymentMethodChange('cod')}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Wallet className="w-8 h-8 text-yorbot-orange" />
                        <span className="text-sm font-medium">Cash on Delivery</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* UPI QR Code Display */}
                {showUpiQr && qrCodeUrl && (
                  <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
                    <h4 className="text-lg font-semibold text-center">Scan QR Code to Pay</h4>
                    <div className="flex justify-center">
                      <img 
                        src={qrCodeUrl} 
                        alt="UPI QR Code" 
                        className="w-48 h-48 border-2 border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        Scan with any UPI app (Google Pay, PhonePe, Paytm, etc.)
                      </p>
                      <p className="font-semibold text-lg">Amount: ₹{cartTotal.toFixed(2)}</p>
                    </div>
                  </div>
                )}

                {/* Order Notes */}
                <div>
                  <Label htmlFor="notes">Order Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any special instructions for your order..."
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-yorbot-orange hover:bg-orange-600"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      Processing...
                    </>
                  ) : (
                    <>
                      {formData.paymentMethod === 'upi' && !showUpiQr && 'Generate UPI QR Code'}
                      {formData.paymentMethod === 'card' && 'Pay with Card'}
                      {formData.paymentMethod === 'cod' && 'Place Order (Cash on Delivery)'}
                      {formData.paymentMethod === 'upi' && showUpiQr && 'QR Code Generated - Complete Payment'}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
