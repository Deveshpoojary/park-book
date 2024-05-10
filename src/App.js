
// import HomePage from './pages/home'
// import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Book from './pages/book';

import Admin from './pages/admin';
import Main from './pages/main';
import HomePage from './pages/home';
import NotFoundPage from './pages/notfound';
import History from './pages/history'; 
import Adminhist from "./pages/adminhist";
import Confirmerror from "./pages/confirmerror";
// import { PageProvider } from "./pages/PageContext";
function App() {
  return (


    <>
    {/* <PageProvider> */}
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/home" element={<HomePage/>}/>
          <Route path="/book" element={<Book/>}/>
         
          <Route path="/admin" element={<Admin/>}/>
          <Route path="/history" element={<History/>}/>
          <Route path="/adminhist" element={<Adminhist/>}/>
          <Route path="/confirmerror" element={<Confirmerror/>}/>
          <Route path="*" element={<NotFoundPage/>}/>
          
      </Routes>
    </BrowserRouter>
    {/* </PageProvider> */}
    </>
  );
}

export default App;
