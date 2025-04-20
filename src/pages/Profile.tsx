
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/components/ui/use-toast";

enum ProfileTab {
  Dashboard = "dashboard",
  Orders = "orders",
  AccountInfo = "account",
}

const Profile: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTab>(ProfileTab.Dashboard);
  
  // Mock user data
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "9876543210",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    address: {
      street: "123 Main Street",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
    },
  });
  
  // Mock order data
  const recentOrders = [
    {
      id: "ORD123456",
      date: "2025-04-15",
      amount: 4990.00,
      status: "Delivered",
      items: [
        {
          id: 1,
          name: "Arduino Uno R3",
          image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=100&q=80",
          price: 550,
          quantity: 1,
        },
        {
          id: 2,
          name: "Raspberry Pi 4",
          image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=100&q=80",
          price: 4200,
          quantity: 1,
        },
      ],
    },
    {
      id: "ORD123455",
      date: "2025-04-02",
      amount: 900.00,
      status: "Processing",
      items: [
        {
          id: 3,
          name: "DHT22 Temperature Sensor",
          image: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=100&q=80",
          price: 300,
          quantity: 3,
        },
      ],
    },
    {
      id: "ORD123454",
      date: "2025-03-20",
      amount: 1500.00,
      status: "Shipped",
      items: [
        {
          id: 4,
          name: "Robot Chassis Kit",
          image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=100&q=80",
          price: 1500,
          quantity: 1,
        },
      ],
    },
  ];
  
  // Handler to logout
  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    
    // In a real app, this would clear authentication state
    navigate("/sign-in");
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/" className="text-gray-500 hover:text-yorbot-orange">Home</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold">My Account</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Settings</h3>
              
              <ul className="space-y-2">
                <li>
                  <button
                    className={`w-full text-left py-2 px-3 rounded-md ${
                      activeTab === ProfileTab.Dashboard 
                        ? "bg-yorbot-orange text-white" 
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab(ProfileTab.Dashboard)}
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left py-2 px-3 rounded-md ${
                      activeTab === ProfileTab.Orders 
                        ? "bg-yorbot-orange text-white" 
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab(ProfileTab.Orders)}
                  >
                    Order History
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left py-2 px-3 rounded-md ${
                      activeTab === ProfileTab.AccountInfo 
                        ? "bg-yorbot-orange text-white" 
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab(ProfileTab.AccountInfo)}
                  >
                    Account Info
                  </button>
                </li>
                <li>
                  <button
                    className="w-full text-left py-2 px-3 rounded-md text-red-500 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Dashboard */}
            {activeTab === ProfileTab.Dashboard && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                      <img 
                        src={userData.avatar} 
                        alt={userData.name} 
                        className="w-16 h-16 rounded-full mr-4"
                      />
                      <div>
                        <h2 className="text-xl font-semibold">{userData.name}</h2>
                        <p className="text-gray-600">{userData.email}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>{userData.address.street}</p>
                      <p>{userData.address.city}, {userData.address.state} {userData.address.pincode}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <button
                      className="text-yorbot-orange hover:underline"
                      onClick={() => setActiveTab(ProfileTab.AccountInfo)}
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Recent Orders</h3>
                    <button
                      className="text-yorbot-orange hover:underline"
                      onClick={() => setActiveTab(ProfileTab.Orders)}
                    >
                      View All Orders
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 text-left">Order ID</th>
                          <th className="py-3 text-left">Date</th>
                          <th className="py-3 text-left">Amount</th>
                          <th className="py-3 text-left">Status</th>
                          <th className="py-3 text-left">View</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.slice(0, 3).map((order) => (
                          <tr key={order.id} className="border-b">
                            <td className="py-3">{order.id}</td>
                            <td className="py-3">{new Date(order.date).toLocaleDateString()}</td>
                            <td className="py-3">₹{order.amount.toFixed(2)}</td>
                            <td className="py-3">
                              <span 
                                className={`inline-block px-2 py-1 rounded-full text-xs ${
                                  order.status === "Delivered" 
                                    ? "bg-green-100 text-green-800" 
                                    : order.status === "Processing"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3">
                              <Link 
                                to={`/profile/orders/${order.id}`}
                                className="text-yorbot-orange hover:underline"
                              >
                                View Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {/* Order History */}
            {activeTab === ProfileTab.Orders && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Order History</h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 text-left">Order ID</th>
                        <th className="py-3 text-left">Date</th>
                        <th className="py-3 text-left">Amount</th>
                        <th className="py-3 text-left">Status</th>
                        <th className="py-3 text-left">View</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="py-3">{order.id}</td>
                          <td className="py-3">{new Date(order.date).toLocaleDateString()}</td>
                          <td className="py-3">₹{order.amount.toFixed(2)}</td>
                          <td className="py-3">
                            <span 
                              className={`inline-block px-2 py-1 rounded-full text-xs ${
                                order.status === "Delivered" 
                                  ? "bg-green-100 text-green-800" 
                                  : order.status === "Processing"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <Link 
                              to={`/profile/orders/${order.id}`}
                              className="text-yorbot-orange hover:underline"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Account Info */}
            {activeTab === ProfileTab.AccountInfo && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Account Information</h2>
                
                <form className="space-y-6">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <img 
                        src={userData.avatar} 
                        alt={userData.name} 
                        className="w-24 h-24 rounded-full"
                      />
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 bg-yorbot-orange text-white p-1 rounded-full"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        defaultValue={userData.name.split(" ")[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        defaultValue={userData.name.split(" ")[1]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        defaultValue={userData.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        defaultValue={userData.phone}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                      />
                    </div>
                  </div>
                  
                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-medium mb-4">Billing Address</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                          Street Address
                        </label>
                        <input
                          type="text"
                          id="street"
                          defaultValue={userData.address.street}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                          PIN Code
                        </label>
                        <input
                          type="text"
                          id="pincode"
                          defaultValue={userData.address.pincode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          defaultValue={userData.address.city}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          id="state"
                          defaultValue={userData.address.state}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-medium mb-4">Change Password</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                        />
                      </div>
                      
                      <div className="md:col-span-2"></div>
                      
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-6">
                    <button
                      type="button"
                      className="px-6 py-2 bg-yorbot-orange text-white rounded-md hover:bg-orange-600 transition-colors"
                      onClick={() => {
                        toast({
                          title: "Changes saved",
                          description: "Your account has been updated.",
                        });
                      }}
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
