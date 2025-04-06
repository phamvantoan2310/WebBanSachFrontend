import React, { useState } from "react";
import { existByEmail, existByUserName } from "../../api/userApi";

const Register: React.FC = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const [email, setEmail] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [sex, setSex] = useState('m');
    const [address, setAddress] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [birthday, setBirthday] = useState("");


    const [errorUserName, setErrorUserName] = useState<string>('');
    const [errorPassword, setErrorPassword] = useState<string>('');
    const [errorPasswordAgain, setErrorPasswordAgain] = useState<string>('');
    const [errorEmail, setErrorEmail] = useState<string>('');
    const [errorSex, setErrorSex] = useState('');
    const [errorAddress, setErrorAddress] = useState('');
    const [notification, setNotification] = useState<string>('');

    //convert file to base64
    const getBase64 = (file: File): Promise<string | null> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result ? (reader.result as string).split(',')[1] : null);
            }
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async () => {
        //set lại tất cả các lỗi
        setErrorUserName('');
        setErrorPassword('');
        setErrorPasswordAgain('');
        setErrorEmail('');
        setErrorSex('');
        setErrorAddress('');

        // trách click liên tục
        if (userName && password && passwordAgain && email && sex && address) {
            if (errorUserName == '' && errorPassword == '' && errorPasswordAgain == '' && errorEmail == '' && errorSex == '' && errorAddress == '') {

                const fileToBase64 = avatar ? await getBase64(avatar) : null;

                try {
                    const endpoint = "http://localhost:8080/account/register";

                    const user = {
                        userID: 0,
                        userName: userName,
                        password: password,
                        email: email,
                        phoneNumber: phonenumber,
                        sex: (sex == 'f' ? 0 : 1),
                        address: address,
                        avatar: fileToBase64,
                        birthday: birthday,
                    };

                    const userResponse = {
                        user: user,
                        role: 3
                    }


                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                        },
                        body: JSON.stringify(userResponse),
                    });

                    if (response.ok) {
                        setNotification("Đăng ký thành công!");
                    } else {
                        setNotification("Đã xảy ra lỗi trong quá trình đăng ký");
                    }
                } catch (error) {
                    console.log(error);
                    setNotification("Đã xảy ra lỗi trong quá trình đăng ký tài khoản");
                }
            }
        } else {
            setNotification("Chưa nhập đủ thông tin!")
        }
    }

    const handleUserNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUserName(e.target.value);
            let result = await existByUserName(e.target.value);   //kiểm tra tên đăng nhập
            if (result === true) {
                setErrorUserName("Tên đăng nhập đã tồn tại");
                return true;
            }
            if (result === false) {
                setErrorUserName('');
                return false;
            }
        } catch (error) {
            console.log("ERROR: " + error);
        }
    }

    const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setEmail(e.target.value);
            let result = await existByEmail(e.target.value);  //kiểm tra email
            if (result === true) {
                setErrorEmail("Email đã được sử dụng");
                return true;
            }
            if (result === false) {
                setErrorEmail('');
                return false;
            }
        } catch (error) {
            console.log("ERROR: " + error);
        }
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        const result = e.target.value;

        const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

        if (!passwordRegex.test(result)) {   //kiểm tra điều kiện password
            setErrorPassword("Mật khẩu phải có ít nhất 8 ký tự và có ít nhất một ký tự đặc biệt");
            return true;
        } else {
            setErrorPassword('');
            return false;
        }
    }

    const handlePasswordAgainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordAgain(e.target.value);
        const result = e.target.value;

        if (result != password) {      //kiểm tra mật khẩu nhập lại
            setErrorPasswordAgain("Mật khẩu không trùng khớp");
            return true;
        } else {
            setErrorPasswordAgain('');
            return false;
        }
    }

    //xử lý thay đổi file
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setAvatar(file);
        }
    }

    return (
        <div className="container pt-5">
            <div style={{ height: "600px", width: "1000px", backgroundColor: " #E7F5DC", marginLeft: "150px", borderRadius: "7px" }}>
                <h1 className="mt-5 mb-5 pb-3 text-center" style={{ color: " #728156" }}>Đăng ký</h1>
                <form className="form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}>
                    <div className="mb-3 row">
                        <div className="col-md-5" style={{ marginLeft: "40px" }}>
                            <div className="mb-3 text-start">
                                <label htmlFor="tenDangNhap" className="form-label">Tên đăng nhập</label>
                                <input
                                    type="text"
                                    id="tenDangNhap"
                                    className="form-control"
                                    value={userName}
                                    onChange={handleUserNameChange}
                                />
                                <div style={{ color: "red" }}>{errorUserName}</div>
                            </div>
                            <div className="mb-3 text-start">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="text"
                                    id="text"
                                    className="form-control"
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                                <div style={{ color: "red" }}>{errorEmail}</div>
                            </div>
                            <div className="mb-3 text-start">
                                <label htmlFor="matKhau" className="form-label">Mật khẩu</label>
                                <input
                                    type="password"
                                    id="matKhau"
                                    className="form-control"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                                <div style={{ color: "red" }}>{errorPassword}</div>
                            </div>
                            <div className="mb-3 text-start">
                                <label htmlFor="matKhauLapLai" className="form-label">Nhập lại mật khẩu</label>
                                <input
                                    type="password"
                                    id="matKhauLapLai"
                                    className="form-control"
                                    value={passwordAgain}
                                    onChange={handlePasswordAgainChange}
                                />
                                <div style={{ color: "red" }}>{errorPasswordAgain}</div>
                            </div>
                        </div>
                        <div className="col-md-1">

                        </div>
                        <div className="col-md-5">
                            <div className="mb-3 text-start">
                                <label htmlFor="soDienThoai" className="form-label">Số điện thoại</label>
                                <input
                                    type="text"
                                    id="soDienThoai"
                                    className="form-control"
                                    value={phonenumber}
                                    onChange={(e) => setPhonenumber(e.target.value)}
                                />
                            </div>
                            <div className="mb-3 text-start">
                                <label htmlFor="gioiTinh" className="form-label">Giới tính</label>
                                <select className="form-select" aria-label="Size 3 select example" onChange={(e) => setSex(e.target.value)}>
                                    <option >Chọn giới tính</option>
                                    <option >Nam</option>
                                    <option >Nữ</option>
                                </select>
                            </div>
                            <div className="mb-3 text-start">
                                <label htmlFor="diaChi" className="form-label">Địa chỉ</label>
                                <input
                                    type="text"
                                    id="diaChi"
                                    className="form-control"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                            <div className="mb-3 text-start">
                                <label htmlFor="ngaySinh" className="form-label">Ngày sinh</label>
                                <input
                                    type="Date"
                                    id="ngaySinh"
                                    className="form-control"
                                    value={address}
                                    onChange={(e) => {
                                        const date = new Date(e.target.value);
                                        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                                        setBirthday(formattedDate);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="text-start" style={{ width: "940px", marginLeft: "40px" }}>
                            <label htmlFor="avatar" className="form-label">Avatar</label>
                            <input
                                type="file"
                                id="avatar"
                                className="form-control"
                                accept="images/*"
                                onChange={handleAvatarChange}
                            />
                        </div>
                        <div className="text-center mt-5">
                            <button type="submit" className="btn" style={{ backgroundColor: " #88976C", color: "white" }}>Đăng Ký</button>
                            <div style={{ color: "green" }}>{notification}</div>
                        </div>
                    </div>
                </form>
            </div>
        </div>

    );
}

export default Register;