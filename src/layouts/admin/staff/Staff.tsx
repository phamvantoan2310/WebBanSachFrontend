import React, { ChangeEvent, useEffect, useState } from "react";
import UserModel from "../../../models/UserModel";
import { adminUpdateStaff, createUser, deleteUser, existByEmail, existByUserName, findStaffContainingStaffName, getUserByRoleID } from "../../../api/userApi";
import RequireAdmin from "../../../util/requireAdmin";
import { Link, useNavigate } from "react-router-dom";
import GetBase64 from "../../../util/getBase64";

const StaffAdmin: React.FC = () => {
    const token = localStorage.getItem("tokenLogin");
    const navigate = useNavigate();

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

    const [staffSelectedToChangeInformation, setStaffSelectedToChangeInformation] = useState<UserModel | null>(null);  //change information

    const openBoxChangeInformation = (staff: UserModel) => {
        setStaffSelectedToChangeInformation(staff);
    }
    const closeBoxChangeInformation = () => {
        setStaffSelectedToChangeInformation(null);
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
        if (token && staffSelectedToChangeInformation) {
            const changeInformationCondition = window.confirm("Xác nhận thay đổi");
            if (changeInformationCondition) {
                adminUpdateStaff(token, staffSelectedToChangeInformation?.user_id, userNameStaffToExchange, emailStaffToExchange, phoneNumberStaffToExchange, addressStaffToExchange, avatarStaffToExchange).then(
                    result => {
                        alert("Đổi thông tin thành công");
                        navigate(0);
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
    const [notification, setNotification] = useState<string>('');

    const handleCreateNewStaff = async () => {
        if (userNameCreate && phoneNumberCreate && emailCreate && addressCreate && sexCreate) {
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
                            navigate(0);
                        }
                    ).catch(
                        error => {
                            console.log(error);
                            alert("thêm thất bại");
                        }
                    )
                }
            }
        } else {
            console.log(userNameCreate, phoneNumberCreate, emailCreate, addressCreate, sexCreate);
            setNotification("Cần nhập đủ thông tin");
        }
    }

    const handleDeleteStaff = (staffID: number) => {
        if (token) {
            const confirmDelete = window.confirm("Xác nhận xóa nhân viên?");
            if (confirmDelete) {
                deleteUser(token, staffID).then(
                    result => {
                        const newStaffs = staffs?.filter(staff => staff.user_id != staffID)
                        setStaffs(newStaffs);
                        alert("Xóa nhân viên thành công");
                    }
                ).catch(
                    error => {
                        console.log(error);
                        alert("Xóa thất bại");
                    }
                )
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
                <hr className="mb-1" />
                <div className="d-flex">
                    <input className="form-control mt-5 mb-5" type="Search" placeholder="tên nhân viên" style={{ marginRight: "20px", height: "50px", width: "570px" }} onChange={(e) => setStaffNameWantToSearch(e.target.value)} value={staffNameWantToSearch}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearchStaff();
                            }
                        }}
                    ></input>
                    <button className="btn btn-primary mt-5 mb-5" style={{ height: "50px", width: "200px" }} onClick={handleSearchStaff}>Tìm kiếm</button>
                </div>

                <div className="row">
                    <div className="overflow-auto col-md-8" style={{ maxHeight: "600px", maxWidth: "800px" }}>
                        {staffs?.map((staff) => (<div className="container mb-5" style={{ border: "1px solid violet", borderRadius: "10px", backgroundColor: "white" }}>
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
                                    <h6 className="text-start"> Số điện thoại: {staff.phone_number}</h6>
                                    <h6 className="text-start"> Email: {staff.email}</h6>
                                    <h6 className="text-start">Địa chỉ: {staff.address}</h6>
                                </div>
                                <div className="col-md-4 pt-5 mt-2 row">
                                    <div className="col-md-6">
                                        <button className="btn btn-warning" style={{ width: "100px" }} onClick={() => openBoxChangeInformation(staff)}>Chỉnh sửa</button>
                                    </div>
                                    <div className="col-md-6">
                                        <button className="btn btn-danger" onClick={() => handleDeleteStaff(staff.user_id)} >Xóa</button>
                                    </div>
                                </div>
                            </div>
                        </div>))}
                    </div>

                    <div className="container col-md-4" style={{ border: "2px solid green", borderRadius: "20px", backgroundColor: "lightgoldenrodyellow" }}>
                        <button className="btn" style={{ marginLeft: "650px" }} onClick={closeBoxChangeInformation}><h6>x</h6></button>
                        <h3 className="mb-5">Chi tiết thông tin</h3>
                        <input className="form-control mb-5" placeholder={staffSelectedToChangeInformation?.user_name} onChange={(e) => { setUserNameStaffToExchange(e.target.value) }}></input>
                        <input className="form-control mb-5" placeholder={staffSelectedToChangeInformation?.phone_number} onChange={(e) => { setPhoneNumberStaffToExchange(e.target.value) }}></input>
                        <input className="form-control mb-5" placeholder={staffSelectedToChangeInformation?.email} onChange={(e) => { setEmailStaffToExchange(e.target.value) }}></input>
                        <input className="form-control mb-5" placeholder={staffSelectedToChangeInformation?.address} onChange={(e) => { setAddressStaffToExchange(e.target.value) }}></input>
                        <input className="form-control mb-5" type="file" onChange={handleChooleFileToChangeAvatarStaff}></input>
                        <button className="btn btn-success" onClick={handleChangeInformationStaff}>Thay đổi</button>
                    </div>
                </div>


                {formCreateNewStaffCondition && (
                    <div className="container fixed-top" style={{ marginTop: "170px", border: "2px solid green", borderRadius: "20px", width: "700px", height: "550px", backgroundColor: "#E2EAF4" }}>
                        <button className="btn" style={{ marginLeft: "650px" }} onClick={closeFormCreateNewStaff}><h6>x</h6></button>
                        <h3 className="mb-5">Thêm nhân viên mới</h3>
                        <input className="form-control mb-3" placeholder="Họ và tên" onChange={(e) => { setUserNameCreate(e.target.value) }}></input>
                        <input className="form-control mb-3" placeholder="Số điện thoại" onChange={(e) => { setPhoneNumberCreate(e.target.value) }}></input>
                        <input className="form-control mb-3" placeholder="Email" onChange={(e) => { setEmailCreate(e.target.value) }}></input>
                        <input className="form-control mb-3" placeholder="Địa chỉ" onChange={(e) => { setAddressCreate(e.target.value) }}></input>
                        <select className="form-select mb-3" aria-label="Size 3 select example" onChange={(e) => { setSexCreate(e.target.value == "Nam" ? true : false) }}>
                            <option >Chọn giới tính</option>
                            <option >Nam</option>
                            <option >Nữ</option>
                        </select>
                        <input className="form-control mb-3" type="file" onChange={handleSetAvatarCreate}></input>
                        <button className="btn btn-success" onClick={handleCreateNewStaff}>Tạo tài khoản</button>
                        <div style={{ color: "red" }}>{notification}</div>
                    </div>
                )}
            </div>
        </div>
    );
}

const Staff = RequireAdmin(StaffAdmin);

export default Staff;