import React, { useEffect, useState } from "react";
import OrderModel from "../../../../models/OrderModel";
import { getOrderItem, updateOrderAddress } from "../../../../api/orderApi";
import { useNavigate } from "react-router-dom";
import OrderItemModel from "../../../../models/OrderItemModel";
import Format from "../../../../util/ToLocaleString";
import BookInOrderItem from "./bookInOrderItem";
import { Star, StarFill } from "react-bootstrap-icons";
import { getDeliveryTypeByOrderID } from "../../../../api/deliveryTypeApi";
import DeliveryTypeModel from "../../../../models/DeliveryTypeModel";
import PaymentModel from "../../../../models/PaymentModel";
import { getPaymentByOrderID } from "../../../../api/paymentApi";
import { SettingOutlined } from "@ant-design/icons";
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
    const [evaluationCondition, setEvaluationCondition] = useState<boolean>(false);

    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(<StarFill className="text-warning" style={{ fontSize: "25px", height: "50px", margin: "10px" }} onClick={() => handleEvaluation(i)} />)
    }
    const [evaluate, setEvaluate] = useState("");
    const [orderItemEvaluate, setOrderItemEvaluateCondition] = useState<OrderItemModel>();

    const [deliveryType, setDeliveryType] = useState<DeliveryTypeModel | undefined>();
    const [payment, setPayment] = useState<PaymentModel | undefined>();


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

    useEffect(() => {
        if (token) {
            getDeliveryTypeByOrderID(props.order.orderID, token).then(
                result => {
                    setDeliveryType(result);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }, [props.order])
    useEffect(() => {
        if (token) {
            getPaymentByOrderID(token, props.order.orderID).then(
                result => {
                    setPayment(result);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }, [props.order])

    const handleEvaluation = async (point: number) => {
        const createEvaluateResponse = {
            point: point,
            decription: evaluate,
            orderItemID: orderItemEvaluate?.orderItemID
        }
        const endpoint = "http://localhost:8080/user/addevaluate";
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(createEvaluateResponse),
            });
            if (!response.ok) {
                throw new Error("fail create evaluate");
            }
            setEvaluationCondition(false);
        } catch (error) {
            console.log(error);
        }
    }

    const [updateAddressFormCondition, setUpdateAddressFormCondition] = useState<boolean>(false);
    const [updateAddress, setUpdateAddress] = useState<string>("");

    const handleUpdateAddress = () => {
        if (token) {
            updateOrderAddress(token, props.order.orderID, updateAddress).then(
                result => {
                    alert("Cập nhật đơn hàng thành công");
                    navigate(0);
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
    if (orderItemCondition) {
        return (
            <div className="container mt-1" >
                {evaluationCondition && (     // evaluation
                    <div className="fixed-top" style={{ top: "240px", left: "550px", right: "500px", border: "1px solid green", borderRadius: "10px", backgroundColor: "white" }}>
                        <button className="btn" style={{ marginLeft: "430px" }} onClick={() => setEvaluationCondition(false)}>x</button>
                        <h3>Đánh giá sản phẩm</h3>
                        {stars}
                        <input className="form-control w-75 m-3 " placeholder="đánh giá" onChange={(e) => setEvaluate(e.target.value)}></input>
                    </div>)}
                <p className="text-start" style={{ marginLeft: "30px" }}>Người nhận hàng: {props.order.deliveryUserName}</p>
                <p className="text-start" style={{ marginLeft: "30px" }}>Số điện thoại: {props.order.deliveryPhoneNumber}</p>
                <p className="text-start" style={{ marginLeft: "30px" }}>Địa chỉ: {props.order.deliveryAddress} {props.order.orderStatus == "Đang Chờ Xác Nhận" && <SettingOutlined style={{ color: "blue" }} onClick={() => { setUpdateAddressFormCondition(!updateAddressFormCondition) }} />}</p>
                {props.order.orderStatus == "Đang Chờ Xác Nhận" && updateAddressFormCondition && <div className="d-flex" style={{ marginLeft: "30px" }}>
                    <input className="form-control me-2" style={{ width: "400px", border: "1px solid violet" }} type="text" placeholder="Cập nhật địa chỉ giao hàng" onChange={(e) => setUpdateAddress(e.target.value)} />
                    <button className="btn btn-success w-25" type="button" onClick={handleUpdateAddress}>Cập nhật</button>
                </div>}
                <p className="text-start" style={{ marginLeft: "30px" }}>Phương thức giao hàng: {deliveryType?.deliveryTypeName}</p>
                <p className="text-start" style={{ marginLeft: "30px", marginBottom: "50px" }}>Phương thức thanh toán: {payment?.paymentName}</p>
                {orderItems?.map((orderItem) => (
                    <div className="row mb-1">
                        <div className="col-md-8">
                            <BookInOrderItem orderItem={orderItem} />
                        </div>
                        <div className="col-md-4">
                            <h5 className="text-start">Số lượng: {orderItem.numberOfOrderItem}</h5>
                            <h6 className="text-start" style={{ color: "red" }}>Chi tiết giá: {Format(orderItem.price)} đ</h6>
                            {props.order.orderStatus == "Hoàn Thành" && <button className="btn btn-success w-75" style={{ marginRight: "180px" }} onClick={() => { setEvaluationCondition(true); setOrderItemEvaluateCondition(orderItem) }}>Đánh giá</button>}
                        </div>
                    </div>
                ))}
                <button className="btn btn-primary w-25" onClick={() => { setOrderItemCondition(false) }}>Thu gọn</button>
            </div>
        );
    } else {
        return (
            <div className="container">
                <button className="btn btn-primary w-25" onClick={() => { setOrderItemCondition(true) }}>Chi tiết</button>
            </div>
        );
    }

}

export default OrderItem;