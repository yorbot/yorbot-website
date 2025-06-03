
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || !user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching order:', error);
          toast("Failed to load order details", {
            description: "Please try again",
            duration: 2000,
          });
          return;
        }

        setOrder(data);
      } catch (error) {
        console.error('Error:', error);
        toast("Failed to load order details", {
          description: "Please try again",
          duration: 2000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user]);

  if (loading) {
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

  if (!order) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Order not found</h2>
            <Link
              to="/profile"
              className="text-yorbot-orange hover:underline font-medium"
            >
              Back to Order History
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/" className="text-gray-500 hover:text-yorbot-orange">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/profile" className="text-gray-500 hover:text-yorbot-orange">My Account</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold">Order #{order.order_number}</span>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Order #{order.order_number}</h1>
          <Link
            to="/profile"
            className="text-yorbot-orange hover:underline font-medium"
          >
            Back to Orders
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Order Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Date</p>
                  <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(order.order_status)}`}>
                    {order.order_status}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                  <p className="font-medium capitalize">{order.payment_method}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <address className="not-italic text-gray-700">
                    {order.shipping_address?.fullName}<br />
                    {order.shipping_address?.streetAddress}<br />
                    {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.pinCode}<br />
                    Phone: {order.shipping_address?.phoneNumber}
                  </address>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Billing Address</h3>
                  <address className="not-italic text-gray-700">
                    {order.billing_address?.fullName}<br />
                    {order.billing_address?.streetAddress}<br />
                    {order.billing_address?.city}, {order.billing_address?.state} {order.billing_address?.pinCode}<br />
                    Phone: {order.billing_address?.phoneNumber}
                  </address>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Product</th>
                      <th className="text-center py-3 px-4 font-semibold">Price</th>
                      <th className="text-center py-3 px-4 font-semibold">Quantity</th>
                      <th className="text-right py-3 px-4 font-semibold">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-16 h-16 object-cover rounded mr-3"
                            />
                            <span>{item.name}</span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4">₹{item.price.toFixed(2)}</td>
                        <td className="text-center py-4 px-4">{item.quantity}</td>
                        <td className="text-right py-4 px-4 font-medium">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{order.subtotal.toFixed(2)}</span>
                </div>
                
                {order.discount_amount > 0 && (
                  <div className="flex justify-between pb-3 border-b text-green-600">
                    <span>Discount</span>
                    <span>-₹{order.discount_amount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {order.shipping_amount === 0 ? "Free" : `₹${order.shipping_amount.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-medium">₹{order.tax_amount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{order.total_amount.toFixed(2)}</span>
                </div>
              </div>
              
              <Link
                to="/contact-us"
                className="block w-full text-center py-3 border border-yorbot-orange text-yorbot-orange rounded-md font-medium hover:bg-yorbot-orange hover:text-white transition-colors"
              >
                Need Help with Order?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetails;
