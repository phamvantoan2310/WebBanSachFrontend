import React, { useEffect, useState } from "react";
import MeetingModel from "../../../models/MeetingModel";
import { getAllMeeting, getMeetingByUserID } from "../../../api/meetingApi";
import { jwtDecode } from "jwt-decode";

const Meeting: React.FC = () => {
    const token = localStorage.getItem("tokenLogin");

    const [meetings, setMeetings] = useState<MeetingModel[] | undefined>();
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);

    useEffect(() => {
        if (token) {
            const tokenData = jwtDecode(token);
            if (tokenData != undefined && tokenData.jti != undefined) {
                getMeetingByUserID(token, parseInt(tokenData.jti)).then(
                    result => {
                        setMeetings(result);
                        setdataload(false);
                    }
                ).catch(
                    error => {
                        seterror(error);
                        setdataload(false);
                    }
                )
            }
        }
    }, [])


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
        <div className="container mt-5 pt-5">
            <h1 className="text-start mt-5">Lịch họp</h1>
            <hr />
            {meetings?.map(meeting => <div className="container mt-5 row" style={{ backgroundColor: "lightgray", border: "1px solid #44D62C", borderRadius: "10px" }}>
                <div className="col-md-4">
                    <h3 className="text-start">Mã cuộc họp: {meeting.meeting_id}</h3>
                    <h5 className="text-start d-flex mt-5">Nội dung cuộc họp:<p style={{color:"blueviolet", marginLeft:"10px"}}>{meeting.meeting_content}</p></h5>
                    <h5 className="text-start mt-3 d-flex">Địa điểm: <p style={{color:"blueviolet", marginLeft:"10px"}}>{meeting.location}</p></h5>
                </div> 
                <div className="col-md-4">
                <h4 className="text-start d-flex mt-5 pt-4">Ngày họp:<p style={{color:"blueviolet", marginLeft:"10px"}}>{meeting.meeting_schecule+""}</p></h4>
                <h4 className="text-start d-flex mt-3">Giờ họp:<p style={{color:"blueviolet", marginLeft:"10px"}}>{meeting.meeting_hour+""}</p></h4>
                </div>
                <div className="col-md-4">

                </div>
            </div>)}
        </div>
    );
}

export default Meeting;