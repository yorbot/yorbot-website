
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import OrderHistory from "@/components/profile/OrderHistory";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setLoading(false);
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

        setProfile(data);
        
        if (data) {
          setProfile({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            phone: data.phone || "",
            address_line1: data.address_line1 || "",
            address_line2: data.address_line2 || "",
            city: data.city || "",
            state: data.state || "",
            postal_code: data.postal_code || "",
            country: data.country || "India",
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsEditing(true);
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          address_line1: profile.address_line1,
          address_line2: profile.address_line2,
          city: profile.city,
          state: profile.state,
          postal_code: profile.postal_code,
          country: profile.country,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        toast("Error", {
          description: "Failed to update profile. Please try again.",
          duration: 2000,
        });
        console.error('Error updating profile:', error);
        return;
      }

      toast("Profile updated", {
        description: "Your profile has been updated successfully.",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error:', error);
      toast("Error", {
        description: "An unexpected error occurred. Please try again.",
        duration: 2000,
      });
    } finally {
      setIsEditing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
      toast("Signed out successfully", {
        duration: 2000,
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast("Error signing out", {
        description: "Please try again",
        duration: 2000,
      });
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
            <button
              onClick={() => navigate("/sign-in")}
              className="bg-yorbot-orange text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "profile"
                      ? "border-yorbot-orange text-yorbot-orange"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "orders"
                      ? "border-yorbot-orange text-yorbot-orange"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Order History
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "profile" && (
                <div>
                  <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="font-semibold text-lg">Profile Information</h2>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Logout
                    </button>
                  </div>
                  <div className="p-6">
                    <form onSubmit={handleSave} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={profile.first_name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                          />
                        </div>
                        <div>
                          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={profile.last_name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={user.email}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md"
                          />
                          <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={profile.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yorbot-orange focus:border-yorbot-orange"
                          />
                        </div>
                      </div>

                      <div>
                        <button
                          type="submit"
                          disabled={isEditing}
                          className="px-4 py-2 bg-yorbot-orange text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yorbot-orange disabled:opacity-75"
                        >
                          {isEditing ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {activeTab === "orders" && <OrderHistory />}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
