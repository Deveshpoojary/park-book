import React, { useEffect,useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Alert from '@mui/material/Alert';
const History = () => {
const { user } = useAuth0();
const [bookings, setBookings] = useState([]);
const [count,setcount]=useState(0);
const [loading, setLoading] = useState(false);

useEffect(() => {
    const fetchUserBookings = async (userEmail) => {
    try {
        const url = `https://park-book-9f9254d7f86a.herokuapp.com/api/userBookings?email=${encodeURIComponent(userEmail)}`;
        const response = await fetch(url);
        if (response.ok) {
            const bookings = await response.json();
            console.log('User bookings:', bookings);
            //sort
            bookings.sort((a, b) => {
                return new Date(b.bookedFrom) - new Date(a.bookedFrom);
            });
            setBookings(bookings);
            
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
}, [user,count]); // Dependency array includes user.email to refetch when it changes
 const isBookingExpired = (bookedTill) => {
        const now = new Date();
        const tillDate = new Date(bookedTill);
        return now > tillDate;
    };
return (
    <div>
        <>
        <span className="text-2xl font-bold mb-4">Booking History</span>
        <button onClick={() => {setcount(count+1)}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 mx-4 my-4 px-1 rounded">Refresh</button></>
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
                        <th className="border border-gray-300 px-4 py-2">Checkin OTP</th>
                        <th className="border border-gray-300 px-4 py-2">Checkout OTP</th>

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
                            (booking.checkoutotp ? booking.checkoutotp : <p className='text-red-600'>Not Checked In</p>)
                            : <p className='text-green-600'><b>Checked Out</b></p>}
                        </td>
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