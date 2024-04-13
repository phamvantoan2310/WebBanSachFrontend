import React, { useEffect, useState } from "react";
import UserModel from "../../../models/UserModel";
import { deleteUser, getUserByRoleID, getUserByUserNameContaining } from "../../../api/userApi";
import { Link } from "react-router-dom";

const User: React.FC = () => {
    const token = localStorage.getItem("tokenLogin");
    const [users, setUsers] = useState<UserModel[]>();
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);

    useEffect(() => {      //role staff
        if (token) {
            getUserByRoleID(token, 3).then(
                result => {
                    setUsers(result);
                    setdataload(false);
                }
            ).catch(
                error => {
                    console.log(error);
                    setdataload(false);
                }
            )
        }
    }, [])

    const [userName, setUserName] = useState("");

    const handleSearch = () => {
        if (token) {
            if (userName != "") {
                getUserByUserNameContaining(token, userName).then(
                    result => {
                        setUsers(result);
                    }
                ).catch(
                    error => {
                        console.log(error);
                    }
                )
            } else {
                getUserByRoleID(token, 3).then(
                    result => {
                        setUsers(result);
                        setdataload(false);
                    }
                ).catch(
                    error => {
                        console.log(error);
                        setdataload(false);
                    }
                )
            }
        }
    }

    const handleDeleteUser = (userID: number) =>{
        if(token){
            const confirmDelete = window.confirm("Xác nhận xóa");
            if(confirmDelete){
                deleteUser(token, userID).then(
                    result=>{
                        alert("Xóa thông tin khách hàng thành công !");
                    }
                ).catch(
                    error=>{
                        console.log(error);
                    }
                )
            }else{
                
            }
        }
    }

    if (dataload) {
        return (
            <div>
                <h1>Đang tải dữ liệu</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h1>Gặp lỗi: {error}</h1>
            </div>
        );
    }

    return (
        <div className="container mt-5 pt-5">
            <div className="row">
                <div className="col-md-6">
                    <h1 className="text-start mt-5">Người dùng</h1>
                </div>
                <div className="col-md-6 d-flex">
                    <input className="form-control me-2 mt-5" style={{height:"50px", border:"1px solid violet"}} type="search" placeholder="Tìm kiếm" aria-label="Search" onChange={(e) => setUserName(e.target.value)} value={userName} />
                    <button className="btn btn-outline-primary mt-5 w-50" style={{height:"50px"}} type="button" onClick={handleSearch}>Tìm kiếm khách hàng </button>
                </div>
            </div>
            <hr />
            {users?.map(user =>
                <div className="row mt-5" style={{ backgroundColor: "lightgray", border: "1px solid #44D62C", borderRadius: "10px" }}>
                    <div className="col-md-4">
                        <img
                            src={"data:image/png;base64," + user?.avatar}
                            className="card-img-top"
                            alt={user?.user_name}
                            style={{ height: "250px", width: "180px", borderRadius: "300px" }}
                        />
                    </div>
                    <div className="col-md-5 mt-4">
                        <h3 className="text-start mt-3">ID: {user.user_id}</h3>
                        <h5 className="text-start">{user.user_name}</h5>
                        <h5 className="text-start">{user.phone_number}</h5>
                        <h5 className="text-start">{user.email}</h5>
                    </div>
                    <div className="col-md-3">
                        <Link to={`/staff/user/${user.user_id}`}>
                            <button className="btn btn-primary w-50" style={{ marginTop: "70px" }}>Chi tiết</button>
                        </Link>
                        <button className="btn btn-danger w-50" style={{ marginTop: "30px", marginLeft:"1px" }} onClick={()=>handleDeleteUser(user.user_id)}>Xóa thông tin</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default User;