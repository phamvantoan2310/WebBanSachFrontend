import React, { useEffect, useState } from "react";
import { getAUser } from "../../api/userApi";
import UserModel from "../../models/UserModel";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { getOrderByUserID } from "../../api/orderApi";
import OrderModel from "../../models/OrderModel";

const Account: React.FC = () => {
    const token = localStorage.getItem("tokenLogin");
    const [user, setUser] = useState<UserModel | null>(null);
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);
    const [orders, setOrders] = useState<OrderModel[] | undefined>([]);
    const navigate = useNavigate();

    const [formUserCondition, setFormUserCondition] = useState<boolean>(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (token) {
            const dataToken = jwtDecode(token);
            if (dataToken.exp != undefined ? dataToken.exp : 0 > Math.floor(Date.now())) {
                getAUser(token).then(
                    result => {
                        setUser(result);
                        setdataload(false);
                    }
                ).catch(
                    error => {
                        seterror(error);
                        setdataload(false);
                    }
                )
            } else {
                navigate("/user/login");
                return;
            }
        } else {
            navigate("/user/login");
            return;
        }
    }, [token])


    useEffect(() => {
        if (token && user) {
            getOrderByUserID(user?.user_id, token).then(
                result => {
                    setOrders(result);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }, [user])

    const handleChangeInformationUser = async () => {
        const dataUserChange = {
            phoneNumber: phoneNumber,
            email: email,
            address: address
        };
        const endpoint = "http://localhost:8080/user/changeInformationUser";
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dataUserChange)
        });

        if (response.ok) {
            alert("thay đổi thành công");
        }
        return response;
    }

    const handleLogOut = () => {
        localStorage.removeItem("tokenLogin");

        navigate("/");
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
        <div style={{ backgroundColor: "orange" }}>
            <div className="container mt-5 pt-5">
                <img
                    src={"data:image/png;base64," + user?.avatar}
                    className="card-img-top"
                    alt={user?.user_name}
                    style={{ height: '300px', width: '200px', borderRadius: "300px", marginTop: "40px" }}
                />
                <h4 style={{ color: "white" }}>{user?.user_name}</h4>
                <div className="row">
                    <h5 className="text-start col-md-2">Số điện thoại: </h5>
                    <h5 className="text-start col-md-6" style={{ color: "white", paddingRight: "700px" }}> {user?.phone_number}</h5>
                </div>
                <div className="row">
                    <h5 className="text-start col-md-2">Email: </h5>
                    <h5 className="text-start col-md-6" style={{ color: "white", paddingRight: "700px" }}> {user?.email}</h5>
                </div>
                <div className="row">
                    <h5 className="text-start col-md-2">Địa chỉ: </h5>
                    <h5 className="text-start col-md-6" style={{ color: "white", paddingRight: "200px" }}> {user?.address}</h5>
                </div>
                <div className="row" style={{ paddingRight: "200px" }}>
                    <div className="col-md-6">
                        <button className="btn" style={{ backgroundColor: "burlywood" }} onClick={() => { setFormUserCondition(formUserCondition ? false : true) }}>{formUserCondition ? "Đóng form" : "Thay đổi thông tin"}</button>
                    </div>
                    <div className="col-md-6" style={{ marginLeft: "700px" }}>
                        {formUserCondition && (<form>
                            <div className="mb-3">
                                <label className="form-label">Số điện thoại:</label>
                                <input type="text" className="form-control" onChange={(e) => { setPhoneNumber(e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email:</label>
                                <input type="text" className="form-control" onChange={(e) => { setEmail(e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Địa chỉ:</label>
                                <input type="text" className="form-control" onChange={(e) => { setAddress(e.target.value) }} />
                            </div>
                            <button type="submit" className="btn btn-primary" onClick={handleChangeInformationUser}>Thay đổi</button>
                        </form>)}
                    </div>
                </div>
                <hr style={{ color: "white" }} />
                <h3 className="text-start">Đơn hàng</h3>
                <div className="row">
                    <div className="col-md-6">
                        <Link to={"/user/order"} state={{orders}} style={{ textDecoration: 'none' }}>
                            <i className="fa fa-shopping-basket" aria-hidden="true" style={{ fontSize: '50px', color:"black" }}></i>
                            <h6 style={{ color: "white" }}>Đơn hàng({orders?.length})</h6>
                        </Link>
                    </div>
                    <div className="col-md-6" >
                
                    </div>
                </div>
                <hr style={{ color: "white" }} />
                <div className=" mt-5 pt-5">
                    <button className="btn btn-success" onClick={handleLogOut}>Đăng xuất</button>
                </div>
                <br />
                <br />
            </div>
        </div>
    );
}

export default Account;