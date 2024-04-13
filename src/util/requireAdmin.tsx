import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";


interface JwtPayload{
    isAdmin: boolean;
    isStaff: boolean;
    isUser: boolean;
}

const RequireAdmin = <P extends object>(WrappedComponent: React.ComponentType<P>) => {     //kiểm tra, phân quyền tại frontend
    const WithAdminCheck: React.FC<P> = (props) =>{
        const navigate = useNavigate();
        useEffect(()=>{
            const token = localStorage.getItem("tokenLogin");

            if(!token){
                navigate("/user/login");
                return;
            }else{
                const decodedToken = jwtDecode(token) as JwtPayload;
                const isAdmin = decodedToken.isAdmin;

                if(!isAdmin){
                    navigate("/403Page");
                    return;
                }
            }
        },[navigate]);
        return <WrappedComponent {...props}/>
    }
    return WithAdminCheck;
}

export default RequireAdmin;