import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './layouts/header/Navbar';
import Footer from './layouts/footer/Footer';
import HomePage from './layouts/homePage/homePage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BookDetail from './layouts/product/bookDetail';
import Register from './layouts/user/register';
import Activate from './layouts/user/activate';
import Login from './layouts/user/login';
import Test from './layouts/user/test';
import AddBook_Admin from './layouts/admin/addBook';
import ListBook from './layouts/product/listBook';
import WishListItem from './layouts/wishList/wishListItem';
import BookInWishList from './layouts/wishList/bookInWishList';
import Cart from './layouts/cart/cart';
import Pay from './layouts/cart/pay';

function App() {
  const [bookName, setBookName] = useState<string>("");


  return (
    <div className="App" style={{backgroundColor:"#FFFAFA"}}>
      <BrowserRouter>
        <Navbar bookName={bookName} setBookName={setBookName} />
        <Routes>
          <Route path='/' element={<HomePage bookName={bookName}/>}/>
          <Route path='/:categoryID' element={<HomePage bookName={bookName}/>}/>   {/* truyền vào mã thể loại */}
          <Route path='/book/:bookID' element={<BookDetail />}/>
          <Route path='/user/register' element={<Register />}/>
          <Route path='/user/activate/:email/:activationCode' element={<Activate />} />
          <Route path='/user/login' element={<Login />}/>
          <Route path='/user/test' element={<Test />}/>
          <Route path='/admin/addbook' element={<AddBook_Admin />}/>
          <Route path='/user/wishList' element={<WishListItem />}/>
          <Route path='/user/wishList/:wishListID/:wishListName' element={<BookInWishList/>}/>
          <Route path='/user/cart' element={<Cart />}/>
          <Route path='/user/pay' element={<Pay />}/>
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

 

export default App;
