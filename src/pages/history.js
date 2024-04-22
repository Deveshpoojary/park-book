import React, { useEffect,useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const History = () => {
const { user } = useAuth0();
const [bookings, setBookings] = useState([]);
useEffect(() => {
    if (user.email) {
        fetchUserBookings(user.email);
    }
}, [user.email]); // Dependency array includes user.email to refetch when it changes

const fetchUserBookings = async (userEmail) => {
    try {
        const url = `http://https://park-book-9f9254d7f86a.herokuapp.com/api/userBookings?email=${encodeURIComponent(userEmail)}`;
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
return (
    <div>
        <h1 className="text-2xl font-bold mb-4">Booking History</h1>
        <table className="w-full border-collapse">
            <thead>
                <tr>
                    <th className="border border-gray-300 px-4 py-2">Booking ID</th>
                    <th className="border border-gray-300 px-4 py-2">Vehicle</th>
                    <th className="border border-gray-300 px-4 py-2">Slot ID</th>
                    <th className="border border-gray-300 px-4 py-2">Booked From</th>
                    <th className="border border-gray-300 px-4 py-2">Booked Till</th>
                </tr>
            </thead>
            <tbody>
                {bookings.map(booking => (
                    <tr key={booking.bookingId}>
                        <td className="border border-gray-300 px-4 py-2">{booking.bookingId}</td>
                        <td className="border border-gray-300 px-4 py-2">{booking.vehicleType}</td>
                        <td className="border border-gray-300 px-4 py-2">{booking.slotId}</td>
                        <td className="border border-gray-300 px-4 py-2">{booking.bookedFrom}</td>
                        <td className="border border-gray-300 px-4 py-2">{booking.bookedTill}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
}
export default History;