import React, { useEffect,useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const   Adminhist = () => {
const { user } = useAuth0();
const [bookings, setBookings] = useState([""]);
const [count,setcount]=useState(0);
const [otp,setOtp]=useState();
const [otp2,setOtp2]=useState();
const [loading, setLoading] = useState(false);
useEffect(() => {
   fetchUserBookings();
}, [count]); // Dependency array includes user.email to refetch when it changes



const fetchUserBookings = async ( ) => {
    try {
        setLoading(true);
        const url = `https://park-book-9f9254d7f86a.herokuapp.com/api/allBookings`;
        const response = await fetch(url);
        if (response.ok) {
            const bookings = await response.json();
            console.log('User bookings:', bookings);
            setBookings(bookings);
            // Do something with the bookings, like setting state
            setLoading(false);
        } else {
            throw new Error('Failed to fetch bookings');
           
        }
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        setBookings([]);
        setLoading(true);
        
    }
};
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
                bookingId: booking.bookingId ,
                checkInTime: trimdaytime,
                checkinotp:otp
            })
        });
        
      
        
        
         
         const res = await response.json(); // Parse JSON response in async manner
        

        console.log("succes/",res); // Logging the response
        setcount(count + 1);
    } catch (error) {
        console.error('Error checking in:', error);
    }
}

const checkout = async (booking) => {

    try {
        const checkOutTime = new Date();
        //convert to date time string in ist+5:30
        checkOutTime.setHours(checkOutTime.getHours() + 5);
        checkOutTime.setMinutes(checkOutTime.getMinutes() + 30);
        const trimdaytime = checkOutTime.toISOString().slice(0, 19).replace('T', ' ');
        const url = `https://park-book-9f9254d7f86a.herokuapp.com/api/check-out`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bookingId: booking.bookingId,
                checkOutTime: trimdaytime,
                checkoutotp:otp2
            })
        });
        const res = await response.json(); // Parse JSON response in async manner
        console.log("succes/",res); // Logging the response
        setcount(count + 1);
    }
    catch (error) {
        console.error('Error checking out:', error);
    }
}

const handleOtpChange = (otp) => {
    setOtp(otp);
};
const handleOtpChange2 = (otp) => {
    setOtp2(otp);
}
 const isBookingExpired = (bookedTill) => {
        const now = new Date();
        const tillDate = new Date(bookedTill);
        return now > tillDate;
    };
return (
    <div>
        
        <h1 className="text-2xl font-bold mb-4">All bookings</h1>

        <p className="border border-gray-300 px-4 py-2">Total Collection</p>
        
        {!loading ? (<> <p className="border border-gray-300 px-4 py-2">
            {bookings.reduce((total, booking) => {
                if (!isNaN(booking.amount)) {
                    total += parseFloat(booking.amount);
                }
                return total;
            }, 0)}
        </p>
        <button onClick={() => setcount(count + 1)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Refresh</button>
        <table className="w-full border-collapse">
            <thead>
                <tr>
                    {/* <th className="border border-gray-300 px-4 py-2">Booking ID</th> */}
                    <th className="border border-gray-300 px-4 py-2">User</th>
                    <th className="border border-gray-300 px-4 py-2">Vehicle</th>
                    <th className="border border-gray-300 px-4 py-2">Amount</th>
                    <th className="border border-gray-300 px-4 py-2">Slot ID</th>
                    <th className="border border-gray-300 px-4 py-2">Booked From</th>
                    <th className="border border-gray-300 px-4 py-2">Booked Till</th>
                </tr>
            </thead>
            <tbody>
                {bookings.map(booking => (
                    <tr key={booking.bookingId}>
                        {/* <td className="border border-gray-300 px-4 py-2">{booking.bookingId}</td> */}
                        <td className="border border-gray-300 px-4 py-2">{booking.userId}</td>
                        <td className="border border-gray-300 px-4 py-2">{booking.vehicleType}</td>
                        <td className="border border-gray-300 px-4 py-2">{booking.amount}</td>
                        <td className="border border-gray-300 px-4 py-2">{booking.slotId}</td>
                        <td className="border border-gray-300 px-4 py-2">{booking.bookedFrom}</td>
                        <td className="border border-gray-300 px-4 py-2">{booking.bookedTill}</td>
                      <td className="border px-4 py-2">
                            {!booking.isCheckedIn ?
                                (isBookingExpired(booking.bookedTill) ?
                                    <span className="text-red-600">Booking Expired</span> :
                                    <>
                                        <input 
                                            type="number" 
                                            placeholder="Enter OTP" 
                                            onChange={(e) => handleOtpChange( e.target.value)}
                                            className="mr-2"
                                        />
                                        <button
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={()=>{checkin(booking)}}
                                        >
                                            Checkin
                                        </button>
                                    </>
                                )
                                :
                                <span className="text-green-600">Checked in</span>
                            }
                        </td>



                       {booking.isCheckedIn? <td className="border px-4 py-2"> <input 
                                            type="number" 
                                            placeholder="Enter OTP" 
                                            onChange={(e) => handleOtpChange2( e.target.value)}
                                            className="mr-3"
                                        /><button
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={()=>{checkout(booking)}}
                                        >
                                            checkout
                                        </button></td>:<td className="border px-4 py-2">Not checked in</td>}
                    </tr>
                ))}
            </tbody>
        </table></>)
        
        
        : (
           <div className="flex items-center justify-center h-32">
                loading history
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-900"></div>
            </div> )

}
</div>
);
};  
export default Adminhist;