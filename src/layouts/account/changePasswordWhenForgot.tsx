import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ChangePasswordWhenForgot: React.FC = () => {
    const { email } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
    const [errorNewPassword, setErrorNewPassword] = useState<string>('');
    const [errorConfirmNewPassword, setErrorConfirmNewPassword] = useState<string>('');
    const [notification, setNotification] = useState<string>("");

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
        if (newPassword) {
            const endpoint = `http://localhost:8080/account/changepasswordwhenforgotpassword`;
            const changePasswordWhenForgotPasswordResponse = {
                newPassword: newPassword,
                email: email,
            };
            try {
                const response = await fetch(endpoint, {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(changePasswordWhenForgotPasswordResponse)
                });

                const responseData = await response.text();

                if (!response.ok) {
                    console.error("API Response:", responseData);
                    throw new Error("Lỗi API: " + responseData);
                }

                alert("cập nhật mật khẩu thành công, vui lòng đăng nhập lại để tiếp tục");
                navigate("/")
            } catch (error: any) {
                console.error("Lỗi khi gọi API:", error.message);
                setNotification("Lỗi: " + error.message);
            }
        } else {
            setNotification("Chưa nhập đủ thông tin cập nhật");
        }
    };
    return (
        <div className="container">
            <div className="container fixed-top p-4 shadow-lg bg-white rounded" style={{ marginTop: "200px", maxWidth: "800px", border: "1px solid green" }}>
                <h3 className="text-start" style={{ marginLeft: "5px", color: "green" }}>Thay đổi mật khẩu</h3>
                <div>
                    <input type="password" className="form-control mb-3 mt-5" style={{ border: "1px solid green" }} onChange={handleChangeNewPassword} placeholder="Mật khẩu mới" />
                    <div style={{ color: "red" }}>{errorNewPassword}</div>
                    <input type="password" className="form-control mb-3" style={{ border: "1px solid green" }} onChange={handleChangeConfirmNewPassword} placeholder="Nhập lại mật khẩu mới" />
                    <div style={{ color: "red" }}>{errorConfirmNewPassword}</div>
                    <button className="btn btn-primary mt-3" onClick={handleChangePassword}>Thay đổi</button>
                    <div style={{ color: "red" }}>{notification}</div>
                </div>
            </div>
        </div>
    )
}

export default ChangePasswordWhenForgot;