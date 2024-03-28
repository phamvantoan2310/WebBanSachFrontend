import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OrderModel from "../../../models/OrderModel";
import OrderItem from "./orderComponent/orderItem";
import Format from "../../../util/ToLocaleString";
import { deleteOrder } from "../../../api/orderApi";
import { error } from "console";

const Order: React.FC = () => {
    let { state } = useLocation();
    const [orders, setOrders] = useState<OrderModel[]> (state.orders);
    const token = localStorage.getItem("tokenLogin");
    const navigate = useNavigate();

    const handleDeleteOrder = (orderID: number) =>{
        if(token!=null){
            deleteOrder(orderID, token).then(
                result=>{
                    const updatedOrders = orders.filter(order => order.orderID !== orderID);
                    setOrders(updatedOrders);
                    alert("xóa thành công");
                }
            ).catch(
                error=>{
                    console.log(error);
                }
            )
        }else{
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
                        <button className="btn btn-danger w-25" style={{marginLeft:"370px"}} onClick={()=>{handleDeleteOrder(order.orderID)}}>Xóa</button>
                    </div>
                    <OrderItem order={order}/>
                    
                </div>
            ))}
        </div>
    );
}

export default Order;