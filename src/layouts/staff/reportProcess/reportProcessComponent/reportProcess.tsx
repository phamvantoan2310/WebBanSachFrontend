import React, { useEffect, useState } from "react";
import ReportModel from "../../../../models/ReportModel";
import OrderModel from "../../../../models/OrderModel";
import OrderItemModel from "../../../../models/OrderItemModel";
import { useNavigate, useParams } from "react-router-dom";
import ReportTypeModel from "../../../../models/ReportTypeModel";
import { getReportTypebyReportID, getReportbyID, sendResponse } from "../../../../api/reportApi";
import { getOrderByReportID, getOrderItem } from "../../../../api/orderApi";
import UserModel from "../../../../models/UserModel";
import Format from "../../../../util/ToLocaleString";
import BookInReportProcess from "./bookInReportProcess";
import DeliveryTypeModel from "../../../../models/DeliveryTypeModel";
import PaymentModel from "../../../../models/PaymentModel";
import { getDeliveryTypeByOrderID } from "../../../../api/deliveryTypeApi";
import { getPaymentByOrderID } from "../../../../api/paymentApi";
import { getUserByReportID } from "../../../../api/userApi";

const ReportProcess: React.FC = () => {
    const { reportID } = useParams();
    let reportIDOk = 0;
    try {
        reportIDOk = parseInt(reportID + '');
        if (Number.isNaN(reportIDOk)) {
            reportIDOk = 0;
        }
    } catch (error) {
        console.log(error);
        reportIDOk = 0;
    }

    const token = localStorage.getItem("tokenLogin");
    const [report, setReport] = useState<ReportModel | undefined>();
    const [reportType, setReportType] = useState<ReportTypeModel | null>();
    const [order, setOrder] = useState<OrderModel | null>();
    const [orderItems, setOrderItems] = useState<OrderItemModel[] | undefined>();
    const [deliveryType, setDeliveryType] = useState<DeliveryTypeModel | null>();
    const [payment, setPayment] = useState<PaymentModel | null>();
    const [user, setUser] = useState<UserModel | null>();
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);

    const [orderCondition, setOrderCondition] = useState<boolean>(false);
    const [userCondition, setUserCondition] = useState<boolean>(false);
    const [responseCondition, setResponseCondition] = useState<boolean>(false);

    const [response, setResponse] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            getReportbyID(token, reportIDOk).then(
                result => {
                    setReport(result);
                    setdataload(false);
                }
            ).catch(
                error => {
                    seterror(error);
                    setdataload(false);
                }
            )
        }
    }, [reportIDOk])

    useEffect(() => {
        if (token) {
            getReportTypebyReportID(token, reportIDOk).then(
                result => {
                    setReportType(result);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }, [reportIDOk])

    useEffect(() => {
        if (token) {
            getOrderByReportID(token, reportIDOk).then(
                result => {
                    setOrder(result);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }, [reportIDOk])

    useEffect(() => {
        if (token && order) {
            getOrderItem(order.orderID, token).then(
                result => {
                    setOrderItems(result);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }, [order])

    useEffect(() => {
        if (token && order) {
            getDeliveryTypeByOrderID(order?.orderID, token).then(
                result => {
                    setDeliveryType(result);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }, [order])

    useEffect(() => {
        if (token && order) {
            getPaymentByOrderID(token, order.orderID).then(
                result => {
                    setPayment(result);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }, [order])

    useEffect(() => {
        if (token && report) {
            getUserByReportID(token, report.reportID).then(
                result => {
                    setUser(result);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }, [report])

    const handleResponseSend = () => {
        if (token && report) {
            sendResponse(token, response, report?.reportID).then(
                result => {
                    alert("Gửi phản hồi thành công");
                    setResponseCondition(false);
                    navigate("/staff/report");
                }
            ).catch(
                error => {
                    console.log(error);
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
        <div style={{ backgroundColor: "lightyellow" }}>
            <div className=" container mt-5 pt-5" >
                <h1 className="" style={{ color: "red" }}>Xử lý báo cáo đơn hàng</h1>
                <hr className="mb-5" />
                <div className="row mt-5 mb-5">
                    <div className="col-md-8">
                        <h2 className="text-start">Thể loại: {reportType?.reportTypeName}</h2>
                        <h3 className="text-start">Ngày báo cáo: {report?.createReportDate}</h3>
                    </div>
                    <div className="col-md-4">
                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <button className="btn btn-primary w-50" onClick={() => setUserCondition(true)}>Khách hàng</button>
                            </div>
                            <div className="col-md-0">
                                {report?.reportResponse === null && <button className="btn btn-danger w-50" onClick={() => { setResponseCondition(true) }}>Phản hồi báo cáo</button>}
                            </div>
                        </div>
                    </div>
                    {userCondition && <div className="container form-control fixed-top" style={{ backgroundColor: "lightblue", width: "500px", height: "300px", marginTop: "200px", borderRadius: "15px" }}>
                        <button className="btn" style={{ marginLeft: "450px", color: "green" }} onClick={() => setUserCondition(false)}><h5>X</h5></button>
                        <h3 style={{ color: "white" }}>{user?.user_name}</h3>
                        <h4 style={{ color: "gray" }} className="text-start mt-2">ID: {user?.user_id}</h4>
                        <h4 style={{ color: "gray" }} className="text-start">Số điện thoại: {user?.phone_number}</h4>
                        <h4 style={{ color: "gray" }} className="text-start">Địa chỉ: {user?.address}</h4>
                    </div>}
                    {responseCondition && <div className="container form-control fixed-top" style={{ backgroundColor: "lightblue", width: "500px", height: "300px", marginTop: "200px", borderRadius: "15px" }}>
                        <button className="btn" style={{ marginLeft: "450px", color: "green" }} onClick={() => setResponseCondition(false)}><h5>X</h5></button>
                        <h3 className="mb-5" style={{ color: "white" }}>Phản hồi khách hàng</h3>
                        <input className="form-control mt-5" placeholder="phản hồi" onChange={(e) => setResponse(e.target.value)}></input>
                        <button className="btn btn-success mt-5" onClick={handleResponseSend}>Gửi phản hồi</button>
                    </div>}
                </div>
                <hr className="mb-5" />
                <h3 className="text-start" style={{ color: "blueviolet" }}>Chi tiết báo cáo: {report?.reportDetail}</h3>
                <div style={{ backgroundColor: "white", border: "1px solid black", borderRadius: "10px" }}>
                    <img src={"data:image/png;base64," + report?.reportImage} style={{ height: "500px", marginBottom: "10px", width: '300px' }} />
                </div>
                <hr />
                <div className="mt-5 pb-5">
                    <button className="btn btn-success" onClick={() => setOrderCondition(orderCondition ? false : true)}>{orderCondition ? "thu gọn" : "chi tiết đơn hàng"}</button>
                    {orderCondition && (
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6">
                                    <h3 className="text-start" style={{ color: "blueviolet" }}>Mã đơn hàng: {order?.orderID}</h3>
                                    <h4 className="text-start">Ngày đặt hàng: {order?.orderDate}</h4>
                                    <h4 className="text-start">Ngày giao hàng: {order?.deliveryDate}</h4>
                                    <h4 className="text-start">Tổng giá trị đơn hàng: {Format(order?.totalPrice)} đ</h4>
                                    <h4 className="text-start">Địa chỉ giao hàng: {order?.deliveryAddress}</h4>
                                </div>
                                <div className="col-md-6">
                                    <h4 className="text-start mt-2 pt-4" style={{ marginLeft: "200px" }}>Kiểu giao hàng: {deliveryType?.deliveryTypeName}</h4>
                                    <h4 className="text-start" style={{ marginLeft: "200px" }}>Kiểu thanh toán: {payment?.paymentName}</h4>
                                </div>
                            </div>
                            {orderItems?.map((orderItem) => (
                                <div className="container row mt-5" style={{ border: "1px solid black", borderRadius: "10px", backgroundColor: "white" }}>
                                    <div className="col-md-9 mt-3 mb-3">
                                        <BookInReportProcess orderItemID={orderItem.orderItemID} />
                                    </div>
                                    <div className="col-md-3 mt-3">
                                        <h4 className="text-start">Số lượng: {orderItem.numberOfOrderItem}</h4>
                                        <h4 className="text-start">Trị giá: {Format(orderItem.price)} đ</h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ReportProcess;