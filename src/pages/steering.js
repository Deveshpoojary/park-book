import React from 'react';

import Steering from "../images/steering-wheel.png";
const LoadingAnimation = () => {
    return (
        <><div className="flex items-center justify-center h-screen">
            <div className="animate-spin ">
               <img src={Steering} alt="steering" width={50}/>
            </div>
            Loading....
        </div>
        
        </>
    );
};

export default LoadingAnimation;
