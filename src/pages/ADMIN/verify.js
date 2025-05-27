import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Verify = () => {
  const { user, isLoading } = useAuth0();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (user && user.email) {
        try {
          const response = await fetch(`https://park-server.onrender.com/api/check-verification?email=${user.email}`);
          const data = await response.json();
          if (data.verified) {
            setVerified(true);
            setMessage("Your phone number is already verified.");
          }
        } catch (error) {
          console.error("Error checking verification status:", error);
        }
      }
    };
    checkVerificationStatus();
  }, [user]);

  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setMessage("Please enter a valid phone number.");
      return;
    }
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    setMessage(`OTP sent! Your OTP is: ${randomOtp}`);
  };

  const handleVerifyOtp = async () => {
    if (!phoneNumber) {
      setMessage("Please enter your phone number.");
      return;
    }
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    if (otp === generatedOtp) {
      setMessage("Phone number verified successfully!");
      setVerified(true);

      try {
        const response = await fetch("https://park-server.onrender.com/api/usersdet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            phoneNumber,
          }),
        });

        if (response.ok) {
          setMessage("User details saved to the database.");
        } else {
          setMessage("Error saving user details to the database.");
        }
      } catch (error) {
        console.error("Error saving user details:", error);
        setMessage("An error occurred while saving user details.");
      }
    } else {
      setMessage("Invalid OTP. Please try again.");
    }
  };

  if (isLoading) return <div className="text-orange-600 font-bold text-lg">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white via-orange-100 to-white px-4">
      {!user?.email ? (
        <div className="text-orange-600 font-bold text-lg">Loading...</div>
      ) : (
        <>
          {!verified ? (
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-orange-200">
              <p className="text-orange-600 font-semibold mb-2 text-sm">
                Verification required to book a slot
              </p>
              <h1 className="text-2xl font-bold text-orange-700 mb-6">Phone Verification</h1>

              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
                className="bg-orange-50 border border-orange-200 text-orange-900 p-3 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                onClick={handleSendOtp}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg w-full mb-4 transition duration-300"
              >
                Send OTP
              </button>

              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="bg-orange-50 border border-orange-200 text-orange-900 p-3 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                onClick={handleVerifyOtp}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg w-full transition duration-300"
              >
                Verify OTP
              </button>

              {message && (
                <p className="mt-4 text-sm text-gray-700 font-medium bg-orange-100 p-2 rounded-lg">
                  {message}
                </p>
              )}
            </div>
          ) : (
            <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-orange-200">
              <h1 className="text-2xl font-bold text-orange-600">
                Your phone number is already verified.
              </h1>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Verify;
