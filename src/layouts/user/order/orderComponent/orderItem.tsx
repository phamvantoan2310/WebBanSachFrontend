import React, { useEffect, useState } from "react";
import OrderModel from "../../../../models/OrderModel";
import { getOrderItem } from "../../../../api/orderApi";
import { useNavigate } from "react-router-dom";
import OrderItemModel from "../../../../models/OrderItemModel";
import Format from "../../../../util/ToLocaleString";
import BookInOrderItem from "./bookInOrderItem";
interface OrderItemInterface {
    order: OrderModel;
}

const OrderItem: React.FC<OrderItemInterface> = (props) => {
    const token = localStorage.getItem("tokenLogin");
    const navigate = useNavigate();
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);
    const [orderItems, setOrderItems] = useState<OrderItemModel[] | undefined>([]);

    const [orderItemCondition, setOrderItemCondition] = useState(false);


    useEffect(() => {
        if (token != null) {
            getOrderItem(props.order.orderID, token).then(
                result => {
                    setOrderItems(result);
                    setdataload(false);
                }
            ).catch(
                error => {
                    seterror(error);
                    setdataload(false);
                }
            )
        } else {
            navigate("/user/login");
            return;
        }
    }, [props.order]);


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
    if(orderItemCondition){
        return (
            <div className="container mt-5" >
                {orderItems?.map((orderItem) => (
                    <div className="row mb-5">
                        <div className="col-md-9">
                            <BookInOrderItem orderItem={orderItem} />
                        </div>
                        <div className="col-md-3">
                            <h5 className="text-start">Số lượng: {orderItem.numberOfOrderItem}</h5>
                            <h6 className="text-start">Chi tiết giá: {Format(orderItem.price)}</h6>
                        </div>
                    </div>
                ))}
                <button className="btn btn-primary w-25" onClick={()=>{setOrderItemCondition(false)}}>Thu gọn</button>
            </div>
        );
    }else{
        return (
            <div className="container mt-5">
                <button className="btn btn-primary w-25" onClick={()=>{setOrderItemCondition(true)}}>Chi tiết</button>
            </div>
        );
    }
    
}

export default OrderItem;