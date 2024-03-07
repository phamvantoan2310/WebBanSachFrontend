import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

const Test = () =>{
    const [username, setUsername] = useState<string | null>(null);

    useEffect(()=>{
        const token = localStorage.getItem('tokenLogin');
        if (token){
            const userData = jwtDecode(token);
            console.log(userData);
            if (userData){
                setUsername(userData.sub+'');
            }
        }
    }, []);

    return (
        <div>
            {
                username&& <div>Xin chào, {username} </div>
            }
        </div>

    );
}

export default Test;