import React, { ChangeEvent, useEffect, useState } from "react";
import UserModel from "../../../models/UserModel";
import { adminUpdateStaff, createUser, deleteUser, existByEmail, existByUserName, findStaffContainingStaffName, getUserByRoleID } from "../../../api/userApi";
import RequireAdmin from "../../../util/requireAdmin";
import { Link } from "react-router-dom";
import GetBase64 from "../../../util/getBase64";

const StaffAdmin: React.FC = () => {
    const token = localStorage.getItem("tokenLogin");

    const [staffs, setStaffs] = useState<UserModel[] | undefined>([]);
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);

    useEffect(() => {
        if (token) {
            getUserByRoleID(token, 2).then(
                result => {
                    setStaffs(result);
                    setdataload(false);
                }
            ).catch(
                error => {
                    seterror(error);
                    setdataload(false);
                }
            )
        }
    }, [])

    const [staffSelectedToExchangeInformation, setStaffSelectedToExchangeInformation] = useState<UserModel | null>(null);  //change information
    const [boxChangeInformationCondition, setBoxChangeInformationCondition] = useState<boolean>(false);

    const openBoxChangeInformation = (staff: UserModel) => {
        setStaffSelectedToExchangeInformation(staff);
        setBoxChangeInformationCondition(true);
    }
    const closeBoxChangeInformation = () => {
        setStaffSelectedToExchangeInformation(null);
        setBoxChangeInformationCondition(false);
    }

    const handleChooleFileToChangeAvatarStaff = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const avatarBase64 = await GetBase64(e.target.files[0]);
            if (avatarBase64) {
                setAvatarStaffToExchange(avatarBase64);
            }
        }
    }

    const [userNameStaffToExchange, setUserNameStaffToExchange] = useState("");
    const [phoneNumberStaffToExchange, setPhoneNumberStaffToExchange] = useState("");
    const [emailStaffToExchange, setEmailStaffToExchange] = useState("");
    const [addressStaffToExchange, setAddressStaffToExchange] = useState("");
    const [avatarStaffToExchange, setAvatarStaffToExchange] = useState("")

    const handleChangeInformationStaff = () => {
        if (token && staffSelectedToExchangeInformation) {
            const changeInformationCondition = window.confirm("Xác nhận thay đổi");
            if (changeInformationCondition) {
                adminUpdateStaff(token, staffSelectedToExchangeInformation?.user_id, userNameStaffToExchange, emailStaffToExchange, phoneNumberStaffToExchange, addressStaffToExchange, avatarStaffToExchange).then(
                    result => {
                        alert("Đổi thông tin thành công");
                    }
                ).catch(
                    error => {
                        console.log(error);
                        alert("Đổi thông tin thất bại");
                    }
                )
            }
        }
    }


    const [staffNameWantToSearch, setStaffNameWantToSearch] = useState("");   //Staff search
    const handleSearchStaff = () => {
        if (token) {
            if (staffNameWantToSearch != "") {
                findStaffContainingStaffName(token, staffNameWantToSearch).then(
                    result => {
                        setStaffs(result);
                    }
                ).catch(
                    error => {
                        console.log(error);
                    }
                )
            } else {
                getUserByRoleID(token, 2).then(
                    result => {
                        setStaffs(result);
                        setdataload(false);
                    }
                ).catch(
                    error => {
                        seterror(error);
                        setdataload(false);
                    }
                )
            }
        }
    }

    const [formCreateNewStaffCondition, setFormCreateNewStaffCondition] = useState<boolean>(false);  //create staff
    const closeFormCreateNewStaff = () => {
        setFormCreateNewStaffCondition(false);
    }

    const handleSetAvatarCreate = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const avatarBase64 = await GetBase64(e.target.files[0]);
            if (avatarBase64) {
                setAvatarCreate(avatarBase64);
            }
        }
    }

    const [userNameCreate, setUserNameCreate] = useState("");
    const [phoneNumberCreate, setPhoneNumberCreate] = useState("");
    const [emailCreate, setEmailCreate] = useState("");
    const [addressCreate, setAddressCreate] = useState("");
    const [sexCreate, setSexCreate] = useState<boolean>(true);
    const [avatarCreate, setAvatarCreate] = useState("")

    const handleCreateNewStaff = async () => {
        if (token) {
            const userNameError = await existByUserName(userNameCreate);
            const emailError = await existByEmail(emailCreate);
            if (userNameError) {
                alert("tên đăng nhập đã tồn tại");
            } else if (emailError) {
                alert("Email đã được sử dụng")
            } else {
                createUser(token, userNameCreate, "123456789!", phoneNumberCreate, emailCreate, addressCreate, avatarCreate, sexCreate).then(
                    result => {
                        alert("Thêm nhân viên thành công!");
                    }
                ).catch(
                    error => {
                        console.log(error);
                        alert("thêm thất bại");
                    }
                )
            }
        }
    }

    const handleDeleteStaff = (staffID:number) =>{
        if(token){
            deleteUser(token, staffID).then(
                result=>{
                    const newStaffs = staffs?.filter(staff=>staff.user_id != staffID)
                    setStaffs(newStaffs);
                    alert("Xóa nhân viên thành công");
                }
            ).catch(
                error=>{
                    console.log(error);
                    alert("Xóa thất bại");
                }
            )
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
        <div className="mb-5 pb-5" style={{ backgroundColor: "lightgoldenrodyellow" }}>
            <div className="container mt-5 pt-5" >
                <div className="row">
                    <div className="col-md-8">
                        <h1 className="text-start">Quản lý nhân sự</h1>
                    </div>
                    <div className="col-md-4">
                        <button className="btn btn-success mt-5" style={{ marginLeft: "230px" }} onClick={() => setFormCreateNewStaffCondition(true)}>Thêm nhân viên mới</button>
                    </div>
                </div>
                <hr className="mb-5" />
                <div className="d-flex">
                    <input className="form-control mt-5 mb-5" type="Search" placeholder="tên nhân viên" style={{ marginRight: "20px", height: "50px", width: "500px" }} onChange={(e) => setStaffNameWantToSearch(e.target.value)} value={staffNameWantToSearch}></input>
                    <button className="btn btn-primary mt-5 mb-5" style={{ height: "50px", width: "200px" }} onClick={handleSearchStaff}>Tìm kiếm</button>
                </div>
                {staffs?.map((staff) => (<div className="container mt-5" style={{ border: "1px solid violet", borderRadius: "10px", backgroundColor: "white" }}>
                    <div className="row">
                        <div className="col-md-3">
                            <Link to={``}>
                                <img
                                    src={"data:image/png;base64," + staff.avatar}
                                    className="card-img-top"
                                    alt={staff.user_name}
                                    style={{ height: '150px', width: '100px' }}
                                />
                            </Link>
                        </div>
                        <div className="col-md-5">
                            <Link to={``} style={{ textDecoration: 'none' }}>
                                <h4 className="text-start">{staff.user_name}</h4>
                            </Link>
                            <h5 className="text-start"> Số điện thoại: {staff.phone_number}</h5>
                            <h5 className="text-start"> Email: {staff.email}</h5>
                            <h5 className="Địa chỉ" style={{ paddingRight: "97px" }}>Địa chỉ: {staff.address}</h5>
                        </div>
                        <div className="col-md-4 pt-5 mt-2 row">
                            <div className="col-md-6">
                                <button className="btn btn-warning w-75" onClick={() => openBoxChangeInformation(staff)}>Chỉnh sửa</button>
                            </div>
                            <div className="col-md-6">
                                <button className="btn btn-danger w-75" onClick={() => handleDeleteStaff(staff.user_id)} >Xóa</button>
                            </div>
                        </div>
                    </div>
                </div>))}
                {boxChangeInformationCondition && staffSelectedToExchangeInformation != null && (
                    <div className="container fixed-top" style={{ marginTop: "170px", border: "2px solid green", borderRadius: "20px", width: "700px", height: "550px", backgroundColor: "lightgoldenrodyellow" }}>
                        <button className="btn" style={{ marginLeft: "650px" }} onClick={closeBoxChangeInformation}><h6>x</h6></button>
                        <h3 className="mb-5">Thay đổi thông tin</h3>
                        <input className="form-control mb-5" placeholder={staffSelectedToExchangeInformation.user_name} onChange={(e) => { setUserNameStaffToExchange(e.target.value) }}></input>
                        <input className="form-control mb-5" placeholder={staffSelectedToExchangeInformation.phone_number} onChange={(e) => { setPhoneNumberStaffToExchange(e.target.value) }}></input>
                        <input className="form-control mb-5" placeholder={staffSelectedToExchangeInformation.email} onChange={(e) => { setEmailStaffToExchange(e.target.value) }}></input>
                        <input className="form-control mb-5" placeholder={staffSelectedToExchangeInformation.address} onChange={(e) => { setAddressStaffToExchange(e.target.value) }}></input>
                        <input className="form-control mb-5" type="file" onChange={handleChooleFileToChangeAvatarStaff}></input>
                        <button className="btn btn-success" onClick={handleChangeInformationStaff}>Thay đổi</button>
                    </div>
                )}

                {formCreateNewStaffCondition && (
                    <div className="container fixed-top" style={{ marginTop: "170px", border: "2px solid green", borderRadius: "20px", width: "700px", height: "550px", backgroundColor: "lightgoldenrodyellow" }}>
                        <button className="btn" style={{ marginLeft: "650px" }} onClick={closeFormCreateNewStaff}><h6>x</h6></button>
                        <h3 className="mb-5">Thêm nhân viên mới</h3>
                        <input className="form-control mb-3" placeholder="Họ và tên" onChange={(e) => { setUserNameCreate(e.target.value) }}></input>
                        <input className="form-control mb-3" placeholder="Số điện thoại" onChange={(e) => { setPhoneNumberCreate(e.target.value) }}></input>
                        <input className="form-control mb-3" placeholder="Email" onChange={(e) => { setEmailCreate(e.target.value) }}></input>
                        <input className="form-control mb-3" placeholder="Địa chỉ" onChange={(e) => { setAddressCreate(e.target.value) }}></input>
                        <select className="form-select mb-3" aria-label="Size 3 select example" onChange={(e) => { setSexCreate(e.target.value == "m" ? true : false) }}>
                            <option >Chọn giới tính</option>
                            <option >m</option>
                            <option >f</option>
                        </select>
                        <input className="form-control mb-3" type="file" onChange={handleSetAvatarCreate}></input>
                        <button className="btn btn-success" onClick={handleCreateNewStaff}>Tạo tài khoản</button>
                    </div>
                )}
            </div>
        </div>
    );
}

const Staff = RequireAdmin(StaffAdmin);

export default Staff;