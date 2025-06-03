import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Order {
  id: number;
  order_number: string;
  created_at: string;
  total_amount: number;
  order_status: string;
  payment_status: string;
  payment_method: string;
  items: any[];
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching orders:', error);
          toast("Failed to load order history", {
            description: "Please try again",
            duration: 2000,
          });
          return;
        }

        // Transform the data to match our Order interface
        const transformedOrders = (data || []).map((order: any) => ({
          ...order,
          items: Array.isArray(order.items) ? order.items : []
        }));

        setOrders(transformedOrders);
      } catch (error) {
        console.error('Error:', error);
        toast("Failed to load order history", {
          description: "Please try again",
          duration: 2000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-yorbot-orange"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4">No Orders Yet</h3>
        <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
        <Link 
          to="/shop" 
          className="bg-yorbot-orange text-white px-6 py-3 rounded-md font-medium hover:bg-orange-600 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Order History</h2>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Order #{order.order_number}</h3>
                <p className="text-gray-600">
                  Placed on {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col md:items-end mt-2 md:mt-0">
                <p className="text-xl font-bold">₹{order.total_amount.toFixed(2)}</p>
                <div className="flex space-x-2 mt-1">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                    {order.order_status}
                  </span>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.payment_status)}`}>
                    {order.payment_status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Payment Method: <span className="font-medium capitalize">{order.payment_method}</span>
              </p>
              <p className="text-sm text-gray-600">
                Items: {order.items?.length || 0} item(s)
              </p>
            </div>

            {order.items && order.items.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {order.items.slice(0, 3).map((item: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    +{order.items.length - 3} more items
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                to={`/profile/orders/${order.id}`}
                className="bg-yorbot-orange text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600 transition-colors text-center"
              >
                View Details
              </Link>
              {order.order_status.toLowerCase() === 'pending' && (
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
