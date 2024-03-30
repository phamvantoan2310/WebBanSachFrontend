import { jwtDecode } from "jwt-decode";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import CategoryModel from "../../models/CategoryModel";
import { getAllCategory } from "../../api/categoryApi";
import { error } from "console";
interface navbarInterface {
  bookName: string;
  setBookName: (name: string) => void;
}

const Navbar: React.FC<navbarInterface> = (props) => {
  const [categorys, setCategorys] = useState<CategoryModel[] | undefined>([]);


  const [temporaryBookName, setTemporaryBookName] = useState<string>("");

  const onSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTemporaryBookName(e.target.value);
  }
  const handleSearch = () => {
    props.setBookName(temporaryBookName);
  }

  const token = localStorage.getItem("tokenLogin");

  const navigate = useNavigate();

  useEffect(()=>{
    getAllCategory().then(
      result=>{
        setCategorys(result);
      }
    ).catch(
      error=>{
        console.log(error);
      }
    )
  },[])

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top ">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">Bookstore</NavLink>  {/* trang chủ */}
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
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown1">  {/* danh sách thể loại */}
                {categorys?.map(category=>(<li><NavLink className="dropdown-item" to={`/${category.categoryID}`}>{category.categoryName} </NavLink></li>))}
              </ul>
            </li>
          </ul>
        </div>

        {/* Tìm kiếm */}
        <div className="d-flex">
          <input className="form-control me-2" type="search" placeholder="Tìm kiếm" aria-label="Search" onChange={onSearchInputChange} value={temporaryBookName} />
          <button className="btn btn-outline-success" type="button" onClick={handleSearch}>Tìm kiếm</button>
        </div>


        {/* danh sách yêu thích */}
        <ul className="navbar-nav me-2" style={{ paddingLeft: '10px' }}>
          <li className="nav-item" style={{ marginRight: "10px" }}>
            <NavLink to={"/user/wishList"} style={{ color: 'red' }}>
              <i className="fa fa-heart" aria-hidden="true"></i>
            </NavLink>
          </li>
        </ul>

        {/* Biểu tượng giỏ hàng */}
        <ul className="navbar-nav me-1">
          <li className="nav-item" style={{ marginRight: "15px" }}>
            <NavLink to={"/user/cart"}>
              <i className="fas fa-shopping-cart"></i>
            </NavLink>
          </li>
        </ul>

        {/* account */}
        {token != null && (
          < ul className="navbar-nav me-1">
            <li className="nav-item" style={{ marginRight: "10px" }}>
              <NavLink to={"/account"}>
                <i className="fas fa-user" style={{ color: "gray" }}></i>
              </NavLink>
            </li>
          </ul>
        )}
        {token == null && (
          <NavLink to={"/user/login"}>
            <button className="btn btn-success">Đăng nhập</button>
          </NavLink>
        )}
      </div>
    </nav >
  );
}
export default Navbar;