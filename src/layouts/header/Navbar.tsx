import React, { ChangeEvent, useState } from "react";
import { Link } from "react-router-dom";
interface navbarInterface{
  bookName: string;
  setBookName: (name: string)=>void;
}

const Navbar: React.FC<navbarInterface> = (props)=>{
  const [temporaryBookName, setTemporaryBookName] = useState<string>("");

  const onSearchInputChange = (e: ChangeEvent<HTMLInputElement>)=>{
    setTemporaryBookName(e.target.value);
  }

  const handleSearch = () =>{
    props.setBookName(temporaryBookName);
  }

    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Bookstore</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
  
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">Trang chủ</Link>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown1" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Thể loại sách
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown1">
                  <li><Link className="dropdown-item" to="/1">Thiếu nhi </Link></li>
                  <li><Link className="dropdown-item" to="/2">Hài hước</Link></li>
                  <li><Link className="dropdown-item" to="/3">Nhật ký</Link></li>
                  <li><Link className="dropdown-item" to="/4">Truyện ngắn</Link></li>
                  <li><Link className="dropdown-item" to="/5">Truyện dài</Link></li>
                  <li><Link className="dropdown-item" to="/6">Tâm sự</Link></li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown2" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Quy định bán hàng
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown2">
                  <li><a className="dropdown-item" href="#">Quy định 1</a></li>
                  <li><a className="dropdown-item" href="#">Quy định 2</a></li>
                  <li><a className="dropdown-item" href="#">Quy định 3</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Liên hệ</a>
              </li>
            </ul>
          </div>
  
          {/* Tìm kiếm */}
          <div className="d-flex">
            <input className="form-control me-2" type="search" placeholder="Tìm kiếm" aria-label="Search" onChange={onSearchInputChange} value={temporaryBookName}/>
            <button className="btn btn-outline-success" type="button" onClick={handleSearch}>Tìm kiếm</button>
          </div>
  
          {/* Biểu tượng giỏ hàng */}
          <ul className="navbar-nav me-1">
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="fas fa-shopping-cart"></i>
              </a>
            </li>
          </ul>
  
          {/* Biểu tượng đăng nhập */}
          <ul className="navbar-nav me-1">
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="fas fa-user"></i>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    );
}
export default Navbar;