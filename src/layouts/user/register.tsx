import React, { useState } from "react";
import { existByEmail, existByUserName } from "../../api/userApi";

const Register: React.FC = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const [email, setEmail] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [sex, setSex] = useState('m');
    const [avatar, setAvatar] = useState<File | null>(null);


    const [errorUserName, setErrorUserName] = useState<string>('');
    const [errorPassword, setErrorPassword] = useState<string>('');
    const [errorPasswordAgain, setErrorPasswordAgain] = useState<string>('');
    const [errorEmail, setErrorEmail] = useState<string>('');
    const [errorSex, setErrorSex] = useState('');
    const [notification, setNotification] = useState<string>('');

    //convert file to base64
    const getBase64 = (file : File): Promise<string | null> =>{
        return new Promise((resolve, reject) =>{
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () =>{
                resolve(reader.result ? (reader.result as string).split(',')[1] : null);
            }
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        //set lại tất cả các lỗi
        setErrorUserName('');
        setErrorPassword('');
        setErrorPasswordAgain('');
        setErrorEmail('');
        setErrorSex('');

        // trách click liên tục
        e.preventDefault();

        if (errorUserName == '' && errorPassword == '' && errorPasswordAgain == '' && errorEmail == '' && errorSex == '') {

            const fileToBase64 = avatar ? await getBase64(avatar) : null;

            try {
                const endpoint = "http://localhost:8080/account/register";
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        userName: userName,
                        password: password,
                        email: email,
                        phoneNumber: phonenumber,
                        sex: (sex=='f'?0:1),
                        avatar: fileToBase64
                    })
                });

                if (response.ok) {
                    setNotification("Đăng ký thành công!");
                } else {
                    console.log(response.json());
                    setNotification("Đã xảy ra lỗi trong quá trình đăng ký");
                }
            } catch (error) {
                console.log(error);
                setNotification("Đã xảy ra lỗi trong quá trình đăng ký tài khoản");
            }
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
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        if(e.target.files){
            const file = e.target.files[0];
            setAvatar(file);
        }
    }

    return (
        <div className="container mt-5 pt-5">
            <h1 className="mt-5 text-center">Đăng ký</h1>
            <div className="mb-3 col-md-6 col-12 mx-auto">
                <form onSubmit={handleSubmit} className="form">
                    <div className="mb-3">
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
                    <div className="mb-3">
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
                    <div className="mb-3">
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
                    <div className="mb-3">
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
                    <div className="mb-3">
                        <label htmlFor="soDienThoai" className="form-label">Số điện thoại</label>
                        <input
                            type="text"
                            id="soDienThoai"
                            className="form-control"
                            value={phonenumber}
                            onChange={(e) => setPhonenumber(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="gioiTinh" className="form-label">Giới tính</label>
                        <select className="form-select"  aria-label="Size 3 select example" onChange={(e) => setSex(e.target.value)}>
                            <option >Chọn giới tính</option>
                            <option >m</option>
                            <option >f</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="avatar" className="form-label">Avatar</label>
                        <input
                            type="file"
                            id="avatar"
                            className="form-control"
                            accept="images/*"
                            onChange={handleAvatarChange}
                        />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary">Đăng Ký</button>
                        <div style={{ color: "green" }}>{notification}</div>

                    </div>
                </form>
            </div>
        </div>

    );
}

export default Register;