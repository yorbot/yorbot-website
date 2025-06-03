import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, cartCount, clearCart } = useCart();
  const { user } = useAuth();
  
  const [addressType, setAddressType] = useState("default");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showUpiForm, setShowUpiForm] = useState(false);
  const [showUpiScanner, setShowUpiScanner] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    companyName: "",
    phoneNumber: "",
    streetAddress: "",
    pinCode: "",
    city: "",
    state: "",
  });
  
  const [upiId, setUpiId] = useState("");
  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount = 0;
  const shippingFee = subtotal > 1000 ? 0 : 100;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal - discount + shippingFee + gst;

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setLoadingProfile(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }

        setUserProfile(data);
        
        // Prefill the address form with user profile data
        if (data) {
          setAddressForm({
            fullName: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
            companyName: "",
            phoneNumber: data.phone || "",
            streetAddress: data.address_line1 || "",
            pinCode: data.postal_code || "",
            city: data.city || "",
            state: data.state || "",
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartCount === 0) {
      navigate('/cart');
      toast("Your cart is empty", {
        description: "Add some items to your cart before checking out.",
        duration: 2000,
      });
    }
  }, [cartCount, navigate]);

  // Handle address form change
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
    
    // Simulate city and state autofill when pin code is entered
    if (name === "pinCode" && value.length === 6) {
      // This would be an API call in a real implementation
      if (value === "560001") {
        setAddressForm((prev) => ({ ...prev, city: "Bengaluru", state: "Karnataka" }));
      } else if (value === "400001") {
        setAddressForm((prev) => ({ ...prev, city: "Mumbai", state: "Maharashtra" }));
      }
    }
  };
  
  // Handle payment method selection
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    setShowUpiForm(method === "upi");
    setShowUpiScanner(false);
    setShowCardForm(method === "card");
  };
  
  // Handle UPI option selection
  const handleUpiOptionChange = (option: string) => {
    if (option === "id") {
      setShowUpiForm(true);
      setShowUpiScanner(false);
    } else {
      setShowUpiForm(false);
      setShowUpiScanner(true);
    }
  };
  
  // Handle card form change
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardForm((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast("Authentication required", {
        description: "Please sign in to complete your purchase.",
        duration: 2000,
      });
      navigate('/sign-in', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create order in database
      const orderData = {
        user_id: user.id,
        customer_name: addressForm.fullName,
        customer_email: user.email,
        customer_phone: addressForm.phoneNumber,
        shipping_address: {
          fullName: addressForm.fullName,
          companyName: addressForm.companyName,
          phoneNumber: addressForm.phoneNumber,
          streetAddress: addressForm.streetAddress,
          pinCode: addressForm.pinCode,
          city: addressForm.city,
          state: addressForm.state,
        },
        billing_address: {
          fullName: addressForm.fullName,
          companyName: addressForm.companyName,
          phoneNumber: addressForm.phoneNumber,
          streetAddress: addressForm.streetAddress,
          pinCode: addressForm.pinCode,
          city: addressForm.city,
          state: addressForm.state,
        },
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal: subtotal,
        tax_amount: gst,
        shipping_amount: shippingFee,
        discount_amount: discount,
        total_amount: total,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'cash' ? 'pending' : 'completed',
        order_status: 'pending',
      };

      const { data: order, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        throw new Error('Failed to create order');
      }

      // Clear the cart after successful order
      await clearCart();
      
      toast("Order placed successfully!", {
        description: `Your order #${order.order_number} has been placed.`,
        duration: 2000,
      });
      
      // Redirect to order success page with order details
      navigate(`/order-success/${order.id}`, { 
        state: { 
          order: order,
          paymentMethod: paymentMethod 
        } 
      });
    } catch (error) {
      console.error('Error processing order:', error);
      toast("Order failed", {
        description: "An error occurred while processing your order. Please try again.",
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[70vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yorbot-orange"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/" className="text-gray-500 hover:text-yorbot-orange">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/cart" className="text-gray-500 hover:text-yorbot-orange">Cart</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold">Checkout</span>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Checkout</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Billing Information */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="addressType"
                      value="default"
                      checked={addressType === "default"}
                      onChange={() => setAddressType("default")}
                      className="mr-2 h-4 w-4 text-yorbot-orange focus:ring-yorbot-orange"
                    />
                    <span>Use Default Address</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="addressType"
                      value="different"
                      checked={addressType === "different"}
                      onChange={() => setAddressType("different")}
                      className="mr-2 h-4 w-4 text-yorbot-orange focus:ring-yorbot-orange"
                    />
                    <span>Add Different Address</span>
                  </label>
                </div>
              </div>
              
              {/* Address Form Fields */}
              <div className={addressType === "different" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "opacity-50 pointer-events-none grid grid-cols-1 md:grid-cols-2 gap-4"}>
                <div className="md:col-span-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={addressForm.fullName}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={addressForm.companyName}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={addressForm.phoneNumber}
                    onChange={handleAddressChange}
                    required
                    pattern="[0-9]{10}"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <textarea
                    id="streetAddress"
                    name="streetAddress"
                    value={addressForm.streetAddress}
                    onChange={handleAddressChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    id="pinCode"
                    name="pinCode"
                    value={addressForm.pinCode}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={addressForm.state}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                  />
                </div>
              </div>
            </div>
            
            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              
              <div className="space-y-4 mb-6">
                <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={() => handlePaymentMethodChange("cash")}
                    className="mr-2 h-4 w-4 text-yorbot-orange focus:ring-yorbot-orange"
                  />
                  <span className="ml-2">Cash on Delivery</span>
                </label>
                
                <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={() => handlePaymentMethodChange("upi")}
                    className="mr-2 h-4 w-4 text-yorbot-orange focus:ring-yorbot-orange"
                  />
                  <span className="ml-2">UPI</span>
                </label>
                
                <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => handlePaymentMethodChange("card")}
                    className="mr-2 h-4 w-4 text-yorbot-orange focus:ring-yorbot-orange"
                  />
                  <span className="ml-2">Credit/Debit Card</span>
                </label>
              </div>
              
              {/* UPI Options */}
              {paymentMethod === "upi" && (
                <div className="mt-4 border-t pt-4">
                  <div className="mb-4">
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="upiOption"
                          value="id"
                          checked={showUpiForm}
                          onChange={() => handleUpiOptionChange("id")}
                          className="mr-2 h-4 w-4 text-yorbot-orange focus:ring-yorbot-orange"
                        />
                        <span>Enter UPI ID</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="upiOption"
                          value="scanner"
                          checked={showUpiScanner}
                          onChange={() => handleUpiOptionChange("scanner")}
                          className="mr-2 h-4 w-4 text-yorbot-orange focus:ring-yorbot-orange"
                        />
                        <span>Scan QR Code</span>
                      </label>
                    </div>
                  </div>
                  
                  {showUpiForm && (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                          UPI ID *
                        </label>
                        <input
                          type="text"
                          id="upiId"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="example@upi"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                        />
                      </div>
                    </div>
                  )}
                  
                  {showUpiScanner && (
                    <div className="text-center py-6 border rounded-md">
                      <div className="w-48 h-48 mx-auto bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">QR Code Placeholder</span>
                      </div>
                      <p className="mt-4 text-sm text-gray-600">Scan with any UPI app to pay</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Card Payment Form */}
              {paymentMethod === "card" && (
                <div className="mt-4 border-t pt-4 space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={cardForm.cardNumber}
                      onChange={handleCardChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Card *
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={cardForm.cardName}
                      onChange={handleCardChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={cardForm.expiryDate}
                        onChange={handleCardChange}
                        placeholder="MM/YY"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV *
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={cardForm.cvv}
                        onChange={handleCardChange}
                        placeholder="123"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between pb-4 border-b">
                    <span className="text-gray-600">{item.quantity}x {item.name}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between pb-3 border-b text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{shippingFee === 0 ? "Free" : `₹${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-medium">₹{gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yorbot-orange text-white text-center py-3 rounded-md font-medium hover:bg-orange-600 transition-colors disabled:opacity-75"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;
