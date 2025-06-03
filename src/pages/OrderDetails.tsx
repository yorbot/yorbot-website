
import React from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";

// Mock order data
const order = {
  id: "ORD123456",
  date: "2025-04-15",
  amount: 4990.00,
  status: "Delivered",
  paymentMethod: "Credit Card",
  discount: 499.00,
  shipping: 0,
  gst: 810.00,
  total: 5301.00,
  shippingAddress: {
    name: "John Doe",
    street: "123 Main Street",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001",
    phone: "9876543210",
  },
  billingAddress: {
    name: "John Doe",
    street: "123 Main Street",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001",
    phone: "9876543210",
  },
  items: [
    {
      id: 1,
      name: "Arduino Uno R3",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=300&q=80",
      price: 550,
      quantity: 1,
    },
    {
      id: 2,
      name: "Raspberry Pi 4 Model B",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80",
      price: 4200,
      quantity: 1,
    },
  ],
  trackingStages: [
    {
      name: "Order Received",
      completed: true,
      date: "2025-04-15",
    },
    {
      name: "Processing",
      completed: true,
      date: "2025-04-16",
    },
    {
      name: "Out for Delivery",
      completed: true,
      date: "2025-04-17",
    },
    {
      name: "Delivered",
      completed: true,
      date: "2025-04-18",
    },
  ],
};

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  
  // In a real application, you would fetch this order by ID
  // const [order, setOrder] = useState(null);
  // useEffect(() => {
  //   fetchOrder(orderId).then(setOrder);
  // }, [orderId]);
  
  // if (!order) return <div>Loading...</div>;
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/" className="text-gray-500 hover:text-yorbot-orange">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/profile" className="text-gray-500 hover:text-yorbot-orange">My Account</Link>
          <span className="mx-2">/</span>
          <Link to="/profile/orders" className="text-gray-500 hover:text-yorbot-orange">Orders</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold">{orderId || order.id}</span>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Order #{orderId || order.id}</h1>
          <Link
            to="/profile/orders"
            className="text-yorbot-orange hover:underline font-medium"
          >
            Back to List
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Order Info */}
          <div className="lg:col-span-8 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Order Status</h2>
              
              <div className="relative">
                <div className="absolute top-4 left-3 h-full w-0.5 bg-gray-200"></div>
                
                <div className="space-y-6">
                  {order.trackingStages.map((stage, index) => (
                    <div key={index} className="relative flex items-start">
                      <div className={`absolute left-0 w-6 h-6 rounded-full border-2 ${
                        stage.completed 
                          ? "bg-yorbot-orange border-yorbot-orange" 
                          : "bg-white border-gray-300"
                      } flex items-center justify-center z-10`}>
                        {stage.completed && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      
                      <div className="ml-10">
                        <h3 className={`font-medium ${stage.completed ? "text-yorbot-orange" : "text-gray-500"}`}>
                          {stage.name}
                        </h3>
                        {stage.completed && (
                          <p className="text-sm text-gray-500">
                            {new Date(stage.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Order Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Date</p>
                  <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    order.status === "Delivered" 
                      ? "bg-green-100 text-green-800" 
                      : order.status === "Processing"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                  <p className="font-medium">{order.paymentMethod}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <address className="not-italic text-gray-700">
                    {order.shippingAddress.name}<br />
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}<br />
                    Phone: {order.shippingAddress.phone}
                  </address>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Billing Address</h3>
                  <address className="not-italic text-gray-700">
                    {order.billingAddress.name}<br />
                    {order.billingAddress.street}<br />
                    {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.pincode}<br />
                    Phone: {order.billingAddress.phone}
                  </address>
                </div>
              </div>
            </div>
            
            {/* Order Items */}
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
                    {order.items.map((item) => (
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
          
          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{order.amount.toFixed(2)}</span>
                </div>
                
                {order.discount > 0 && (
                  <div className="flex justify-between pb-3 border-b text-green-600">
                    <span>Discount</span>
                    <span>-₹{order.discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {order.shipping === 0 ? "Free" : `₹${order.shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-medium">₹{order.gst.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Need help button */}
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
