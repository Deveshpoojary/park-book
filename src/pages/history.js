import React, { useEffect,useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const History = () => {
const { user } = useAuth0();
const [bookings, setBookings] = useState([]);
const [otp,setOtp]=useState('');
const [loading, setLoading] = useState(false);

useEffect(() => {
    const fetchUserBookings = async (userEmail) => {
    try {
        const url = `https://park-book-9f9254d7f86a.herokuapp.com/api/userBookings?email=${encodeURIComponent(userEmail)}`;
        const response = await fetch(url);
        if (response.ok) {
            const bookings = await response.json();
            console.log('User bookings:', bookings);
            setBookings(bookings);
            // Do something with the bookings, like setting state
        } else {
            throw new Error('Failed to fetch bookings');
           
        }
    } catch (error) {
        console.error('Error fetching user bookings:', error);
         console.log(user.email);
    }
};
    if (user) {
        fetchUserBookings(user.email);
        setLoading(false);
    }
    else{
        setLoading(true);
    }
}, [user]); // Dependency array includes user.email to refetch when it changes
 const isBookingExpired = (bookedTill) => {
        const now = new Date();
        const tillDate = new Date(bookedTill);
        return now > tillDate;
    };
return (
    <div>
        <h1 className="text-2xl font-bold mb-4">Booking History</h1>
        {!loading ? (
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Booking ID</th>
                        <th className="border border-gray-300 px-4 py-2">Vehicleno</th>
                        <th className="border border-gray-300 px-4 py-2">Amount</th>
                        <th className="border border-gray-300 px-4 py-2">Slot ID</th>
                        <th className="border border-gray-300 px-4 py-2">Booked From</th>
                        <th className="border border-gray-300 px-4 py-2">Booked Till</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                       <tr key={booking.bookingId}>
                        <td className="border px-4 py-2">{booking.bookingId}</td>
                        <td className="border px-4 py-2">{booking.vehicleNumber}</td>
                        <td className="border px-4 py-2">{booking.amount}</td>
                        <td className="border px-4 py-2">{booking.slotId}</td>
                        <td className="border px-4 py-2">{booking.bookedFrom}</td>
                        <td className="border px-4 py-2">{booking.bookedTill}</td>
                        <td className="border px-4 py-2">
                           {!booking.isCheckedIn ? 
                           
                           
                           (isBookingExpired(booking.bookedTill) ?
                                    <span className="text-red-600">Booking Expired</span> :
                                    
                           
                           booking.checkinotp ):(<p className='text-green-600'>Checked in</p>)}
                        </td>
                        <td className="border px-4 py-2">{!booking.isCheckedOut ? 
                           
                           
                           
                                    
                           
                           booking.checkoutotp :(<p className='text-green-600'>Checked Out</p>)}</td>
                    </tr>
                ))}
            </tbody>
        
            </table>
        ) : (
            <div className="flex items-center justify-center h-32">
                loading history
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-900"></div>
            </div>
        )}
    </div>
);
}
export default History;