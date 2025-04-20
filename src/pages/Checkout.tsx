
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/components/ui/use-toast";

const Checkout: React.FC = () => {
  const { toast } = useToast();
  const [addressType, setAddressType] = useState("default");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showUpiForm, setShowUpiForm] = useState(false);
  const [showUpiScanner, setShowUpiScanner] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  
  const [addressForm, setAddressForm] = useState({
    fullName: "John Doe",
    companyName: "",
    phoneNumber: "9876543210",
    streetAddress: "123 Main Street",
    pinCode: "560001",
    city: "Bengaluru",
    state: "Karnataka",
  });
  
  const [upiId, setUpiId] = useState("");
  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real implementation, this would process the checkout
    console.log("Checkout with:", {
      addressType,
      addressForm,
      paymentMethod,
      upiId: showUpiForm ? upiId : null,
      cardDetails: showCardForm ? cardForm : null,
    });
    
    toast({
      title: "Order placed successfully!",
      description: "Thank you for your purchase.",
      variant: "default",
    });
  };

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
                <div className="flex justify-between pb-4 border-b">
                  <span className="text-gray-600">1x Arduino Uno R3</span>
                  <span>₹550.00</span>
                </div>
                <div className="flex justify-between pb-4 border-b">
                  <span className="text-gray-600">1x Raspberry Pi 4</span>
                  <span>₹4,200.00</span>
                </div>
                <div className="flex justify-between pb-4 border-b">
                  <span className="text-gray-600">3x Ultrasonic Sensor</span>
                  <span>₹240.00</span>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹4,990.00</span>
                </div>
                <div className="flex justify-between pb-3 border-b text-green-600">
                  <span>Discount</span>
                  <span>-₹499.00</span>
                </div>
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-medium">₹810.00</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹5,301.00</span>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-yorbot-orange text-white text-center py-3 rounded-md font-medium hover:bg-orange-600 transition-colors"
              >
                Place Order
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;
