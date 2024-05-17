import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { set } from 'firebase/database';
import { Alert } from '@mui/material';
import LoadingAnimation from './steering';
// import { FaSearch } from "react-icons/fa";

const Adminhist = () => {
    const { user } = useAuth0();
    const [bookings, setBookings] = useState([""]);
    const [count, setcount] = useState(0);
    const [otp, setOtp] = useState();
    const [otp2, setOtp2] = useState();
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);
    const [mess, setMess] = useState("");
    useEffect(() => {
        fetchUserBookings();
    }, [count]); // Dependency array includes user.email to refetch when it changes



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
                    bookingId: booking.bookingId,
                    checkInTime: trimdaytime,
                    checkinotp: otp
                })
            });




            await response.json(); // Parse JSON response in async manner
            switch (response.status) {

                case 200: console.log("success");
                    setMess("Checked in successfully");

                    setcount(count + 1);
                    break;
                case 209: console.log("New Slot Assigned", response.newSlotId);
                    setMess("New Slot Assigned", response.newSlotId);
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
                    checkoutotp: otp2
                })
            });
            const res = await response.json(); // Parse JSON response in async manner
            console.log("succes/", res); // Logging the response
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
        if (searchTerm === "") {
            setBookings(searchResults);
        }
        else {
            const results = bookings.filter(booking =>

                (booking.vehicleNumber && booking.vehicleNumber.includes(searchTerm)) ||

                (booking.userId && booking.userId.toLowerCase().includes(searchTerm.toLowerCase()))
            );

            setBookings(results);
            console.log("searchResults", results);
        }

    }, [searchTerm]);




    return (
        <div className='bg-primary text-white min-h-screen'>
            <span className="flex text-2xl font-bold mb-4 px-2 py-4 border-b border-gray-500 bg-secondary shadow-lg"><h1 className='l-border fam'>All Bookings</h1><button onClick={() => setcount(count + 1)} className="bg-white hover:bg-black hover:text-white text-black font-bold py-1 px-2 border border-white ml-2 rounded-md">Refresh</button>
                {error && <Alert severity="error" onClose={() => { setError(null) }}>{error}</Alert>}
                {mess && <Alert severity="success" onClose={() => { setMess(null) }}>{mess}</Alert>}
            </span>


            {!loading ? (<>
                <div className='px-4 py-4'>
                <table className="w-full border-collapse mt-2 rounded-lg">
                    <thead>
                        <th colSpan={10} className="border border-gray-300 px-4 py-2">
                            {/* <FaSearch className='search text-gray-400'/> */}
                            <input
                                type="text"
                                placeholder="Search"
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border border-gray-300 px-4 py-2 rounded-lg bg-secondary">
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
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {!booking.isCheckedIn ?
                                            (isBookingExpired(booking.bookedTill) ?
                                                <span className="text-red-600 font-bold">Booking Expired</span> :
                                                <>{booking.bookedFrom < new Date().toISOString().slice(0, 19).replace('T', ' ') ? (<p className="text-yellow-400 font-bold">Not Today</p>) : <>


                                                    <input
                                                        type="number"
                                                        placeholder="  Enter OTP"
                                                        onChange={(e) => handleOtpChange(e.target.value)}
                                                        className="placeholder-gray-900 mr-2 text-black rounded-md py-1"
                                                    />
                                                    <button
                                                        className="bg-cyan-500 hover:bg-black text-white font-bold py-1 px-2 rounded border border-white mt-2"
                                                        onClick={() => { checkin(booking) }}
                                                    >
                                                        Checkin
                                                    </button>
                                                </>}

                                                </>

                                            )
                                            :
                                            <span className="text-green-600 font-bold">Checked in</span>
                                        }
                                    </td>


                                    <td className="border border-gray-300 px-4 py-2 text-center">  
                                    {booking.isCheckedIn ? (booking.isCheckedOut ? <span className="text-green-600 font-bold ">Checked out</span> : <p className=" px-4 py-2"> <input
                                        type="number"
                                        placeholder="  Enter OTP"
                                        onChange={(e) => handleOtpChange2(e.target.value)}
                                        className="placeholder-gray-900 mr-3 text-black rounded-md py-1"
                                    /><button
                                        className="bg-cyan-500  border border-white hover:bg-black text-white font-bold mt-2 py-1 px-2 rounded"
                                        onClick={() => { checkout(booking) }}
                                    >
                                            checkout
                                        </button></p>) : <p className="text-red-600 px-4 py-2 font-bold">Not checked in</p>}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table></div></>)


                : (
                    <LoadingAnimation />)

            }
        </div>
    );
};
export default Adminhist;
