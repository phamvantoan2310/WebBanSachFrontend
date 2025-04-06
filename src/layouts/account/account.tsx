import React, { useEffect, useState } from "react";
import { deleteUser, existByEmail, existByUserName, getAUser, getUserByRoleID, getUserByUserNameContainingAndRoleID } from "../../api/userApi";
import UserModel from "../../models/UserModel";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { completeOrder, deleteOrder, getOrderByOrderID, getOrderByUserID } from "../../api/orderApi";
import OrderModel from "../../models/OrderModel";
import { CameraOutlined, HomeOutlined, LogoutOutlined, MailOutlined, PhoneOutlined, SettingOutlined } from "@ant-design/icons";
import OrderItem from "../user/order/orderComponent/orderItem";
import Format from "../../util/ToLocaleString";

interface JwtPayload {
    isAdmin: boolean;
    isStaff: boolean;
    isUser: boolean;
}

const Account: React.FC = () => {
    const token = localStorage.getItem("tokenLogin");
    const [user, setUser] = useState<UserModel | null>(null);
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);
    const [orders, setOrders] = useState<OrderModel[] | undefined>([]);
    const navigate = useNavigate();

    const [formUserCondition, setFormUserCondition] = useState<boolean>(false);
    const [userName, setUsername] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [notification, setNotification] = useState<string>("");

    const [staffCondition, setStaffCondition] = useState<boolean>(false);     //role stafff
    const [adminCondition, setAdminCondition] = useState<boolean>(false);     //role admin

    const [customers, setCustomers] = useState<UserModel[]>();

    const [changePasswordCondition, setChangePasswordCondition] = useState<boolean>(false);
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
    const [errorNewPassword, setErrorNewPassword] = useState<string>('');
    const [errorConfirmNewPassword, setErrorConfirmNewPassword] = useState<string>('');


    useEffect(() => {
        if (token) {
            const dataToken = jwtDecode(token) as JwtPayload;
            if (dataToken.isStaff) {
                setStaffCondition(true);
            }
            if (dataToken.isAdmin) {
                setAdminCondition(true);
            }
        } else {
            navigate("/user/login");
        }
    }, [token])

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


    useEffect(() => {                              //role user
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


    // kiểm tra tên đăng nhập và email khi cập nhật
    const checkUserName = async (userName: string) => {
        if (userName) {
            const exist = await existByUserName(userName);
            if (exist) {
                setNotification("Tên đăng nhập đã tồn tại!");
            } else {
                setNotification("");
            }
        }
    }

    const checkEmail = async (email: string) => {
        if (email) {
            const exist = await existByEmail(email);
            if (exist) {
                setNotification("Email đã tồn tại!");
            } else {
                setNotification("");
            }
        }
    }

    const handleChangeInformationUser = async () => {
        if (userName || phoneNumber || email || address) {
            if (notification === "Tên đăng nhập đã tồn tại!" || notification === "Email đã tồn tại!") {

            } else {
                const dataUserChange = {
                    userName: userName,
                    phoneNumber: phoneNumber,
                    email: email,
                    address: address
                };
                const endpoint = "http://localhost:8080/user/changeInformationUser";
                const response = await fetch(endpoint, {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(dataUserChange)
                });

                if (response.ok) {
                    alert("Thay đổi thành công, đăng nhập lại để tiếp tục");
                    localStorage.removeItem("tokenLogin");
                    navigate("/");
                }
            }
        } else {
            setNotification("chưa nhập thông tin cập nhật")
        }
    }

    const handleLogOut = () => {
        localStorage.removeItem("tokenLogin");

        navigate("/");
    }


    //handle order
    const handleDeleteOrder = (orderID: number) => {
        if (token != null) {
            const confirmDelete = window.confirm("Xác nhận xóa đơn hàng?");
            if (confirmDelete) {
                deleteOrder(orderID, token).then(
                    result => {
                        const updatedOrders = orders?.filter(order => order.orderID !== orderID);
                        setOrders(updatedOrders);
                        alert("xóa thành công");
                    }
                ).catch(
                    error => {
                        console.log(error);
                    }
                )
            }
        } else {
            navigate("/user/login");
            return;
        }
    }

    const handleCancelOrder = (orderID: number) => {
        if (token != null) {
            const confirmCancelOrder = window.confirm("Xác nhận hủy đơn hàng?");
            if (confirmCancelOrder) {
                deleteOrder(orderID, token).then(
                    result => {
                        const updatedOrders = orders?.filter(order => order.orderID !== orderID);
                        setOrders(updatedOrders);
                        alert("xóa thành công");
                    }
                ).catch(
                    error => {
                        console.log(error);
                    }
                )
            }
        } else {
            navigate("/user/login");
            return;
        }
    }

    const handleOrderComplete = (orderID: number) => {
        if (token) {
            completeOrder(token, orderID).then(
                result => {
                    alert("Cảm ơn đã xác nhận đơn hàng");
                    navigate("/account");
                }
            ).catch(
                error => {
                    alert("Gặp lỗi trong quá trình hoàn thiện đơn hàng");
                }
            )
        } else {
            navigate("/user/login");
            return;
        }
    }

    useEffect(() => {      //role staff
        if (token) {
            getUserByRoleID(token, 3).then(
                result => {
                    setCustomers(result);
                    setdataload(false);
                }
            ).catch(
                error => {
                    console.log(error);
                    setdataload(false);
                }
            )
        }
    }, [token])

    const [userNameSearch, setUserNameSearch] = useState("");

    const handleSearch = () => {
        if (token) {
            if (userNameSearch != "") {
                getUserByUserNameContainingAndRoleID(token, userNameSearch, 3).then(
                    result => {
                        setCustomers(result);
                    }
                ).catch(
                    error => {
                        console.log(error);
                    }
                )
            } else {
                getUserByRoleID(token, 3).then(
                    result => {
                        setCustomers(result);
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

    const [orderID, setOrderID] = useState<number>(0);

    const handleOderSearch = () => {
        if (token) {
            if (orderID != 0) {
                getOrderByOrderID(orderID, token).then(
                    result => {
                        if (result) {
                            setOrders([result]);
                        }
                    }
                ).catch(
                    error => {
                        console.log(error);
                    }
                )
            } else {
                if (user?.user_id) {
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
            }
        }
    }

    const handleDeleteUser = (userID: number) => {
        if (token) {
            const confirmDelete = window.confirm("Xác nhận xóa");
            if (confirmDelete) {
                deleteUser(token, userID).then(
                    result => {
                        alert("Xóa thông tin khách hàng thành công !");
                    }
                ).catch(
                    error => {
                        console.log(error);
                    }
                )
            }
        }
    }

    const handleChangeNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
        const result = e.target.value;

        const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

        if (!passwordRegex.test(result)) {   //kiểm tra điều kiện password
            setErrorNewPassword("Mật khẩu phải có ít nhất 8 ký tự và có ít nhất một ký tự đặc biệt");
            return true;
        } else {
            setErrorNewPassword('');
            return false;
        }
    }

    const handleChangeConfirmNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmNewPassword(e.target.value);
        const result = e.target.value;

        if (result != newPassword) {      //kiểm tra mật khẩu nhập lại
            setErrorConfirmNewPassword("Mật khẩu không trùng khớp");
            return true;
        } else {
            setErrorConfirmNewPassword('');
            return false;
        }
    }

    const handleChangePassword = async () => {
        if (token && oldPassword && newPassword) {
            const changePasswordResponse = {
                oldPassword: oldPassword,
                newPassword: newPassword,
            };
            const endpoint = "http://localhost:8080/account/changepassword";
            try {
                const response = await fetch(endpoint, {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(changePasswordResponse)
                });

                const responseData = await response.text(); // Lấy nội dung phản hồi

                if (!response.ok) {
                    console.error("API Response:", responseData);
                    throw new Error("Lỗi API: " + responseData);
                }

                alert("cập nhật mật khẩu thành công, vui lòng đăng nhập lại để tiếp tục");
                handleLogOut();
            } catch (error: any) {
                console.error("Lỗi khi gọi API:", error.message);
                setNotification("Lỗi: " + error.message);
            }
        } else {
            setNotification("Chưa nhập đủ thông tin cập nhật");
        }
    };

    const [activateNotification, setActivateNotification] = useState<string>("")
    const handleAccountActivate = async () => {
        const endpoint = "http://localhost:8080/account/reactivate";
        try {
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(user?.user_id)
            });
            if (!response.ok) {
                throw new Error("fail call api reactivate");
            }
            setActivateNotification("Kiểm tra email để kích hoạt tài khoản");
            return response;

        } catch (error) {
            console.log(email);
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
                <div className="col-md-7" style={{ backgroundColor: "#f2f2f2", height: "750px", borderRadius: "5px" }}>
                    <div className="row">
                        <div className="col-md-6">
                            <h3 className="text-start">Tài khoản </h3>
                        </div>
                        <div className="col-md-6 text-end" style={{ fontSize: "30px" }}>
                            <LogoutOutlined title="Đăng xuất" onClick={handleLogOut} />
                        </div>
                    </div>
                    <img
                        src={"data:image/png;base64," + user?.avatar}
                        className="card-img-top"
                        alt={user?.user_name}
                        style={{ height: '200px', width: '150px', borderRadius: "300px", marginTop: "40px" }}
                    />
                    <h4>{adminCondition && "ADMIN: "} {user?.user_name} <SettingOutlined style={{ color: "blue" }} onClick={() => setFormUserCondition(true)} /></h4>
                    <div className="row mt-5">
                        <h5 className="text-start col-md-6" style={{ paddingLeft: "130px" }}><PhoneOutlined /> Ngày sinh: </h5>
                        <h5 className="text-start col-md-6" > {user?.birthday}</h5>
                    </div>
                    <div className="row mt-3">
                        <h5 className="text-start col-md-6" style={{ paddingLeft: "130px" }}><PhoneOutlined /> Số điện thoại: </h5>
                        <h5 className="text-start col-md-6" > {user?.phone_number}</h5>
                    </div>
                    <div className="row mt-3">
                        <h5 className="text-start col-md-6" style={{ paddingLeft: "130px" }}><MailOutlined /> Email: </h5>
                        <h5 className="text-start col-md-6" > {user?.email}</h5>
                    </div>
                    <div className="row mt-3">
                        <h5 className="text-start col-md-6" style={{ paddingLeft: "130px" }}><HomeOutlined /> Địa chỉ: </h5>
                        <h5 className="text-start col-md-6" > {user?.address}</h5>
                    </div>
                    <div className="text-start mt-3 row" onClick={() => { setChangePasswordCondition(true) }}>
                        <h5 className="text-start col-md-6" style={{ paddingLeft: "130px", color: "blue" }}>Mật khẩu: </h5>
                        <h5 className="text-start col-md-6" style={{ color: "blue" }}>********</h5>
                    </div>

                    {/*form cập nhật */}
                    {formUserCondition && <div className="container fixed-top p-4 shadow-lg bg-white rounded" style={{ marginTop: "200px", maxWidth: "700px", border: "1px solid green" }}>
                        <h3 className="text-start" style={{ marginLeft: "5px", color: "green" }}>Cập nhật</h3>
                        <button className="btn btn-danger position-absolute top-0 end-0 m-3" onClick={() => setFormUserCondition(false)}>X</button>
                        <div>
                            <div className="row mb-2 mt-4">
                                <div className="col-md-6">
                                    <input type="text" className="form-control" style={{ border: "1px solid green" }} onChange={(e) => { setUsername(e.target.value); checkUserName(e.target.value) }} placeholder="Tên đăng nhập" />
                                </div>
                                <div className="col-md-6">
                                    <input type="text" className="form-control" style={{ border: "1px solid green" }} onChange={(e) => { setEmail(e.target.value); checkEmail(e.target.value) }} placeholder="Email" />
                                </div>
                            </div>
                            <div className="row mb-2 mt-3">
                                <div className="col-md-6">
                                    <input type="text" className="form-control" style={{ border: "1px solid green" }} onChange={(e) => { setPhoneNumber(e.target.value) }} placeholder="Số điện thoại" />
                                </div>
                                <div className="col-md-6">
                                    <input type="text" className="form-control" style={{ border: "1px solid green" }} onChange={(e) => { setAddress(e.target.value) }} placeholder="Địa chỉ" />
                                </div>
                            </div>
                            <button className="btn btn-primary mt-3" onClick={handleChangeInformationUser}>Thay đổi</button>
                            <div style={{ color: "red" }}>{notification}</div>
                        </div>
                    </div>}
                    {/*form cập nhật mật khẩu */}
                    {changePasswordCondition && <div className="container fixed-top p-4 shadow-lg bg-white rounded" style={{ marginTop: "200px", maxWidth: "400px", border: "1px solid green" }}>
                        <h3 className="text-start" style={{ marginLeft: "5px", color: "green" }}>Thay đổi mật khẩu</h3>
                        <button className="btn btn-danger position-absolute top-0 end-0 m-3" onClick={() => setChangePasswordCondition(false)}>X</button>
                        <div>
                            <input type="password" className="form-control mb-3 mt-5" style={{ border: "1px solid green" }} onChange={(e) => { setOldPassword(e.target.value) }} placeholder="Mật khẩu cũ" />
                            <input type="password" className="form-control mb-3" style={{ border: "1px solid green" }} onChange={handleChangeNewPassword} placeholder="Mật khẩu mới" />
                            <div style={{ color: "red" }}>{errorNewPassword}</div>
                            <input type="password" className="form-control mb-3" style={{ border: "1px solid green" }} onChange={handleChangeConfirmNewPassword} placeholder="Nhập lại mật khẩu mới" />
                            <div style={{ color: "red" }}>{errorConfirmNewPassword}</div>
                            <button className="btn btn-primary mt-3" onClick={handleChangePassword}>Thay đổi</button>
                            <div style={{ color: "red" }}>{notification}</div>
                        </div>
                    </div>}
                </div>

                {/* kích hoạt tài khoản - user - accountStatus==false */}
                {!staffCondition && !adminCondition && !user?.account_status && <div className="col-md-5">
                    <p style={{ marginLeft: "70px", color: "red", marginTop: "300px" }}>Kích hoạt tài khoản trước khi tiếp tục!</p>
                    <button className="btn btn-danger" style={{ marginLeft: "70px" }} onClick={handleAccountActivate}>Kích hoạt tài khoản</button>
                    <p style={{ marginLeft: "70px", color: "blue", marginTop: "30px" }}>{activateNotification}</p>
                </div>
                }

                {/* danh sách đơn hàng */}
                {!staffCondition && !adminCondition && user?.account_status && <div className="col-md-5">
                    <div className="row">
                        <div className="col-md-6">
                            <h3 className="text-start">Đơn hàng </h3>
                            <p style={{ marginTop: "-10px", marginLeft: "50px" }}>({orders?.length} sản phẩm)</p>
                        </div>
                        <div className="col-md-6 d-flex" style={{ marginLeft: "300px", marginTop: "-40px" }}>
                            <input className="form-control me-2 mt-5" style={{ width: "210px", border: "1px solid violet" }} type="search" placeholder="Tìm kiếm đơn hàng" aria-label="Search" onChange={(e) => setOrderID(Number(e.target.value))} />
                            <button className="btn btn-outline-primary mt-5 w-100" type="button" onClick={handleOderSearch}>Tìm kiếm</button>
                        </div>
                    </div>
                    <div className="container overflow-auto mt-3" style={{ height: "593px", width: "650px" }}>
                        {orders?.map((order) => (
                            <div className="mb-5 row" style={{ backgroundColor: "lightgray", borderRadius: "10px", width: "600px" }}>
                                <div className="col-md-8">
                                    <h6 className="text-start mt-1" style={{ color: "limegreen" }}>Mã đơn hàng: {order.orderID}</h6>
                                    <p className="text-start" style={{ paddingLeft: "30px" }}>Trạng thái: {order.orderStatus}</p>
                                    <p className="text-start" style={{ paddingLeft: "30px" }}>Ngày đặt hàng: {order.orderDate}</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="text-end pt-1" style={{ color: "red" }}>Tổng giá trị: {Format(order.totalPrice)} đ</h6>
                                    {(order.orderStatus == "Đơn Hàng Đang Được Giao") && (<div>
                                        <Link to={`/user/report/${order.orderID}`}>
                                            <button className="btn btn-warning w-100 mb-3" style={{}}>Báo cáo</button>
                                        </Link>
                                        <button className="btn btn-success w-100" style={{}} onClick={() => handleOrderComplete(order.orderID)}>Đã nhận được sách</button>
                                    </div>)}
                                    {(order.orderStatus == "Hoàn Thành") && (<div>
                                        <button className="btn btn-danger w-50 mt-2" style={{}} onClick={() => { handleDeleteOrder(order.orderID) }}>Xóa</button>
                                    </div>)}
                                    {(order.orderStatus == "Đang Chờ Xác Nhận") && (<div>
                                        <button className="btn btn-danger w-50 mt-2" style={{}} onClick={() => { handleCancelOrder(order.orderID) }}>Hủy đơn hàng</button>
                                    </div>)}
                                </div>
                                <OrderItem order={order} />
                            </div>
                        ))}
                    </div>
                </div>}
                {/* danh sách khách hàng */}
                {(staffCondition || adminCondition) && <div className="col-md-5">
                    <div className="row">
                        <div className="col-md-4">
                            <h3 className="text-start">Khách hàng</h3>
                        </div>
                        <div className="col-md-8 d-flex">
                            <input className="form-control me-2 mt-5" style={{ height: "50px", border: "1px solid violet" }} type="search" placeholder="Tìm kiếm khách hàng" aria-label="Search" onChange={(e) => setUserNameSearch(e.target.value)} value={userNameSearch} />
                            <button className="btn btn-outline-primary mt-5 w-50" style={{ height: "50px" }} type="button" onClick={handleSearch}>Tìm kiếm</button>
                        </div>
                    </div>
                    <hr />
                    <div className="overflow-auto" style={{ maxHeight: "570px" }}>
                        {customers?.map(user =>
                            <div className="row mt-3" style={{ backgroundColor: "lightgray", border: "1px solid #44D62C", borderRadius: "10px", marginLeft: "10px", marginRight: "10px" }}>
                                <div className="col-md-9">
                                    <h3 className="text-start mt-3">ID: {user.user_id}</h3>
                                    <h5 className="text-start">{user.user_name}</h5>
                                    <h5 className="text-start">{user.phone_number}</h5>
                                    <h5 className="text-start">{user.email}</h5>
                                </div>
                                <div className="col-md-3">
                                    <Link to={`/staff/user/${user.user_id}`}>
                                        <button className="btn btn-primary w-100 mt-3">Chi tiết</button>
                                    </Link>
                                    <button className="btn btn-danger" style={{ marginTop: "30px" }} onClick={() => handleDeleteUser(user.user_id)}>Xóa thông tin</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>}
            </div>
        </div>
    );
}

export default Account;