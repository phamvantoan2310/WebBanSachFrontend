import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import OrderModel from "../../../models/OrderModel";
import OrderItem from "./orderComponent/orderItem";
import Format from "../../../util/ToLocaleString";
import { completeOrder, deleteOrder } from "../../../api/orderApi";


const Order: React.FC = () => {
    let { state } = useLocation();
    const [orders, setOrders] = useState<OrderModel[]>(state.orders);
    const token = localStorage.getItem("tokenLogin");
    const navigate = useNavigate();


    const handleDeleteOrder = (orderID: number) => {
        if (token != null) {
            deleteOrder(orderID, token).then(
                result => {
                    const updatedOrders = orders.filter(order => order.orderID !== orderID);
                    setOrders(updatedOrders);
                    alert("xóa thành công");
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        } else {
            navigate("/user/login");
            return;
        }
    }

    const handleCancelOrder = (orderID: number) => {
        if (token != null) {
            const confirmCancelOrder = window.confirm("Xác nhận hủy đơn hàng?");
            if (confirmCancelOrder) {
                deleteOrder(orderID, token).then(
                    result => {
                        const updatedOrders = orders.filter(order => order.orderID !== orderID);
                        setOrders(updatedOrders);
                        alert("xóa thành công");
                    }
                ).catch(
                    error => {
                        console.log(error);
                    }
                )
            }
        } else {
            navigate("/user/login");
            return;
        }
    }

    const handleOrderComplete = (orderID: number) => {
        if (token) {
            completeOrder(token, orderID).then(
                result => {
                    alert("Cảm ơn đã xác nhận đơn hàng");
                    navigate("/account");
                }
            ).catch(
                error => {
                    alert("Gặp lỗi trong quá trình hoàn thiện đơn hàng");
                }
            )
        } else {
            navigate("/user/login");
            return;
        }
    }

    return (
        <div className="container pt-5 mt-5">
            <div className="row">
                <div className="col-md-3">
                    <h1>Đơn hàng</h1>
                </div>
                <div className="col-md-9 text-start" style={{ marginLeft: "250px", marginTop: "-20px" }}>
                    <p>({orders.length})</p>
                </div>
            </div>
            <hr />
            {orders.map((order) => (
                <div className="mt-5 row" style={{ backgroundColor: "lightgray", borderRadius: "10px" }}>
                    <div className="col-md-6">
                        <h4 className="text-start pt-1" style={{ color: "limegreen" }}>{order.orderStatus}</h4>
                        <h5 className="text-start pt-1" style={{ paddingLeft: "30px" }}>Ngày đặt hàng: {order.orderDate}</h5>
                        <h5 className="text-start pt-1" style={{ paddingLeft: "30px" }}>Ngày giao hàng: {order.deliveryDate}</h5>
                        <h5 className="text-start pt-1" style={{ paddingLeft: "30px" }}>Địa chỉ giao hàng: {order.deliveryAddress}</h5>
                    </div>
                    <div className="col-md-6">
                        <h3 className="text-end pt-1">Thanh toán: {Format(order.totalPrice)} đ</h3>
                        {(order.orderStatus == "Đơn Hàng Đang Được Giao") && (<div>
                            <Link to={`/user/report/${order.orderID}`}>
                                <button className="btn btn-warning w-25 mt-5" style={{ marginLeft: "370px" }}>Báo cáo</button>
                            </Link>
                            <button className="btn btn-success w-25 mt-5" style={{ marginLeft: "370px" }} onClick={() => handleOrderComplete(order.orderID)}>Đã nhận được sách</button>
                        </div>)}
                        {(order.orderStatus == "Hoàn Thành") && (<div>
                            <button className="btn btn-danger w-25 mt-5" style={{ marginLeft: "370px" }} onClick={() => { handleDeleteOrder(order.orderID) }}>Xóa</button>
                        </div>)}
                        {(order.orderStatus == "Đang Chờ Xác Nhận") && (<div>
                            <button className="btn btn-danger w-25 mt-5" style={{ marginLeft: "370px" }} onClick={() => { handleCancelOrder(order.orderID) }}>Hủy đơn hàng</button>
                        </div>)}
                    </div>
                    <OrderItem order={order} />
                </div>
            ))}
        </div>
    );
}

export default Order;