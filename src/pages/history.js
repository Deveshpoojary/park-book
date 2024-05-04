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
const checkin = async (booking) => {
    try {
        const checkInTime = new Date(); 
        //convert to date time string in ist+5:30
        checkInTime.setHours(checkInTime.getHours() + 5);
        checkInTime.setMinutes(checkInTime.getMinutes() + 30);
        const trimdaytime = checkInTime.toISOString().slice(0, 19).replace('T', ' ');
        const url = `https://park-book-9f9254d7f86a.herokuapp.com/api/check-in`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bookingId: booking.bookingId,
                checkInTime: trimdaytime
            })
        });
        

        // if (!response.ok) { // Check if response is ok (status in the range 200-299)
        //  console.log(response); 
        //     throw new Error('Network response was not ok');
       
        // }

         const res = await response.json(); // Parse JSON response in async manner
        // setOtp(res.otp); // Assuming setOtp is a state setter from React hooks

        console.log("succes/",res); // Logging the response
    } catch (error) {
        console.error('Error checking in:', error);
    }
}


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
                            <td className="border border-gray-300 px-4 py-2">{booking.bookingId}</td>
                            <td className="border border-gray-300 px-4 py-2">{booking.vehicleNumber}</td>
                            <td className="border border-gray-300 px-4 py-2">{booking.amount}</td>
                            <td className="border border-gray-300 px-4 py-2">{booking.slotId}</td>
                            <td className="border border-gray-300 px-4 py-2">{booking.bookedFrom}</td>
                            <td className="border border-gray-300 px-4 py-2">{booking.bookedTill}</td>
                            <td className="border border-gray-300 px-4 py-2"><button onClick={()=>{checkin(booking)}} >Checkin</button>{otp}</td>
                            <td className="border border-gray-300 px-4 py-2">Checkout</td>
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