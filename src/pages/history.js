import React, { useEffect,useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Alert from '@mui/material/Alert';
import LoadingAnimation from './steering';
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
    <div className='bgcolor text-white min-h-screen'>
        <>
        
        <span className="flex text-2xl font-bold mb-4 px-2 py-4 bg-neutral-800"><h1 className='l-border'>Booking History</h1>
        <button onClick={() => setcount(count + 1)} className="bg-sky-500 hover:bg-blue-700 text-white font-bold py-1  px-1 ml-2 rounded">Refresh</button></span>
        </>

        {!loading ? (
            <div className='px-4 py-4'>
            <table className="w-full border rounded-lg ">
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
                        <td className="border px-4 py-2 font-bold">
                           {!booking.isCheckedIn ? 
                           
                           
                           (isBookingExpired(booking.bookedTill) ?
                                    <span className="text-red-600 font-bold">Booking Expired</span> :
                                    
                           
                           booking.checkinotp ):(<p className='text-green-600 font-bold'>Checked in</p>)}
                        </td>
                        <td className="border px-4 py-2">{!booking.isCheckedOut ? 
                            (booking.checkoutotp ? booking.checkoutotp : <p className='text-red-600 font-bold'>Not Checked In</p>)
                            : <p className='text-green-600 font-bold'>Checked Out</p>}
                        </td>
                    </tr>
                ))}
            </tbody>
        
            </table>
            </div>
        ) : (
           <LoadingAnimation/>
        )}
    </div>
);
}
export default History;