import { jwtDecode } from "jwt-decode";
import React, { ComponentType, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface JwtPayload {
    isAdmin: boolean;
    isStaff: boolean;
    isUser: boolean;
}

const RequireStaff = <P extends Object>(WrappedComponent: React.ComponentType<P>) => {
    const WithStaffCheck: React.FC<P> = (props) => {
        const navigate = useNavigate();
        useEffect(() => {
            const token = localStorage.getItem("tokenLogin");

            if (!token) {
                navigate("/user/login");
                return;
            } else {
                const decodeToken = jwtDecode(token) as JwtPayload;
                const isStaff = decodeToken.isStaff;

                if (!isStaff) {
                    navigate("/403Page");
                    return;
                }
            }
        }, [navigate])
        return <WrappedComponent {...props}/>
    }
    return WithStaffCheck;
}
export default RequireStaff;