import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReportTypeModel from "../../../models/ReportTypeModel";
import { createReport, getAllReportType } from "../../../api/reportApi";

const SendReport: React.FC = () => {
    const { orderID } = useParams();
    const token = localStorage.getItem("tokenLogin");
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);

    const navigate = useNavigate();

    let orderIDOk = 0;
    try {
        orderIDOk = parseInt(orderID + "");
        if (Number.isNaN(orderIDOk)) {
            orderIDOk = 0;
        }
    } catch (error) {
        console.log(error);
        orderIDOk = 0;
    }

    const [reportTypes, setReportTypes] = useState<ReportTypeModel[] | undefined>([]);
    const [reportDetail, setReportDetail] = useState("");
    const [reportTypeID, setReportTypeID] = useState(0);
    const [reportImage, setReportImage] = useState<File | null>(null);

    useEffect(() => {
        if (token) {
            getAllReportType(token).then(
                result => {
                    setReportTypes(result);
                    setdataload(false);
                }
            ).catch(
                error => {
                    seterror(error);
                    setdataload(false);
                }
            )
        }
    }, [])

    const handleChooseReportType = () => {
        if (reportTypes) {
            const reportTypeID = document.getElementById("reportType") as HTMLSelectElement | null;
            if (reportTypeID && reportTypeID.value && parseInt(reportTypeID.value)) {
                setReportTypeID(parseInt(reportTypeID.value));
            }
        }
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setReportImage(file);
        }
    }

    const handleReportSend = () => {
        if (token && reportTypeID != 0) {
            createReport(token, reportDetail, reportTypeID, orderIDOk, reportImage).then(
                result => {
                    alert("Đã gửi báo cáo của bạn, nhân viên sẽ phản hồi sớm nhất có thể");
                    navigate("/");
                    return;
                }
            ).catch(
                error => {
                    alert("Gặp lỗi: " + error);
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
        <div className="container" style={{ marginTop: "100px" }}>
            <h1 className="text-start">Báo cáo</h1>
            <hr />
            <div className="row">
                <div className="col-md-6">
                    <select id="reportType" className="form-select" multiple aria-label="Multiple select example" style={{ width: "500px" }} onChange={handleChooseReportType}>
                        {reportTypes?.map((reportType) => (<option value={`${reportType.reportTypeID}`} style={{ fontSize: "20px", color: "blue" }}>{reportType.reportTypeName}?</option>))}
                    </select>
                </div>
                <div className="col-md-6">
                    <label htmlFor="reportdetail" className="form-label" style={{marginRight:"500px"}}><h6>Report Detail</h6></label>
                    <input className="form-control" id="reportdetail" placeholder="nhập chi tiết vấn đề cần báo cáo" style={{ width: "700px" }} onChange={(e) => setReportDetail(e.target.value)}></input>
                    <div className="mb-3">
                        <label htmlFor="reportImage" className="form-label pt-5" style={{marginRight:"450px"}}><h6>Report Detail Image</h6></label>
                        <input
                            type="file"
                            id="reportImage"
                            className="form-control"
                            accept="images/*"
                            style={{ width: "700px", backgroundColor: "greenyellow", border: "1px solit black" }}
                            onChange={handleAvatarChange}
                        />
                    </div>
                </div>
            </div>
            <button className="btn btn-success mt-5" onClick={handleReportSend}>Gửi báo cáo</button>
        </div>
    );
}

export default SendReport;