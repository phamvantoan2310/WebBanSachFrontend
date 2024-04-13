import React, { useEffect, useState } from "react";
import ReportModel from "../../../models/ReportModel";
import { Link, useNavigate } from "react-router-dom";
import { getAllReport } from "../../../api/reportApi";
import RequireStaff from "../../../util/requireStaff";

const ReportStaff: React.FC = () => {
    const token = localStorage.getItem("tokenLogin");
    const navigate = useNavigate();

    const [reports, setReports] = useState<ReportModel[] | undefined>([]);
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);

    useEffect(() => {
        if (token) {
            getAllReport(token).then(
                result => {
                    setReports(result);
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
            <h1 className="text-start">Xử lý báo cáo</h1>
            <hr />
            {reports?.map(report => (
                <div className="row mt-5" style={{ backgroundColor: "white", borderRadius: "10px", border: "1px solid black" }}>
                    <div className="col-md-6">
                        <h3 className="text-start" style={{ color: "burlywood" }}>Mã báo cáo: {report.reportID}</h3>
                        <h6 className="text-start">Ngày báo cáo: {report.createReportDate}</h6>
                        <h6 className="text-start">Lý do: {report.reportDetail}</h6>

                    </div>
                    <div className="col-md-6">
                        <Link to={`/staff/reportprocess/${report.reportID}`}>
                            <button className="btn btn-primary w-25" style={{ marginTop: "10px", marginLeft: "300px" }}>{report.reportResponse === null ? "Xử lý" : "Chi tiết"}</button>
                        </Link>
                        {report.reportResponse !== null && <button className="btn btn-success w-25" style={{marginTop: "10px", marginBottom: "10px", marginLeft: "300px" }}>Đã phản hồi</button>}
                    </div>
                </div>
            ))}
        </div>
    );
}

const Report = RequireStaff(ReportStaff);
export default Report;