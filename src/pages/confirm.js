import React from 'react';
// import { IconContext } from 'react-icons';
// import { GiConfirmed} from "react-icons/gi";

const Confirmation = () => {
    

    return (
        <>
        <div style={{justifyContent:"center", alignItems:"center", display:"flex"}} className='m-8' >
            {/* <IconContext.Provider value={{color:"green",size:"100px",}} >
            <GiConfirmed/>
            </IconContext.Provider> */}
             <img src='https://i.pinimg.com/originals/57/b5/48/57b54818e2011d482548fb54201ce6c1.gif' alt="success"></img>
            </div>
       
        <div className=' text-center'  >
            
            
            <h1>Confirmation Page</h1>
            <p>Your transaction has been confirmed!</p>
            <p></p>
            
            
        </div>
</>
    );
};

export default Confirmation;