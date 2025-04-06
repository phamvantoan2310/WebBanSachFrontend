import { jwtDecode } from "jwt-decode";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import CategoryModel from "../../models/CategoryModel";
import { getAllCategory } from "../../api/categoryApi";
import { HomeOutlined, SettingOutlined, ShoppingCartOutlined, UnorderedListOutlined } from "@ant-design/icons";

interface JwtPayload {
  isAdmin: boolean;
  isStaff: boolean;
  isUser: boolean;
}
interface navbarInterface {
  bookName: string;
  setBookName: (name: string) => void;
}

const Navbar: React.FC<navbarInterface> = (props) => {
  const [categorys, setCategorys] = useState<CategoryModel[] | undefined>([]);
  const [temporaryBookName, setTemporaryBookName] = useState<string>("");
  const [staffCondition, setStaffCondition] = useState<boolean>(false);
  const [adminCondition, setAdminCondition] = useState<boolean>(false);

  const onSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTemporaryBookName(e.target.value);
  }
  const handleSearch = () => {
    props.setBookName(temporaryBookName);
  }

  const navigate = useNavigate();

  const token = localStorage.getItem("tokenLogin");

  useEffect(() => {
    getAllCategory().then(
      result => {
        setCategorys(result);
      }
    ).catch(
      error => {
        console.log(error);
      }
    )
  }, [])


  useEffect(() => {
    if (token) {
      const decodeToken = jwtDecode(token) as JwtPayload;
      const isStaff = decodeToken.isStaff;
      const isAdmin = decodeToken.isAdmin;

      setStaffCondition(isStaff);
      setAdminCondition(isAdmin);
    }
  }, [navigate])

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top ">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/" style={{ color: "blueviolet", fontSize: "30px" }}>Bookstore</NavLink>  {/* trang chủ */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/"><HomeOutlined style={{ fontSize: "30px", marginLeft: "15px" }} /></Link>
            </li>
            {staffCondition && <li className="nav-item" title="Xác nhận đơn hàng">
              <Link className="nav-link active" aria-current="page" to="/staff/confirmorder" ><ShoppingCartOutlined style={{ fontSize: "30px" }} /></Link>
            </li>}
            <li className="nav-item dropdown" title="Thể loại">
              <button className="nav-link dropdown-toggle" id="navbarDropdown1" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <UnorderedListOutlined style={{ fontSize: "30px", marginLeft: "15px" }} />
              </button>
              <ul className="dropdown-menu overflow-auto" aria-labelledby="navbarDropdown1" style={{ maxHeight: "400px", maxWidth: "1300px" }}>  {/* danh sách thể loại */}
                {adminCondition && <li><NavLink className="dropdown-item text-end" to={`/admin/category`}><SettingOutlined /></NavLink></li>}
                {staffCondition && <li><NavLink className="dropdown-item text-end" to={`/admin/category`}><SettingOutlined /></NavLink></li>}
                {categorys?.map(category => (<li><NavLink className="dropdown-item" to={`/${category.categoryID}`} style={{ color: " #800080" }}>{category.categoryName} </NavLink></li>))}
              </ul>
            </li>
            {adminCondition && <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/admin/author">Tác giả</Link>
            </li>}
            {staffCondition && <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/admin/author">Tác giả</Link>
            </li>}
            {adminCondition && <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/admin/revenue">Doanh thu</Link>
            </li>}
          </ul>
        </div>

        {/* Tìm kiếm */}
        <div className="d-flex" style={{ marginRight: "250px" }}>
          <input className="form-control me-1" style={{ width: "400px" }} type="search" placeholder="Tìm kiếm" aria-label="Search" onChange={onSearchInputChange} value={temporaryBookName} />
          <button className="btn btn-outline-success" type="button" onClick={handleSearch}>Tìm kiếm</button>
        </div>

        {/* danh sách yêu thích */}
        {!staffCondition && !adminCondition &&
          <ul className="navbar-nav me-2" style={{ paddingLeft: '10px', fontSize: "30px" }} title="Danh sách yêu thích">
            <li className="nav-item" style={{ marginRight: "20px" }}>
              <NavLink to={"/user/wishList"} style={{ color: 'red' }}>
                <i className="fa fa-heart" aria-hidden="true"></i>
              </NavLink>
            </li>
          </ul>}

        {/* Biểu tượng giỏ hàng */}
        {!staffCondition && !adminCondition &&
          <ul className="navbar-nav me-1" title="Giỏ hàng">
            <li className="nav-item" style={{ marginRight: "30px", fontSize: "30px" }}>
              <NavLink to={"/user/cart"}>
                <i className="fas fa-shopping-cart"></i>
              </NavLink>
            </li>
          </ul>}

        {/* Biểu tượng kho */}
        {staffCondition &&
          <ul className="navbar-nav me-3" style={{ paddingLeft: '10px', fontSize: "30px" }} title="Kho hàng">
            <li className="nav-item" style={{ marginRight: "10px" }}>
              <NavLink to={"/staff/warehouse"} >
                <i className="fa fa-home" aria-hidden="true"></i>
              </NavLink>
            </li>
          </ul>}

        {/* Biểu tượng đơn hàng cần sử lý*/}
        {staffCondition &&
          <ul className="navbar-nav me-1" title="Xử lý báo cáo đơn hàng" style={{ fontSize: "30px" }}>
            <li className="nav-item" style={{ marginRight: "15px" }}>
              <NavLink to={"/staff/report"} style={{ color: 'red' }}>
                <i className="fa fa-info" style={{ color: "red" }} aria-hidden="true"></i>
              </NavLink>
            </li>
          </ul>}

        {/* Biểu tượng hóa đơn */}
        {adminCondition &&
          <ul className="navbar-nav me-1" style={{ paddingLeft: '10px', fontSize: "30px" }} title="Hóa đơn" >
            <li className="nav-item" style={{ marginRight: "10px" }}>
              <NavLink to={"/admin/bill"} >
                <ShoppingCartOutlined style={{ color: "lightgray" }} aria-hidden="true" />
              </NavLink>
            </li>
          </ul>}

        {/* Biểu tượng kho */}
        {adminCondition &&
          <ul className="navbar-nav me-3" style={{ paddingLeft: '10px', fontSize: "30px" }} title="Kho hàng">
            <li className="nav-item" style={{ marginRight: "10px" }}>
              <NavLink to={"/staff/warehouse"} >
                <i className="fa fa-home" aria-hidden="true"></i>
              </NavLink>
            </li>
          </ul>}

        {/* Biểu tượng nhân viên*/}
        {adminCondition &&
          <ul className="navbar-nav me-1" title="Quản lý nhân viên" style={{ fontSize: "30px" }}>
            <li className="nav-item" style={{ marginRight: "15px" }}>
              <NavLink to={"/admin/staff"} style={{ color: 'red' }}>
                <i className="fa fa-users" style={{ color: "red" }} aria-hidden="true"></i>
              </NavLink>
            </li>
          </ul>}

        {/* account */}
        {token != null && (
          < ul className="navbar-nav me-1" title="Tài khoản" style={{ fontSize: "30px" }}>
            <li className="nav-item" style={{ marginRight: "10px", fontSize: "30px" }}>
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
