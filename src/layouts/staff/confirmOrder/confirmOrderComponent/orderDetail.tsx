import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeliveryTypeModel from "../../../../models/DeliveryTypeModel";
import PaymentModel from "../../../../models/PaymentModel";
import OrderItemModel from "../../../../models/OrderItemModel";
import { confirmOrder, getOrderByOrderID, getOrderItem } from "../../../../api/orderApi";
import { getDeliveryTypeByOrderID } from "../../../../api/deliveryTypeApi";
import { getPaymentByOrderID } from "../../../../api/paymentApi";
import OrderModel from "../../../../models/OrderModel";
import Format from "../../../../util/ToLocaleString";
import BookInConfirmOrder from "./bookInConfirmOrder";

const OrderDetail: React.FC = () => {
    const token = localStorage.getItem("tokenLogin");
    const { orderID } = useParams();
    let orderIDOk = 0;
    try {
        orderIDOk = parseInt(orderID + '');
        if (isNaN(orderIDOk)) {
            orderIDOk = 0;
        }
    } catch (error) {
        console.log(error);
        orderIDOk = 0;
    }

    const [order, setOrder] = useState<OrderModel | null>();
    const [orderItems, setOrderItems] = useState<OrderItemModel[] | undefined>();
    const [deliveryType, setDeliveryType] = useState<DeliveryTypeModel | null>();
    const [payment, setPayment] = useState<PaymentModel | null>();
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);

    const [orderCondition, setOrderCondition] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            getOrderByOrderID(orderIDOk, token).then(
                result => {
                    setOrder(result);
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

    useEffect(() => {
        if (token) {
            getOrderItem(orderIDOk, token).then(
                result => {
                    setOrderItems(result);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }, [])

    useEffect(() => {
        if (token) {
            getDeliveryTypeByOrderID(orderIDOk, token).then(
                result => {
                    setDeliveryType(result);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }, [])

    useEffect(() => {
        if (token) {
            getPaymentByOrderID(token, orderIDOk).then(
                result => {
                    setPayment(result);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }, [])

    const handleConfirmOrder = () =>{
        if(token && order){
            confirmOrder(token, order?.orderID).then(
                result=>{
                    alert("Xác nhận gửi đơn hàng thành công");
                    navigate("/staff/confirmorder");
                }
            ).catch(
                error=>{
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
        <div className="container mt-5 pt-5">
            <h1 className="text-start">Xử lý đơn hàng</h1>
            <hr />
            <div className="mt-5 container">
                <h2 className="text-start">Mã đơn hàng: {order?.orderID}</h2>
                {orderCondition && <div><h4 className="text-start mt-3" style={{ marginLeft: "40px" }}>Ngày đặt hàng: {order?.orderDate}</h4>
                    <h4 className="text-start mt-3" style={{ marginLeft: "40px" }}>Địa chỉ: {order?.deliveryAddress}</h4>
                    <h4 className="text-start mt-3" style={{ marginLeft: "40px" }}>Phương thức giao hàng: {deliveryType?.deliveryTypeName}</h4>
                    <h4 className="text-start mt-3" style={{ marginLeft: "40px" }}>Phương thức thanh toán: {payment?.paymentName}</h4>
                    <h3 className="text-start mt-3 " style={{ marginLeft: "40px" }}>Tổng giá trị: {Format(order?.totalPrice)} đ</h3></div>}
                <button className="btn btn-success" onClick={() => setOrderCondition(orderCondition ? false : true)}>{orderCondition ? "Thu gọn" : "Chi tiết"}</button>
                <hr />
                {orderItems?.map((orderItem) => (
                    <div className="row mt-5" style={{ backgroundColor: "lightgray", border:"1px solid #66ff33", borderRadius:"10px" }}>
                        <div className="col-md-9 mt-3 mb-3">
                            <BookInConfirmOrder key={orderItem.orderItemID} orderItem={orderItem}/>
                        </div>
                        <div className="col-md-3">
                            <h5 className="textstart">Số lượng: {orderItem.numberOfOrderItem}</h5>
                            <h5 className="textstart">Giá trị: {Format(orderItem.price)} đ</h5>
                        </div>
                    </div>
                ))}
                <button className="btn btn-primary mt-5" onClick={handleConfirmOrder}>Xác nhận gửi hàng</button>
            </div>
        </div>
    );
}
export default OrderDetail;