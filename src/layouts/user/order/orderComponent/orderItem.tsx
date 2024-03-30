import React, { useEffect, useState } from "react";
import OrderModel from "../../../../models/OrderModel";
import { getOrderItem } from "../../../../api/orderApi";
import { useNavigate } from "react-router-dom";
import OrderItemModel from "../../../../models/OrderItemModel";
import Format from "../../../../util/ToLocaleString";
import BookInOrderItem from "./bookInOrderItem";
import { Star, StarFill } from "react-bootstrap-icons";
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
        stars.push(<StarFill className="text-warning" style={{fontSize:"25px", height:"50px", margin:"10px"}} onClick={()=>handleEvaluation(i)}/>)
    }
    const [evaluate, setEvaluate] = useState("");
    const [orderItemEvaluate, setOrderItemEvaluateCondition] = useState<OrderItemModel> ();


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

    const handleEvaluation = async(i: number) =>{
        const createEvaluateResponse = {
            point: i,
            decription: evaluate,
            orderItemID: orderItemEvaluate?.orderItemID
        }
        const endpoint = "http://localhost:8080/user/addevaluate";
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers:{
                    'Content-type' : 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(createEvaluateResponse),
            });
            if(!response.ok){
                throw new Error("fail create evaluate");
            }
            setEvaluationCondition(false);
        } catch (error) {
            console.log(error);
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
    if(orderItemCondition){
        return (
            <div className="container mt-5" >
                {evaluationCondition && (     // evaluation
                <div className="fixed-top" style={{ top: "350px", left: "550px", right: "500px", borderRadius: "10px", backgroundColor: "white" }}>
                    <h3>Đánh giá sản phẩm</h3>
                    {stars}
                    <input className="form-control w-75 m-3 " placeholder="đánh giá" onChange={(e)=>setEvaluate(e.target.value)}></input>
                </div>)}
                {orderItems?.map((orderItem) => (
                    <div className="row mb-5">
                        <div className="col-md-9">
                            <BookInOrderItem orderItem={orderItem} />
                        </div>
                        <div className="col-md-3">
                            <h5 className="text-start">Số lượng: {orderItem.numberOfOrderItem}</h5>
                            <h6 className="text-start">Chi tiết giá: {Format(orderItem.price)}</h6>
                            {props.order.orderStatus=="Hoàn Thành" && <button className="btn btn-success w-50" style={{marginRight:"180px"}} onClick={() => { setEvaluationCondition(true); setOrderItemEvaluateCondition(orderItem) }}>Đánh giá</button>}
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