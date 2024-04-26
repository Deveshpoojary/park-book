// import React, { createContext, useContext, useState } from 'react';

// const PageContext = createContext();

// export function usePage() {
//   return useContext(PageContext);
// }

// export function PageProvider({ children }) {
//   const [visited, setVisited] = useState({
//     bookings: false,
//     confirmation: false
//   });

//   return (
//     <PageContext.Provider value={{ visited, setVisited }}>
//       {children}
//     </PageContext.Provider>
//   );
// }
