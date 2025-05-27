import React, { useState, useEffect } from 'react';
import UpdatePrices from './updateprice';
import UpdateSlots from './updateslots';
import Adminhist from './adminhist';
import Accessdenied from './accessdenied';
import Current from './current';
import UserList from './user';
import { useAuth0 } from '@auth0/auth0-react';

const Admin = () => {
  const { user } = useAuth0();
  const [page, setPage] = useState("1");
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // Default to true while loading

  useEffect(() => {
    // Check if user is authenticated and set admin status accordingly
    if (user) {
      // Check if the user's email is in the admin list
      const adminEmails = [
        "deveshpoojary@gmail.com",
        "tharunrai69@gmail.com",
        "karkerabhuvan@gmail.com"
      ];

      setAdmin(adminEmails.includes(user.email));
    }
    // Set loading to false once the user check is complete
    setLoading(false);
  }, [user]);

  const handle = (e) => {
    setPage(e.target.name);
  };

  return (
    <div className="bg-primary min-h-screen">
      {loading ? (
        <div className="text-white font-bold">Loading...</div>
      ) : admin ? (
        <>
          <div className="bg-gradient-to-br from-orange-100 via-white to-orange-200 text-black flex flex-wrap px-4 py-4 shadow-lg border-b border-gray-500 gap-2">
            {["Update Prices", "Admin History", "Slots", "Current", "User List"].map((label, index) => (
              <button
                key={index}
                name={`${index + 1}`}
                onClick={handle}
                className={`
                  font-bold py-2 px-5 rounded-md 
                  bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 
                  text-white 
                  hover:from-orange-500 hover:via-orange-600 hover:to-orange-700 
                  transition-colors duration-300
                  ${
                    page === `${index + 1}`
                      ? "ring-4 ring-orange-400"
                      : "ring-0"
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="">
            {page === "1" ? (
              <UpdatePrices />
            ) : page === "2" ? (
              <Adminhist />
            ) : page === "3" ? (
              <UpdateSlots />
            ) : page === "4" ? (
              <Current />
            ) : (
              <UserList />
            )}
          </div>
        </>
      ) : (
        <Accessdenied />
      )}
    </div>
  );
};

export default Admin;
