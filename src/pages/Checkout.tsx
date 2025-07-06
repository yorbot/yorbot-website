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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Smartphone, Wallet, QrCode, MapPin, Truck, Clock } from "lucide-react";

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

  const [addressType, setAddressType] = useState("default");
  const [deliveryType, setDeliveryType] = useState("regular");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const [userProfile, setUserProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    phone: ""
  });

  const GST_RATE = 0.18; // 18% GST
  const REGULAR_DELIVERY_FEE_PER_ITEM = 15;
  const INSTANT_DELIVERY_FEE = 0; // Will be added later with delivery partners

  const subtotal = cartTotal;
  const gstAmount = subtotal * GST_RATE;
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const shippingFee = deliveryType === "instant" ? INSTANT_DELIVERY_FEE : (subtotal >= 800 ? 0 : (totalItems * REGULAR_DELIVERY_FEE_PER_ITEM));
  const totalAmount = subtotal + gstAmount + shippingFee;

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

    // Load user profile
    loadUserProfile();

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [cartItems, navigate]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("Error loading user profile:", error);
        return;
      }

      if (data) {
        setUserProfile(data);
        setFormData({
          fullName: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          address: data.address_line1 || '',
          city: data.city || '',
          state: data.state || '',
          pinCode: data.postal_code || '',
          phone: data.phone || ''
        });
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-detect city and state for pincode (placeholder for Google Maps integration)
    if (name === 'pinCode' && value.length === 6) {
      // TODO: Integrate Google Maps API for pincode lookup
      console.log('Pin code entered:', value);
    }
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.address || !formData.city || !formData.state || !formData.pinCode || !formData.phone) {
      toast("Please fill in all required fields", { description: "All address fields are required." });
      return false;
    }
    
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      toast("Invalid phone number", { description: "Please enter a valid 10-digit Indian phone number." });
      return false;
    }
    
    if (!/^\d{6}$/.test(formData.pinCode)) {
      toast("Invalid pin code", { description: "Please enter a valid 6-digit pin code." });
      return false;
    }
    
    return true;
  };

  const createRazorpayOrder = async () => {
    try {
      console.log("Creating Razorpay order with method:", paymentMethod);
      
      const response = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: totalAmount,
          currency: 'INR',
          receipt: `order_${Date.now()}`,
          payment_method: paymentMethod
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

  const handleRazorpayPayment = async () => {
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
          name: formData.fullName,
          email: user?.email,
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
      console.error("Payment error:", error);
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
            customer_name: formData.fullName,
            customer_email: user?.email,
            customer_phone: formData.phone,
            shipping_address: {
              address: formData.address,
              city: formData.city,
              state: formData.state,
              pin_code: formData.pinCode
            },
            items: cartItems.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image
            })),
            subtotal: subtotal,
            gst_amount: gstAmount,
            shipping_amount: shippingFee,
            total_amount: totalAmount,
            delivery_type: deliveryType,
            payment_method: paymentMethod
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
            amount: totalAmount,
            deliveryType: deliveryType
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
      
      const { error } = await supabase.from('orders').insert({
        user_id: user?.id,
        customer_name: formData.fullName,
        customer_email: user?.email,
        customer_phone: formData.phone,
        shipping_address: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pin_code: formData.pinCode
        },
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal: subtotal,
        tax_amount: gstAmount,
        shipping_amount: shippingFee,
        total_amount: totalAmount,
        payment_method: 'cod',
        payment_status: 'pending',
        order_status: 'confirmed',
        notes: `Delivery Type: ${deliveryType}`
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
          amount: totalAmount,
          paymentMethod: 'cod',
          deliveryType: deliveryType
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

  const handleContinueToPayment = async () => {
    if (!validateForm()) return;

    switch (paymentMethod) {
      case 'upi':
      case 'card':
        await handleRazorpayPayment();
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Shipping & Payment Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Shipping & Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Address Selection */}
                <div>
                  <Label className="text-base font-semibold mb-4 block">Delivery Address</Label>
                  <RadioGroup value={addressType} onValueChange={setAddressType} className="mb-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="default" id="default" />
                      <Label htmlFor="default">Use Default Address</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="additional" id="additional" />
                      <Label htmlFor="additional">Use Additional Address</Label>
                    </div>
                  </RadioGroup>

                  {/* Address Form */}
                  <div className="space-y-4 p-4 border rounded-lg">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
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
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="pinCode">Pin Code *</Label>
                        <Input
                          id="pinCode"
                          name="pinCode"
                          value={formData.pinCode}
                          onChange={handleInputChange}
                          placeholder="Enter 6-digit pin code"
                          maxLength={6}
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
                </div>

                {/* Delivery Options */}
                <div>
                  <Label className="text-base font-semibold mb-4 block">Delivery Options</Label>
                  <RadioGroup value={deliveryType} onValueChange={setDeliveryType}>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="instant" id="instant" />
                        <div className="flex items-center space-x-2">
                          <Clock className="w-5 h-5 text-orange-500" />
                          <div>
                            <Label htmlFor="instant" className="font-medium">Instant Delivery (1 Day)</Label>
                            <p className="text-sm text-gray-600">Get your order tomorrow</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{INSTANT_DELIVERY_FEE}</p>
                        <p className="text-xs text-gray-500">Coming Soon</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="regular" id="regular" />
                        <div className="flex items-center space-x-2">
                          <Truck className="w-5 h-5 text-green-500" />
                          <div>
                            <Label htmlFor="regular" className="font-medium">Regular Delivery (3-5 Days)</Label>
                            <p className="text-sm text-gray-600">Standard delivery</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {subtotal >= 800 ? (
                            <span className="text-green-600">FREE</span>
                          ) : (
                            `₹${shippingFee}`
                          )}
                        </p>
                        {subtotal >= 800 ? (
                          <p className="text-xs text-green-600">Free on orders ₹800+</p>
                        ) : (
                          <p className="text-xs text-gray-500">₹{REGULAR_DELIVERY_FEE_PER_ITEM} per item</p>
                        )}
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Payment Options */}
                <div>
                  <Label className="text-base font-semibold mb-4 block">Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="upi" id="upi" />
                      <QrCode className="w-6 h-6 text-blue-500" />
                      <Label htmlFor="upi" className="font-medium">UPI Payment</Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <CreditCard className="w-6 h-6 text-purple-500" />
                      <Label htmlFor="card" className="font-medium">Credit/Debit Card</Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Wallet className="w-6 h-6 text-green-500" />
                      <Label htmlFor="cod" className="font-medium">Cash on Delivery</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Continue to Payment Button */}
                <Button
                  onClick={handleContinueToPayment}
                  className="w-full bg-yorbot-orange hover:bg-orange-600 py-3 text-lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      Processing...
                    </>
                  ) : (
                    "Continue to Payment"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Cart Items */}
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                      </div>
                      <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  
                  {/* Price Breakdown */}
                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (18%)</span>
                      <span>₹{gstAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping ({totalItems} items)</span>
                      <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee.toFixed(2)}`}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span>Total</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Type Info */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {deliveryType === "instant" ? (
                        <Clock className="w-4 h-4 text-orange-500" />
                      ) : (
                        <Truck className="w-4 h-4 text-green-500" />
                      )}
                      <span className="text-sm font-medium">
                        {deliveryType === "instant" ? "Instant Delivery (1 Day)" : "Regular Delivery (3-5 Days)"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
