import React, { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom";
import { existByEmail } from "../../api/userApi";
import { AlipaySquareFilled } from "@ant-design/icons";
const Login = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [logIn, setLogin] = useState(false);
    const navigate = useNavigate();
    const handleLogin = () => {
        const loginRequest = {
            userName: userName,
            password: password
        };
        const endpoint: string = "http://localhost:8080/account/login";

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(loginRequest)
        }).then(
            response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Đăng nhập thất bại");
                }
            }
        ).then(
            data => {
                const { jwt } = data;
                //lưu token vào localStorage
                localStorage.setItem('tokenLogin', jwt);
                setLogin(true);
                navigate("/");
                setError("đăng nhập thành công")
            }
        ).catch(
            error => {
                console.log(error);
                setLogin(false);
                <Navigate replace to="/user/login" />
                setError("Kiểm tra lại tên đăng nhập hoặc mật khẩu");
            }
        )
    }

    const [forgotPasswordCondition, setForgotPasswordCondition] = useState<boolean>(false);
    const [notification, setNotification] = useState<string>("");

    const [email, setEmail] = useState<string>("");
    const [otp, setOTP] = useState<string>("");

    const requestOTP = async () => {
        if (email) {
            const alreadyEmail = await existByEmail(email);
            if (alreadyEmail) {
                const endpoint: string = `http://localhost:8080/account/sendOTP?email=${email}`;
                await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                }).then(
                    response => {
                        alert("Kiểm tra mã xác thực trong email.")
                    }
                ).catch(
                    error => {
                        console.log(error);
                    }
                )
            } else {
                alert("Email chưa được đăng ký!")
            }

        }
    }

    const handleCheckOTP = async () => {
        if (otp && email) {
            const endpoint: string = `http://localhost:8080/account/checkOTP?email=${email}&otp=${otp}`;
            await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
            }).then(
                response => {
                    if (response.ok) {
                        navigate(`/account/changepasswordwhenforgot/${email}`)
                    } else {
                        alert("Xác thực thất bại");
                    }
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }

    return (
        <form className='container pt-5 mt-5'
            onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
            }}>
            <div className="form-signin">
                <div style={{ height: "500px", width: "400px", backgroundColor: "#cce6ff", marginLeft: "480px", borderRadius: "7px" }}>
                    <h1 className="h3 mb-3 mt-2 pt-5 font-weight-normal" style={{ color: "blue" }}>Đăng nhập</h1>
                    <input type="username" id="username" className="form-control mb-4 mt-5 w-75" style={{ marginLeft: "60px" }} placeholder="UserName"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <input type="password" id="inputPassword" className="form-control mb-2 w-75" style={{ marginLeft: "60px" }} placeholder="Password" required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label onClick={() => setForgotPasswordCondition(true)} className="mt-3" style={{ color: "blue" }}>Quên mật khẩu?</label>
                    <Link to={"/user/register"} style={{ textDecoration: "none" }}>
                        <p style={{ color: "blue" }} className="mt-3">Bạn chưa có tài khoản?</p>
                    </Link>
                    <button className="btn btn-lg btn-primary btn-block mt-5" type="submit" onClick={handleLogin} >Đăng nhập</button>
                    {error && <div style={{ color: 'red' }}>{error}</div>}

                    {/*form quên mật khẩu */}
                    {forgotPasswordCondition && <div className="container fixed-top p-4 shadow-lg bg-white rounded" style={{ marginTop: "200px", marginLeft: "535px", maxWidth: "500px", border: "1px solid green" }}>
                        <h3 className="text-start" style={{ marginLeft: "5px", color: "green" }}>Xác thực OTP</h3>
                        <button className="btn btn-danger position-absolute top-0 end-0 m-3" onClick={() => setForgotPasswordCondition(false)}>X</button>
                        <div className="mt-5">
                            <div className="input-group mb-3">
                                <input type="text" className="form-control" placeholder="Nhập email" style={{ border: "1px solid green" }} onChange={(e) => setEmail(e.target.value)} />
                                <button className="btn btn-outline-success" type="button" id="button-addon2" onClick={requestOTP}>Nhận OTP</button>
                            </div>
                            <input type="text" className="form-control mb-3" style={{ border: "1px solid green" }} placeholder="OTP" onChange={(e) => setOTP(e.target.value)} />
                            <button className="btn btn-primary mt-3" onClick={handleCheckOTP}>Kiểm tra</button>
                            <div style={{ color: "red" }}>{notification}</div>
                        </div>
                    </div>}
                </div>
            </div>
        </form>
    );
}

export default Login;