import React, { useState } from 'react';
import './App.css';
import Navbar from './layouts/header/Navbar';
import Footer from './layouts/footer/Footer';
import HomePage from './layouts/homePage/homePage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BookDetail from './layouts/product/bookDetail';
import Register from './layouts/user/register';
import Activate from './layouts/user/activate';
import Login from './layouts/account/login';
import WishListItem from './layouts/user/wishList/wishListItem';
import BookInWishList from './layouts/user/wishList/bookInWishList';
import Cart from './layouts/user/cart/cart';
import Pay from './layouts/user/cart/pay';
import Account from './layouts/account/account';
import Order from './layouts/user/order/order';
import Author from './layouts/user/author/Author';
import BookChange from './layouts/staff/bookChange/bookChange';
import WareHouse from './layouts/staff/wareHouse/wareHouse';
import AddBook_AdminStaff from './layouts/admin/addBook';
import ReportProcess from './layouts/staff/reportProcess/reportProcessComponent/reportProcess';
import Report from './layouts/staff/reportProcess/report';
import ConfirmOrder from './layouts/staff/confirmOrder/confirmOrder';
import OrderDetail from './layouts/staff/confirmOrder/confirmOrderComponent/orderDetail';
import SendReport from './layouts/user/report/sendReport';
import User from './layouts/staff/User/user';
import UserDetail from './layouts/staff/User/userComponent/userDetail';
import Meeting from './layouts/staff/meeting/meeting';
import Revenue from './layouts/admin/revenue/revenue';
import Staff from './layouts/admin/staff/Staff';


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
          <Route path='/admin/addbook' element={<AddBook_AdminStaff />}/>
          <Route path='/user/wishList' element={<WishListItem />}/>                  {/*navbar */}
          <Route path='/user/wishList/:wishListID/:wishListName' element={<BookInWishList/>}/> {/* wishListItem*/}
          <Route path='/user/cart' element={<Cart />}/> {/*navbar */}
          <Route path='/user/pay' element={<Pay />}/>   {/*cart */}
          <Route path='/user/pay/:bookIDOk/:NumberOfBook' element={<Pay />}/> {/*bookDetail */}
          <Route path='/account' element={<Account />}/> {/*navbar */}
          <Route path='/user/order' element={<Order />}/> {/*Account */}
          <Route path='/user/author/:authorID' element={<Author />}/>
          <Route path='/user/report/:orderID' element={<SendReport />}/>
          <Route path='/staff/changebookinformation/:bookID' element={<BookChange />}/>
          <Route path='/staff/warehouse' element={<WareHouse />}/>
          <Route path='/staff/report' element={<Report />}/>
          <Route path='/staff/reportprocess/:reportID' element={<ReportProcess />}/>
          <Route path='/staff/confirmorder' element={<ConfirmOrder />}/>
          <Route path='/staff/orderdetail/:orderID' element={<OrderDetail />}/>
          <Route path='/staff/user' element={<User />}/>
          <Route path='/staff/user/:userID' element={<UserDetail />}/>
          <Route path='/staff/meeting' element={<Meeting />}/>
          <Route path='/admin/revenue' element={<Revenue />}/>
          <Route path='/admin/staff' element={<Staff />}/>
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

 

export default App;
