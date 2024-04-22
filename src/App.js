
// import HomePage from './pages/home'
// import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Book from './pages/book';
import Confirmation from './pages/confirm';
import Rent from './pages/rent';
import Main from './pages/main';
import HomePage from './pages/home';
import NotFoundPage from './pages/notfound';
import History from './pages/history'; 
import Adminhist from "./pages/adminhist";
function App() {
  return (


    <>
    
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/home" element={<HomePage/>}/>
          <Route path="/book" element={<Book/>}/>
          <Route path="/confirm" element={<Confirmation/>}/>
          <Route path="/rent" element={<Rent/>}/>
          <Route path="/history" element={<History/>}/>
          <Route path="/adminhist" element={<Adminhist/>}/>
          <Route path="*" element={<NotFoundPage/>}/>
          
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
