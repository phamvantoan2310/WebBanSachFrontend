import React, { useEffect, useState } from "react";
import UserModel from "../../../models/UserModel";
import { getAUserByEvaluateID } from "../../../api/userApi";

interface UserEvaluateInterface {
    evaluateID: number;
}

const UserEvaluate: React.FC<UserEvaluateInterface> = (Props) => {
    const evaluateID: number = Props.evaluateID;

    const [user, setuser] = useState<UserModel | null>(null);
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);

    useEffect(() => {
        getAUserByEvaluateID(evaluateID).then(
            result => {
                setuser(result);
                setdataload(false);
            }
        ).catch(
            error => {
                seterror(error);
                setdataload(false);
            }
        )
    }, [evaluateID])

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
        <div className="container text-start row">
            <div className="col-md-2">
                <img src={"data:image/png;base64," + user?.avatar} style={{ width: '50px' }} />
            </div>
            <div className="col-md-3">
                <h3 style={{width:"200px", color:"GrayText"}}>{user?.user_name}</h3>
            </div>
        </div>
    );
}

export default UserEvaluate;