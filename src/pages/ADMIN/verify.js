import React, { useState,useEffect } from 'react';
import {  useAuth0 } from '@auth0/auth0-react';

const Verify = () => {
    const user = useAuth0();
    
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [verified, setVerified] = useState(true);
    useEffect(() => {

    async function checkverify(){
            if(user.user.email){
        const response =await fetch('https://park-book-9f9254d7f86a.herokuapp.com/api/isverified', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.user.email })
        });
        const data = await response.json();
        console.log(data);
        if (data.isverified===true) {
            setMessage('Your phone number is verified');
            setVerified(true);
        }
        else {
        
            setVerified(false);
            
        }
    }
        };
        checkverify();
        
    }
        , [user.user.email]);

    const handleSendOtp = async () => {
        const response = await fetch('https://park-book-9f9254d7f86a.herokuapp.com/api/sendotp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber })
        });
        const data = await response.json();
        setMessage(data.message);
    };

    const handleVerifyOtp = async () => {
        const response = await fetch('https://park-book-9f9254d7f86a.herokuapp.com/api/verifyotp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber, code: otp,email:user.user.email })
        });
        const data = await response.json();
        setMessage(data.message);
    };

    return (<>
    {
        !user.user.email? <div className='text-white font-bold'>Loading...</div>:
    (!verified? <div>
            <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Enter phone number" />
            <button onClick={handleSendOtp}>Send OTP</button>
            <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
            <button onClick={handleVerifyOtp}>Verify OTP</button>
            <p>{message}</p>{user.user.email}
        </div>:<>already verified </>)
    }
        </>
    );
};

export default Verify;