import React, { useState } from "react"   
import { Link, Navigate, useNavigate } from "react-router-dom";
const Login = () =>{
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [logIn, setLogin] = useState(false);
    const navigate = useNavigate();
    const handleLogin = () =>{
        const loginRequest = {
            userName: userName,
            password: password
        };
        const endpoint : string = "http://localhost:8080/account/login";

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-type' : 'application/json',
            },
            body: JSON.stringify(loginRequest)
        }).then(
            response =>{
                if(response.ok){
                    return response.json();
                }else{
                    throw new Error("Đăng nhập thất bại");
                }
            }
        ).then(
            data =>{
                const {jwt} = data;
                //lưu token vào localStorage
                localStorage.setItem('tokenLogin', jwt);
                setLogin(true);
                navigate("/");
                setError("đăng nhập thành công")
            }
        ).catch(
            error=>{
                console.log(error);
                setLogin(false);
                <Navigate replace to="/user/login"/>
                setError("Kiểm tra lại tên đăng nhập hoặc mật khẩu");
            }
        )
    }

    return(
        <div className='container'>
            <div className="form-signin">
                <h1 className="h3 mb-3 font-weight-normal">Đăng nhập</h1>
                <label className="sr-only">Tên đăng nhập</label>
                <input type="username" id="username" className="form-control mb-2" placeholder="UserName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <label className="sr-only">Password</label>
                <input type="password" id="inputPassword" className="form-control mb-2" placeholder="Password" required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="checkbox mb-3">
                    <label>
                        <input type="checkbox" value="remember-me" /> Remember me
                    </label>
                </div>
                <button className="btn btn-lg btn-primary btn-block" type="button" onClick={handleLogin} >Đăng nhập</button>
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </div>
        </div>
    );
}

export default Login;