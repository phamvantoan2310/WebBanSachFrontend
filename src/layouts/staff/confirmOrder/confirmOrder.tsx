import React, { useEffect, useState } from "react";
import OrderModel from "../../../models/OrderModel";
import { getOrderByOrderStatus } from "../../../api/orderApi";
import DeliveryTypeModel from "../../../models/DeliveryTypeModel";
import PaymentModel from "../../../models/PaymentModel";
import Format from "../../../util/ToLocaleString";
import { Link } from "react-router-dom";
import RequireStaff from "../../../util/requireStaff";

const ConfirmOrderStaff: React.FC = () => {
    const token = localStorage.getItem("tokenLogin");
    const [orders, setOrders] = useState<OrderModel[] | undefined>();
    

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
            <hr />
            <div className="mt-5">
                {orders?.map(order => (
                    <div className="mt-5" style={{ backgroundColor: "whitesmoke", border: "1px solid black", borderRadius: "10px" }}>
                        <h3 className="text-start mt-3" style={{ marginLeft: "40px" }}>Mã đơn hàng: {order.orderID}</h3>
                        <h4 className="text-start mt-3" style={{ marginLeft: "40px" }}>Ngày đặt hàng: {order.orderDate}</h4>
                        <h4 className="text-start mt-3" style={{ marginLeft: "40px" }}>Địa chỉ: {order.deliveryAddress}</h4>
                        <h3 className="text-start mt-5 " style={{ marginLeft: "40px" }}>Tổng giá trị: {Format(order.totalPrice)} đ</h3>
                        <Link to={`/staff/orderdetail/${order.orderID}`}>
                            <button className="btn btn-success w-25 mb-3 mt-5">Chi tiết</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

const ConfirmOrder = RequireStaff(ConfirmOrderStaff);
export default ConfirmOrder;