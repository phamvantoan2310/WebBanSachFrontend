import React, { useEffect, useState } from "react";
import OrderModel from "../../../models/OrderModel";
import { getOrderByOrderID, getOrderByOrderStatus } from "../../../api/orderApi";
import Format from "../../../util/ToLocaleString";
import { Link } from "react-router-dom";
import RequireStaff from "../../../util/requireStaff";
import { CloseCircleOutlined } from "@ant-design/icons";

const ConfirmOrderStaff: React.FC = () => {
    const token = localStorage.getItem("tokenLogin");
    const [orders, setOrders] = useState<OrderModel[] | undefined>();

    const [order, setOrder] = useState<OrderModel | null>();
    const [orderID, setOrderID] = useState<string>();


    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);


    useEffect(() => {
        if (token) {
            getOrderByOrderStatus(token, "Đang Chờ Xác Nhận").then(
                result => {
                    setOrders(result);
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

    const handleFindOrderByOrderID = () => {
        if (token) {
            getOrderByOrderID(Number(orderID), token).then(
                result => {
                    setOrder(result);
                }
            ).catch(
                error => (
                    console.log(error)
                )
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
            <h1 className="text-start">Xử lý đơn hàng</h1>
            <div className="d-flex" style={{ marginLeft: "700px" }}>
                <input className="form-control me-2" type="number" placeholder="Tìm kiếm đơn hàng" aria-label="Search" style={{ width: "500px", border: "1px solid black" }} value={orderID} onChange={(e) => setOrderID(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleFindOrderByOrderID();
                        }
                    }}
                />
                <button className="btn btn-outline-success" type="button" onClick={handleFindOrderByOrderID}>Tìm kiếm</button>
            </div>
            <hr />
            {order &&
                <div>
                    <CloseCircleOutlined style={{ marginLeft: "1280px", fontSize: "25px" }} onClick={() => setOrder(null)} />
                    <div className="container row mb-3" style={{ backgroundColor: " #E7DDFF", border: "1px solid black", borderRadius: "10px" }}>
                        <Link to={`/staff/orderdetail/${order.orderID}`} style={{ marginLeft: "20px" }} className="text-end">
                            <i className="fa fa-edit" style={{ color: "red" }} aria-hidden="true"></i>
                        </Link>
                        <div className="col-md-6" >
                            <h3 className="text-start" style={{ marginLeft: "40px", color: " #1a1aff" }}>Mã đơn hàng: {order.orderID}</h3>
                            <h6 className="text-start mt-3" style={{ marginLeft: "40px" }}>Ngày đặt hàng: {order.orderDate}</h6>
                            <h6 className="text-start mt-3" style={{ marginLeft: "40px" }}>Số điện thoại đặt hàng: {order.deliveryPhoneNumber}</h6>
                            <h6 className="text-start mt-3" style={{ marginLeft: "40px" }}>Địa chỉ: {order.deliveryAddress}</h6>
                        </div>
                        <div className="col-md-6" >
                            <h3 className="text-start" style={{ marginLeft: "40px" }}>Tổng giá trị:</h3>
                            <h3 className="text-start" style={{ marginLeft: "40px", color: "red" }}>{Format(order.totalPrice)} đ</h3>
                        </div>
                    </div>
                </div>
            }
            <div className="mt-5">
                <div className="row overflow-auto" style={{ maxHeight: "700px" }}>
                    {orders?.map(order => (
                        <div className="col-md-6">
                            <div className="container row mb-3" style={{ backgroundColor: "whitesmoke", border: "1px solid black", borderRadius: "10px" }}>
                                <Link to={`/staff/orderdetail/${order.orderID}`} className="text-end" style={{ marginLeft: "20px" }}>
                                    <i className="fa fa-edit" style={{ color: "red" }} aria-hidden="true"></i>
                                </Link>
                                <div className="col-md-6" >
                                    <h3 className="text-start" style={{ marginLeft: "15px", color: " #1a1aff" }}>Mã đơn hàng: {order.orderID}</h3>
                                    <h6 className="text-start mt-3" style={{ marginLeft: "15px" }}>Ngày đặt hàng: {order.orderDate}</h6>
                                    <h6 className="text-start mt-3" style={{ marginLeft: "15px" }}>Số điện thoại đặt hàng: {order.deliveryPhoneNumber}</h6>
                                    <h6 className="text-start mt-3" style={{ marginLeft: "15px" }}>Địa chỉ: {order.deliveryAddress}</h6>
                                </div>
                                <div className="col-md-6" >
                                    <h3 className="text-start" style={{ marginLeft: "40px" }}>Tổng giá trị:</h3>
                                    <h3 className="text-start" style={{ marginLeft: "40px", color: "red" }}>{Format(order.totalPrice)} đ</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const ConfirmOrder = RequireStaff(ConfirmOrderStaff);
export default ConfirmOrder;