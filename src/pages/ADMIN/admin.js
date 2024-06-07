import React from 'react';
import UpdatePrices from './updateprice';
import UpdateSlots from './updateslots';
import Adminhist from './adminhist';
import Accessdenied from './accessdenied';
import Current from './current';
import UserList from './user';
import { useState, useEffect } from 'react';

import { useAuth0 } from '@auth0/auth0-react';
const Admin = () => {

    const { user } = useAuth0();
    const [page, setPage] = useState("1");
    const [admin, setadmin] = useState("false");
    const [loading, setLoading] = useState();



    useEffect(() => {
        if (user) {
            setadmin(user.email === "deveshpoojary@gmail.com" || user.email === "tharunrai14@gmail.com" ||"karkerabhuvan@gmail.com");
            setLoading(false);
        }
        else {
            setLoading(true);
        }
        // Check if the user is an admin only when the component mounts or user changes

    }, [user]); // Depend on user.email

    function handle(e) {
        setPage(e.target.name);

    }


    return (
        < > <div className='bg-primary min-h-screen'>
            {admin ? <> <div className='bg-primary flex px-4 py-4 shadow-lg border-b border-gray-500' >
                <button className='bg-white text-black border border-white font-bold py-2 px-4 rounded-md hover:bg-black hover:text-white mr-2' name='1' onClick={handle}>
                    Update Prices
                </button>

                <button className='bg-white text-black border border-white font-bold py-2 px-4 rounded-md hover:bg-black hover:text-white mr-2' name="2" onClick={handle}>
                    Admin History
                </button>


                <button className='bg-white text-black border border-white font-bold py-2 px-4 rounded-md hover:bg-black hover:text-white mr-2' name="3" onClick={handle}>
                    Slots            </button>

                <button className='bg-white text-black border border-white font-bold py-2 px-4 rounded-md hover:bg-black hover:text-white mr-2' name="4" onClick={handle}>
                    Current            </button>
                    <button className='bg-white text-black border border-white font-bold py-2 px-4 rounded-md hover:bg-black hover:text-white mr-2' name="5" onClick={handle}>
                    User List            </button>

            </div>
                {page === "1" ? <UpdatePrices /> : page === "2" ? <Adminhist /> : page==="3"? <UpdateSlots />: page ==4?<Current/> :<UserList/> }
            </>


                : loading ? <div className='text-white font-bold'>Loading...</div> :

                <div>
                    {/* <h1 className='text-white font-bold'>Access Denied</h1> */}
                    <Accessdenied/>
                </div>}

        </div>
        </>
    );
};

export default Admin;