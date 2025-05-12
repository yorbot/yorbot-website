
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { MinusCircle, PlusCircle, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Cart: React.FC = () => {
  const { cartItems, cartCount, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = React.useState("");
  const [discountApplied, setDiscountApplied] = React.useState(0);

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingFee = subtotal > 1000 ? 0 : 100;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + shippingFee + gst - discountApplied;

  // Apply coupon code
  const applyCoupon = async () => {
    if (!couponCode) {
      toast("Error", {
        description: "Please enter a coupon code",
      });
      return;
    }

    try {
      // Check if coupon exists in database
      const { data: coupons, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .single();

      if (error || !coupons) {
        toast("Invalid coupon", {
          description: "This coupon code is not valid.",
        });
        setDiscountApplied(0);
        return;
      }

      // Check if coupon is expired
      if (coupons.expires_at && new Date(coupons.expires_at) < new Date()) {
        toast("Expired coupon", {
          description: "This coupon has expired.",
        });
        setDiscountApplied(0);
        return;
      }

      // Check if coupon is usable (max_uses)
      if (coupons.max_uses && coupons.used_count >= coupons.max_uses) {
        toast("Coupon limit reached", {
          description: "This coupon has reached its usage limit.",
        });
        setDiscountApplied(0);
        return;
      }

      // Check minimum order value
      if (coupons.minimum_order_value && subtotal < coupons.minimum_order_value) {
        toast("Minimum order value not met", {
          description: `This coupon requires a minimum order of ₹${coupons.minimum_order_value.toFixed(2)}.`,
        });
        setDiscountApplied(0);
        return;
      }

      // Calculate discount
      let discount = 0;
      if (coupons.discount_type === 'percentage') {
        discount = Math.round(subtotal * (coupons.discount_value / 100));
      } else { // fixed discount
        discount = coupons.discount_value;
      }

      setDiscountApplied(discount);
      toast("Coupon applied successfully!", {
        description: `You saved ₹${discount.toFixed(2)} with this coupon.`,
      });
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast("Error", {
        description: "An error occurred while applying the coupon.",
      });
    }
  };

  const handleCheckout = () => {
    if (!user) {
      toast("Sign in required", {
        description: "Please sign in to proceed to checkout.",
      });
      navigate("/sign-in", { state: { from: { pathname: "/checkout" } } });
    } else {
      navigate("/checkout");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/" className="text-gray-500 hover:text-yorbot-orange">Home</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold">My Shopping Cart</span>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-8">My Shopping Cart</h1>
        
        {cartCount === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link 
              to="/shop" 
              className="bg-yorbot-orange text-white px-6 py-3 rounded-md font-medium hover:bg-orange-600 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left py-4 px-4 font-semibold">Product</th>
                        <th className="text-center py-4 px-2 font-semibold">Price</th>
                        <th className="text-center py-4 px-2 font-semibold">Quantity</th>
                        <th className="text-center py-4 px-2 font-semibold">Subtotal</th>
                        <th className="text-center py-4 px-2 font-semibold">Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-16 h-16 object-cover rounded mr-3"
                              />
                              <Link 
                                to={`/product/${item.id}`}
                                className="hover:text-yorbot-orange transition-colors"
                              >
                                {item.name}
                              </Link>
                            </div>
                          </td>
                          <td className="text-center py-4 px-2">₹{item.price.toFixed(2)}</td>
                          <td className="text-center py-4 px-2">
                            <div className="flex items-center justify-center">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="text-gray-500 hover:text-yorbot-orange"
                              >
                                <MinusCircle size={18} />
                              </button>
                              <span className="mx-3 w-8 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="text-gray-500 hover:text-yorbot-orange"
                              >
                                <PlusCircle size={18} />
                              </button>
                            </div>
                          </td>
                          <td className="text-center py-4 px-2 font-medium">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </td>
                          <td className="text-center py-4 px-2">
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X size={20} className="mx-auto" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Coupon Code */}
              <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Apply Coupon</h3>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yorbot-orange"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-yorbot-orange text-white px-4 py-2 rounded-md font-medium hover:bg-orange-600 transition-colors whitespace-nowrap"
                  >
                    Apply Now
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Try "WELCOME10" for 10% off your first order
                </p>
              </div>
            </div>
            
            {/* Cart Total */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Cart Total</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discountApplied > 0 && (
                    <div className="flex justify-between pb-3 border-b text-green-600">
                      <span>Discount</span>
                      <span>-₹{discountApplied.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-gray-600">Shipping Fee</span>
                    <span className="font-medium">
                      {shippingFee === 0 ? "Free" : `₹${shippingFee.toFixed(2)}`}
                    </span>
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
                  onClick={handleCheckout}
                  className="w-full bg-yorbot-orange text-white text-center py-3 rounded-md font-medium hover:bg-orange-600 transition-colors block"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
