import React, { useEffect, useState } from "react";
import MeetingModel from "../../../models/MeetingModel";
import { cancelTheMeeting, createMeeting, getAllMeeting, getMeetingByUserID } from "../../../api/meetingApi";
import { jwtDecode } from "jwt-decode";
import UserModel from "../../../models/UserModel";
import { getUserByRoleID, getUserByUserNameContainingAndRoleID } from "../../../api/userApi";

interface JwtPayload {
    isUser: boolean;
    isStaff: boolean;
    isAdmin: boolean;
}

const Meeting: React.FC = () => {
    const token = localStorage.getItem("tokenLogin");

    const [meetings, setMeetings] = useState<MeetingModel[] | undefined>();
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);

    const [adminCondition, setAdminCondition] = useState<boolean>(false);
    const [staffCondition, setStaffCondition] = useState<boolean>(false);
    const [createMeetingCondition, setCreateMeetingCondition] = useState<boolean>(false);

    useEffect(() => {
        if (token) {
            const tokenData = jwtDecode(token);
            if (staffCondition) {
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
            if (adminCondition) {
                getAllMeeting(token).then(
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
    }, [staffCondition, adminCondition])

    useEffect(() => {
        if (token) {
            const decodeToken = jwtDecode(token) as JwtPayload;
            const isAdmin = decodeToken.isAdmin;
            const isStaff = decodeToken.isStaff;
            setAdminCondition(isAdmin);
            setStaffCondition(isStaff);
        }
    }, [])


    const [meetingContent, setMeetingContent] = useState("");
    const [meetingDate, setMeetingDate] = useState("");
    const [meetingTime, setMeetingTime] = useState("");
    const [meetingLocation, setMeetingLocation] = useState("");

    const [staffs, setStaffs] = useState<UserModel[] | undefined>([]);

    console.log(meetingTime);

    useEffect(() => {
        if (token) {
            getUserByRoleID(token, 2).then(
                result => {
                    setStaffs(result);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }, [])

    const [staffName, setStaffName] = useState("");
    const [staffList, setStaffList] = useState<UserModel[] | undefined>();

    const [staffListCondition, setStaffListCondition] = useState<boolean>(false);

    const handleFillterStaff = (staff: UserModel) => {
        setStaffs(staffs?.filter(staffs => staffs.user_name != staff.user_name));
    }

    const handleSearch = () => {
        if (token) {
            if (staffName != "") {
                setStaffListCondition(true);
                getUserByUserNameContainingAndRoleID(token, staffName, 2).then(
                    result => {
                        setStaffList(result);
                    }
                ).catch(
                    error => {
                        console.log(error);
                        setStaffList([]);
                    }
                )
            } else {
                setStaffListCondition(false);
            }
        }
    }

    const handleAddStaffToMeeting = (staff: UserModel) => {
        if (!staffs?.find(staff1 => staff1.user_id == staff.user_id) && staffs) {
            setStaffs([...staffs, staff]);
        } else {
            alert("Nhân viên đã ở trong cuộc họp");
        }
    }


    const handleCreateMeeting = () => {
        if (token) {
            if (meetingContent != "" && meetingDate != "" && meetingLocation != "" && meetingTime != "" && staffs) {
                const staffIDs: number[] = [];

                for (const staff of staffs) {
                    staffIDs.push(staff.user_id);
                }

                createMeeting(token, meetingContent, meetingDate, meetingTime, meetingLocation, staffIDs).then(
                    result => {
                        alert("Tạo cuộc họp thành công" + result);
                    }
                ).catch(
                    error => {
                        console.log(error);
                        alert("tạo cuộc họp thất bại");
                    }
                )
            } else {
                alert("Điền đầy đủ thông tin");
            }
        }
    }

    const handleCancelTheMeeting = (meeting : MeetingModel) =>{
        if(token){
            cancelTheMeeting(token, meeting.meeting_id).then(
                result=>{
                    const meetingList = meetings?.filter(meeting1=>meeting1.meeting_id != meeting.meeting_id);
                    setMeetings(meetingList);
                    alert("Hủy cuộc họp thành công");
                }
            ).catch(
                error=>{
                    console.log(error);
                    alert("Hủy cuộc họp thất bại");
                }
            )
        }
    }


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
            <div className="row">
                <div className="col-md-6">
                    <h1 className="text-start mt-5">Lịch họp</h1>
                </div>
                <div className="col-md-6">
                    {adminCondition && <button className="btn btn-primary" style={{ marginTop: "70px", marginLeft: "500px" }} onClick={() => setCreateMeetingCondition(true)}>Tạo cuộc họp</button>}
                </div>
            </div>
            <hr />
            {meetings?.map(meeting => <div className="container mt-5 row" style={{ backgroundColor: "lightgray", border: "1px solid #44D62C", borderRadius: "10px" }}>
                <div className="col-md-4">
                    <h3 className="text-start">Mã cuộc họp: {meeting.meeting_id}</h3>
                    <h5 className="text-start d-flex mt-5">Nội dung cuộc họp:<p style={{ color: "blueviolet", marginLeft: "10px" }}>{meeting.meeting_content}</p></h5>
                    <h5 className="text-start mt-3 d-flex">Địa điểm: <p style={{ color: "blueviolet", marginLeft: "10px" }}>{meeting.location}</p></h5>
                </div>
                <div className="col-md-4">
                    <h4 className="text-start d-flex mt-5 pt-4">Ngày họp:<p style={{ color: "blueviolet", marginLeft: "10px" }}>{meeting.meeting_schecule + ""}</p></h4>
                    <h4 className="text-start d-flex mt-3">Giờ họp:<p style={{ color: "blueviolet", marginLeft: "10px" }}>{meeting.meeting_hour + ""}</p></h4>
                </div>
                <div className="col-md-4">
                {adminCondition && <button className="btn btn-danger w-50" style={{marginLeft:"224px"}} onClick={()=>handleCancelTheMeeting(meeting)}>Hủy cuộc họp</button>}
                </div>
            </div>)}
            {createMeetingCondition && <div className="container fixed-top" style={{ backgroundColor: "lightgoldenrodyellow", border: "1px solid violet", height: "600px", width: "900px", marginTop: "125px", borderRadius: "20px" }}>
                <button className="btn" style={{ marginLeft: "850px" }} onClick={() => setCreateMeetingCondition(false)}>X</button>
                <h3 style={{ color: "blueviolet" }}>Tạo cuộc họp</h3>
                <div className="row container">
                    <div className="col-md-7">
                        <h6 className="text-start mt-5">Nội dung</h6>
                        <input className="form-control" type="text" placeholder="Nội dung cuộc họp" value={meetingContent} onChange={(e) => setMeetingContent(e.target.value)}></input>
                        <div className="row">
                            <div className="col-md-6">
                                <h6 className="text-start mt-5">Ngày họp</h6>
                                <input className="form-control" type="date" placeholder="Nội dung cuộc họp" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)}></input>
                            </div>
                            <div className="col-md-6">
                                <h6 className="text-start mt-5">Giờ họp</h6>
                                <input className="form-control" type="time" placeholder="Nội dung cuộc họp" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)}></input>
                            </div>
                        </div>
                        <h6 className="text-start mt-5">Địa điểm</h6>
                        <input className="form-control" type="text" placeholder="Địa điểm cuộc họp" value={meetingLocation} onChange={(e) => setMeetingLocation(e.target.value)}></input>
                    </div>
                    <div className="col-md-1">
                        <div className="mt-5" style={{ borderLeft: "1px solid blueviolet", height: "450px" }}>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="d-flex">
                            <input className="form-control mt-5" type="search" placeholder="Tìm kiếm nhân viên" value={staffName} onChange={(e) => setStaffName(e.target.value)}></input>
                            <button className="btn btn-outline-success" type="button" style={{ marginTop: "50px", width: '120px', marginLeft: "5px" }} onClick={handleSearch}>Tìm kiếm</button>
                        </div>

                        {staffListCondition && staffList?.map(staff => (<div className="container mt-3">
                            <button className="btn w-100" style={{ backgroundColor: "white" }} onClick={() => handleAddStaffToMeeting(staff)}>{staff.user_name}</button>
                        </div>))}


                        {staffs?.map(staff => (<div className="d-flex mt-5" style={{ border: "1px solid violet", borderRadius: "5px" }}>
                            <h6 className="text-start mt-2 mb-2" style={{ marginLeft: "10px" }}>{staff.user_name}</h6>
                            <button style={{ marginLeft: "120px", border: "none", backgroundColor: "lightgoldenrodyellow" }} onClick={() => handleFillterStaff(staff)}>x</button>
                        </div>))}
                    </div>
                </div>
                <button className="btn btn-success" style={{ marginBottom: "500px" }} onClick={handleCreateMeeting}>Tạo cuộc họp</button>
            </div>}
        </div>
    );
}

export default Meeting;