import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Alert from '@mui/material/Alert';
import LoadingAnimation from './steering';

const History = () => {
    const { user } = useAuth0();
    const [bookings, setBookings] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserBookings = async (userEmail) => {
            try {
                const url = `https://park-server.onrender.com/api/userBookings?email=${encodeURIComponent(userEmail)}`;
                const response = await fetch(url);
                if (response.ok) {
                    const bookings = await response.json();
                    bookings.sort((a, b) => new Date(b.bookedFrom) - new Date(a.bookedFrom));
                    setBookings(bookings);
                } else {
                    throw new Error('Failed to fetch bookings');
                }
            } catch (error) {
                console.error('Error fetching user bookings:', error);
            }
        };
        if (user) {
            fetchUserBookings(user.email);
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [user, count]);

    const isBookingExpired = (bookedTill) => {
        const now = new Date();
        const tillDate = new Date(bookedTill);
        return now > tillDate;
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center text-2xl font-bold px-4 py-4 border-b border-orange-500 bg-orange-500 text-white">
                <h1 className="fam">Booking History</h1>
                <button 
                    onClick={() => setCount(count + 1)} 
                    className="bg-white hover:bg-orange-600 hover:text-white text-orange-600 font-bold py-1 px-4 border border-white rounded-md transition"
                >
                    Refresh
                </button>
            </div>

            {/* Table */}
            {!loading ? (
                <div className="px-4 py-6">
                    <div className="overflow-x-auto shadow-md rounded-lg">
                        <table className="min-w-full bg-white text-sm text-black font-medium rounded-lg overflow-hidden fam">
                            <thead className="bg-orange-400 text-white text-base">
                                <tr>
                                    <th className="px-4 py-3 border">Booking ID</th>
                                    <th className="px-4 py-3 border">Vehicleno</th>
                                    <th className="px-4 py-3 border">Amount</th>
                                    <th className="px-4 py-3 border">Slot ID</th>
                                    <th className="px-4 py-3 border">Booked From</th>
                                    <th className="px-4 py-3 border">Booked Till</th>
                                    <th className="px-4 py-3 border">Checkin OTP</th>
                                    <th className="px-4 py-3 border">Checkout OTP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking, index) => (
                                    <tr key={booking.bookingId} className={index % 2 === 0 ? 'bg-orange-50' : 'bg-white'}>
                                        <td className="px-4 py-2 border">{booking.bookingId}</td>
                                        <td className="px-4 py-2 border">{booking.vehicleNumber}</td>
                                        <td className="px-4 py-2 border">₹{booking.amount}</td>
                                        <td className="px-4 py-2 border">{booking.slotId}</td>
                                        <td className="px-4 py-2 border">{booking.bookedFrom}</td>
                                        <td className="px-4 py-2 border">{booking.bookedTill}</td>
                                        <td className="px-4 py-2 border font-bold">
                                            {!booking.isCheckedIn ? 
                                                (isBookingExpired(booking.bookedTill) ? (
                                                    <span className="text-red-600 font-semibold">Booking Expired</span>
                                                ) : (
                                                    booking.checkinotp
                                                )) : (
                                                <p className="text-green-600 font-semibold">Checked in</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 border font-bold">
                                            {!booking.isCheckedOut ? (
                                                booking.checkoutotp ? (
                                                    booking.checkoutotp
                                                ) : (
                                                    <p className="text-red-600">Not Checked In</p>
                                                )
                                            ) : (
                                                <p className="text-green-600">Checked Out</p>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <LoadingAnimation />
            )}
        </div>
    );
};

export default History;
