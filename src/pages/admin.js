import React from 'react';
import UpdatePrices from './updateprice';
import UpdateSlots from './updateslots';
import Adminhist from './adminhist';
import { useState,useEffect } from 'react';

import { useAuth0 } from '@auth0/auth0-react';
const Admin = () => {
    
    const { user } = useAuth0();
    const [page, setPage] = useState("1");
    const [admin,setadmin]=useState("false");
    const [loading,setLoading]=useState();
  
    

    useEffect(() => {
        if (user) {
         setadmin(user.email === "tharunrai14@gmail.com");
        setLoading(false);
    }
    else{
        setLoading(true);
    }
        // Check if the user is an admin only when the component mounts or user changes
       
    }, [user]); // Depend on user.email

    function handle(e){
        setPage(e.target.name);

    }
    

    return (
      < > {admin? <> <div >
           <button className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600' name='1' onClick={handle}>
            Update Prices
            </button>

            <button className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600' name="2" onClick={handle}>
            Admin History
            </button>

            
            <button className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600' name="3" onClick={handle}>
                                slots            </button>
           
        </div>
        {page==="1"?<UpdatePrices/>:(page==="2"?<Adminhist/>:<UpdateSlots/>)}
        </>

       
        :
        
        <div>
            <h1>Access Denied</h1>
            </div>}


        </>
    );
};

export default Admin;