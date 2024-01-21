import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './layouts/header/Navbar';
import Footer from './layouts/footer/Footer';
import HomePage from './layouts/homePage/homePage';

function App() {
  const [bookName, setBookName] = useState<string>("");


  return (
    <div className="App">
      <Navbar bookName={bookName} setBookName={setBookName} />
      <HomePage bookName={bookName} />
      <Footer />
    </div>
  );
}

export default App;
