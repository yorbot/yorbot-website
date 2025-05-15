
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // The hash contains the token information
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        
        if (!accessToken) {
          // Check if we're in the callback flow from Supabase
          const { error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Authentication callback error:", error.message);
            setError("Authentication failed. Please try again.");
            toast("Sign-in Failed", {
              description: error.message || "Please try logging in again",
            });
            setTimeout(() => navigate("/sign-in"), 2000);
            return;
          }
        }
        
        // If we reach here, authentication was successful
        toast("Authentication Successful", {
          description: "You have been signed in successfully",
        });
        
        // Redirect to the home page
        navigate("/");
      } catch (err) {
        console.error("Error in auth callback:", err);
        setError("An unexpected error occurred during sign-in");
        setTimeout(() => navigate("/sign-in"), 2000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded-md shadow-md max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
          <p>{error}</p>
          <p className="mt-4 text-sm">Redirecting you back to the login page...</p>
        </div>
      ) : (
        <div className="p-8 bg-white rounded-md shadow-md max-w-md text-center">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto border-t-4 border-yorbot-orange border-solid rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Completing Sign-In</h2>
          <p className="text-gray-600">Please wait while we finish authenticating your account...</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
