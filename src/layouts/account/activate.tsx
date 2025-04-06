import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const Activate = () =>{
    const {email} = useParams();
    const {activationCode} = useParams();

    const [accountStatus, setAccountStatus] = useState(false);
    const [notification, setNotification] = useState("");

    useEffect(()=>{
        if(email && activationCode){
            accountActivate();
        }
    },[]);

    const accountActivate = async() =>{
        try {
            const endpoint = `http://localhost:8080/account/activate?email=${email}&activationCode=${activationCode}`;
            const response = await fetch(endpoint, {method: "GET"});
            if( response.ok){
                setAccountStatus(true);
            }else{
                setNotification(response.text + "");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <div className="mt-5 pt-5">
            <h1>Kích hoạt tài khoản</h1>
            {
                accountStatus
                ? (<p>kích hoạt tài khoản thành công, vui lòng đăng nhập để tiếp tục</p>)
                :(<p>{notification}</p>)
            }
        </div>
    );

}

export default Activate;
