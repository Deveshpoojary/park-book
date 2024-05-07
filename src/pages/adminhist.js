import React, { useEffect,useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { set } from 'firebase/database';
import { Alert } from '@mui/material';

const   Adminhist = () => {
const { user } = useAuth0();
const [bookings, setBookings] = useState([""]);
const [count,setcount]=useState(0);
const [otp,setOtp]=useState();
const [otp2,setOtp2]=useState();
const [loading, setLoading] = useState(false);
 const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
 const [error, setError] = useState(null);
 const [mess,setMess]=useState("");
useEffect(() => {
   fetchUserBookings();
},[count]); // Dependency array includes user.email to refetch when it changes



const fetchUserBookings = async () => {
        try {
            setLoading(true);
            const response = await fetch(`https://park-book-9f9254d7f86a.herokuapp.com/api/allBookings`);
            if (response.ok) {
                const fetchedBookings = await response.json();
                //ort by time of booking
                fetchedBookings.sort((a, b) => new Date(b.bookedFrom) - new Date(a.bookedFrom));
                setBookings(fetchedBookings);
                setSearchResults(fetchedBookings); // Initialize search results with all bookings
                setLoading(false);
            } else {
                throw new Error('Failed to fetch bookings');
            }
        } catch (error) {
            console.error('Error fetching user bookings:', error);
            setLoading(false);
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
        
      
        
        
         await response.json(); // Parse JSON response in async manner
         switch(response.status){

            case 200: console.log("success");
            setMess("Checked in successfully");

            setcount(count + 1);
            break;
            case 209: console.log("New Slot Assigned",response.newSlotId);
            setMess("New Slot Assigned",response.newSlotId);
            setcount(count + 1);
            break;
            case 405: console.log("Wrong Otp");
            setError("Wrong OTP");
            setcount(count + 1);
            break;
            case 404: console.log("booking not found");
            setError("Booking not found");
            setcount(count + 1);
            break;

            case 401: console.log("unauthorized");
            setError("Unauthorized");
            setcount(count + 1);
            
            break;
            case 408: console.log("Cnat Check in Now, Checkin After Booking Time");

            setError("Cant Check in Now, Checkin After Booking Time");
            setcount(count + 1);
            break;
            case 406: console.log("Already Checked in");
            setError("Already Checked in");
            setcount(count + 1);
            break;
            case 500: console.log("server error");
            setError("Server Error");
            break;
            case 201: console.log("Check in sucessful");
            setMess("Checked in successfully");
            setcount(count + 1);
            break;
            default: console.log("error");
         }
        
    } catch (error) {
        console.log('Error checking in:', error);
        setError(error);
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
        setError(error);
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

     useEffect(() => {
        if(searchTerm === "") {
          setBookings(searchResults);
        }
        else{
        const results = bookings.filter(booking =>
            
             (booking.vehicleNumber && booking.vehicleNumber.includes(searchTerm) )||
            
            (booking.userId && booking.userId.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        
        setBookings(results);
        console.log("searchResults",results);
        }
        
    }, [searchTerm]);

 


return (
    <div>
        
        <span className="text-2xl font-bold mb-4">All Bookings<button onClick={() => setcount(count + 1)} className="bg-blue-500 hover:bg-blue-700  text-white font-bold py-1  px-1     rounded">Refresh</button>
          {error && <Alert severity="error" onClose={() => { setError(null) }}>{error}</Alert>}
          {mess && <Alert severity="success" onClose={() => { setMess(null) }}>{mess}</Alert>}
         </span> 
        
        {!loading ? (<> 
        
        <table className="w-full border-collapse">
            <thead>
                <th colSpan={10} className="border border-gray-300 px-4 py-2">
                <input
                    type="text"
                    placeholder="Search"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 px-4 py-2">
                </input>
               
                
            </th>
                <tr>
                    <th className="border border-gray-300 px-4 py-2">User</th>
                    <th className="border border-gray-300 px-4 py-2">Vehicle no.</th>
                    <th className="border border-gray-300 px-4 py-2">Amount</th>
                    <th className="border border-gray-300 px-4 py-2">Slot ID</th>
                    <th className="border border-gray-300 px-4 py-2">Booked From</th>
                    <th className="border border-gray-300 px-4 py-2">Booked Till</th>
                    <th className="border border-gray-300 px-4 py-2">Checkin</th>
                    <th className="border border-gray-300 px-4 py-2">Checkout</th>

                </tr>
            </thead>
            <tbody>
                {  


                
                
                
                
                
                   bookings.map(booking => (

                 
                    
                    <tr key={booking.bookingId}>
                        {/* <td className="border border-gray-300 px-4 py-2">{booking.bookingId}</td> */}
                        <td className="border border-gray-300 px-4 py-2">{booking.userId}</td>
                        <td className="border border-gray-300 px-4 py-2">{booking.vehicleNumber}</td>
                        <td className="border border-gray-300 px-4 py-2">{booking.amount}</td>
                        <td className="border border-gray-300 px-4 py-2">{booking.slotId}</td>
                        <td className="border border-gray-300 px-4 py-2">{booking.bookedFrom}</td>
                        <td className="border border-gray-300 px-4 py-2">{booking.bookedTill}</td>
                      <td className="border px-4 py-2">
                            {!booking.isCheckedIn ?
                                (isBookingExpired(booking.bookedTill) ?
                                    <span className="text-red-600">Booking Expired</span> :
                                    <>{booking.bookedFrom<new Date().toISOString().slice(0, 19).replace('T', ' ')? "Not Today":<>
                                    
                                    
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
                                    </>}
                                    
                                    </>
                                     
                                )
                                :
                                <span className="text-green-600">Checked in</span>
                            }
                        </td>



                       {booking.isCheckedIn? (booking.isCheckedOut? <span className="text-green-600">Checked out</span> :<td className="border px-4 py-2"> <input 
                                            type="number" 
                                            placeholder="Enter OTP" 
                                            onChange={(e) => handleOtpChange2( e.target.value)}
                                            className="mr-3"
                                        /><button
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={()=>{checkout(booking)}}
                                        >
                                            checkout
                                        </button></td>):<td className="border px-4 py-2">Not checked in</td>}
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
