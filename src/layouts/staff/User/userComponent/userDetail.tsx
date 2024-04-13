import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserModel from "../../../../models/UserModel";
import { existByEmail, existByUserName, getUserByUserID, staffUpdateUser } from "../../../../api/userApi";

const UserDetail: React.FC = () => {
    const token = localStorage.getItem("tokenLogin");
    const { userID } = useParams();
    let userIDOk = 0;

    try {
        userIDOk = parseInt(userID + '');
        if (isNaN(userIDOk)) {
            userIDOk = 0;
        }
    } catch (error) {
        console.log(error);
        userIDOk = 0;
    }

    const [user, setUser] = useState<UserModel | null>();
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);

    useEffect(() => {
        if (token) {
            getUserByUserID(token, userIDOk).then(
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
        }
    }, [userIDOk])

    const [detailCondition, setDetailCondition] = useState<boolean>(false);

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [sex, setSex] = useState<boolean>(true);


    const[errorUserName, setErrorUserName] = useState("");
    const[errorPassword, setErrorPassword] = useState("");
    const[errorEmail, setErrorEmail] = useState("");
    const[errorPhoneNumber, setErrorPhoneNumber] = useState("");


    const handleUpdateUser = async () =>{
        let userNameCondition = await existByUserName(userName);
        let emailCondition = await existByEmail(email);

        const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if(userName!= "" && userNameCondition == true){
            setErrorUserName("Tên đăng nhập đã tồn tại");
        }else if(!passwordRegex.test(password) && password!=""){
            setErrorPassword("Mật khẩu có tối thiểu 8 ký tự và phải chứa ít nhất một ký tự đặc biệt!");
        }else if(email != "" && emailCondition == true){
            setErrorEmail("Email đã được đăng ký mới một tài khoản khác");
        }else if(phoneNumber && isNaN(parseInt(phoneNumber))){
            setErrorPhoneNumber("Nhập số điện thoại sai định dạng");
        }else{
            if(token && user){
                staffUpdateUser(token, user?.user_id, userName, password, email, phoneNumber, sex, address, "").then(
                    result=>{
                        alert("Cập nhật người dùng thành công");
                    }
                ).catch(
                    error=>{
                        console.log(error);
                        alert("cập nhật thât bại");
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
        <div className="container mt-5 pt-5">
            <h1 className="text-start">Thông tin khách hàng</h1>
            <hr style={{ color: "orangered" }} />
            <div className="container mt-5 mb-5">
                <img
                    src={"data:image/png;base64," + user?.avatar}
                    className="card-img-top"
                    alt={user?.user_name}
                    style={{ height: '300px', width: '200px', borderRadius: "300px", marginTop: "40px" }}
                />
                <h4>{user?.user_name}</h4>
            </div>
            <div>
                <button className="btn btn-success mt-5" onClick={() => setDetailCondition(detailCondition ? false : true)}>{detailCondition ? "Thu gọn" : "Sửa"}</button>
                {detailCondition && user &&
                    <div className="form-control mt-5">
                        <label style={{ marginRight: "1150px" , color:"gray"}}>Tên đăng nhập</label>
                        <input type="text" className="form-control" placeholder={user.user_name} onChange={(e)=>setUserName(e.target.value)}></input>
                        <div style={{ color: "red" }}>{errorUserName}</div>
                        <label style={{ marginRight: "1180px", color:"gray" }}>Mật khẩu</label>
                        <input type="text" className="form-control" onChange={(e)=>setPassword(e.target.value)}></input>
                        <div style={{ color: "red" }}>{errorPassword}</div>
                        <label style={{ marginRight: "1160px", color:"gray" }}>Số điện thoại </label>
                        <input type="text" className="form-control" placeholder={user.phone_number} onChange={(e)=>setPhoneNumber(e.target.value)}></input>
                        <div style={{ color: "red" }}>{errorPhoneNumber}</div>
                        <label style={{ marginRight: "1200px", color:"gray" }}>Địa chỉ</label>
                        <input type="text" className="form-control" placeholder={user.address} onChange={(e)=>setAddress(e.target.value)}></input>
                        <label style={{ marginRight: "1210px", color:"gray" }}>Email</label>
                        <input type="text" className="form-control" placeholder={user.email} onChange={(e)=>setEmail(e.target.value)}></input>
                        <div style={{ color: "red" }}>{errorEmail}</div>
                        <label style={{ marginRight: "1200px", color:"gray" }}>Giới tính</label>
                        <select className="form-select mb-5" id="delivery" aria-label="Default select example" style={{ color: "orange" }} onChange={(e)=>setSex(e.target.value=="1"?true:false)}>
                            <option value="1">Nam</option>
                            <option value="0">Nữ</option>
                        </select>

                        <button className="btn btn-primary" onClick={handleUpdateUser}>Lưu thông tin</button>
                    </div>}
            </div>
        </div>
    );
}

export default UserDetail;