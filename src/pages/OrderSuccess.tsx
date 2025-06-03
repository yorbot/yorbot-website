
import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { CheckCircle } from "lucide-react";

const OrderSuccess: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    // Get order data from navigation state or fetch from database
    if (location.state?.order) {
      setOrder(location.state.order);
    }
  }, [location.state]);

  if (!order) {
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
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-medium">{order.order_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium">₹{order.total_amount?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium capitalize">{order.payment_method}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Status</p>
                <p className="font-medium capitalize">{order.order_status}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Items Ordered</h3>
            <div className="space-y-3">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-12 h-12 object-cover rounded mr-3"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Link
              to="/profile"
              className="block w-full bg-yorbot-orange text-white py-3 px-6 rounded-md font-medium hover:bg-orange-600 transition-colors"
            >
              View Order History
            </Link>
            <Link
              to="/shop"
              className="block w-full border border-yorbot-orange text-yorbot-orange py-3 px-6 rounded-md font-medium hover:bg-yorbot-orange hover:text-white transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccess;
