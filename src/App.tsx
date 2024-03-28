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
import Login from './layouts/account/login';
import AddBook_Admin from './layouts/admin/addBook';
import ListBook from './layouts/product/listBook';
import WishListItem from './layouts/user/wishList/wishListItem';
import BookInWishList from './layouts/user/wishList/bookInWishList';
import Cart from './layouts/user/cart/cart';
import Pay from './layouts/user/cart/pay';
import Account from './layouts/account/account';
import Order from './layouts/user/order/order';

function App() {
  const [bookName, setBookName] = useState<string>("");


  return (
    <div className="App" style={{backgroundColor:"#FFFAFA"}}>
      <BrowserRouter>
        <Navbar bookName={bookName} setBookName={setBookName} />
        <Routes>
          <Route path='/' element={<HomePage bookName={bookName}/>}/>
          <Route path='/:categoryID' element={<HomePage bookName={bookName}/>}/>   {/* truyền vào mã thể loại, navbar */}
          <Route path='/book/:bookID' element={<BookDetail />}/>                   {/*bookProp */}
          <Route path='/user/register' element={<Register />}/>
          <Route path='/user/activate/:email/:activationCode' element={<Activate />} />  {/*Backend  accountActivate*/}
          <Route path='/user/login' element={<Login />}/>
          <Route path='/admin/addbook' element={<AddBook_Admin />}/>
          <Route path='/user/wishList' element={<WishListItem />}/>                  {/*navbar */}
          <Route path='/user/wishList/:wishListID/:wishListName' element={<BookInWishList/>}/> {/* wishListItem*/}
          <Route path='/user/cart' element={<Cart />}/> {/*navbar */}
          <Route path='/user/pay' element={<Pay />}/>   {/*cart */}
          <Route path='/user/pay/:bookIDOk/:NumberOfBook' element={<Pay />}/> {/*bookDetail */}
          <Route path='/account' element={<Account />}/> {/*navbar */}
          <Route path='/user/order' element={<Order />}/> {/*Account */}
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

 

export default App;
