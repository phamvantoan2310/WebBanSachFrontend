import React, { useEffect, useState } from "react";
import CartModel from "../../models/CartModel";
import CartItemModel from "../../models/CartItemModel";
import { useNavigate } from "react-router-dom";
import { getCart, getCartItem } from "../../api/cartApi";
import BookInCartITem from "./cartComponent/bookInCartItem";
import Format from "../../util/ToLocaleString";
import BookInPay from "./payComponent/bookInPay";
import UserModel from "../../models/UserModel";
import { getAUser } from "../../api/userApi";
import DeliveryTypeModel from "../../models/DeliveryTypeModel";
import PaymentModel from "../../models/PaymentModel";
import { getDeliveryType } from "../../api/deliveryTypeApi";
import { getPayment } from "../../api/paymentApi";

const Pay: React.FC = () => {
    const token = localStorage.getItem("tokenLogin");
    const [user, setUser] = useState<UserModel | null>(null);
    const [cart, setCart] = useState<CartModel | null>(null);
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);
    const [cartItems, setCartItems] = useState<CartItemModel[] | null>([]);
    const [deliveryTypes, setDeliveryTypes] = useState<DeliveryTypeModel[] | undefined>([]);
    const [payments, setPayments] = useState<PaymentModel[] | undefined>([]);
    const [priceBook, setPriceBook] = useState(0);
    const [priceOfDeliveryType, setPriceOfDeliveryType] = useState(0);
    const [priceOfPayment, setPriceOfPayment] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        if (token != null) {
            getAUser(token).then(
                result => {
                    setUser(result);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }, [token]);

    useEffect(() => {
        if (token != null) {
            getCart(token).then(
                result => {
                    setCart(result);
                    setdataload(false);
                }
            ).catch(
                error => {
                    setdataload(false);
                    seterror(error);
                }
            )
        } else {
            navigate("/user/login");
            return;
        }
    }, [])

    useEffect(() => {
        if (cart != null && token != null) {
            getCartItem(cart.cartID, token).then(
                result => {
                    setCartItems(result);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }, [cart, cartItems])

    useEffect(() => {
        if (token != null) {
            getDeliveryType(token).then(
                result => {
                    setDeliveryTypes(result);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }, [])

    useEffect(() => {
        if (token != null) {
            getPayment(token).then(
                result => {
                    setPayments(result);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }, []);

    useEffect(()=>{
        setTotalPrice(priceBook + priceOfDeliveryType + priceOfPayment);
    },[priceBook, priceOfDeliveryType, priceOfPayment])

    useEffect(()=>{
        if (cartItems != null) {
            let newTotalPrice = 0;
            for (let key in cartItems) {
                newTotalPrice += cartItems[key].price;
            }
            setPriceBook(newTotalPrice);
        }
    },[cartItems])




    const handleChangeDeliveryType = () => {
        let newPrice = 0;
        if (deliveryTypes) {
            const delivery = document.getElementById("delivery") as HTMLSelectElement | null;
            if (delivery && delivery.value && deliveryTypes[parseInt(delivery.value)-1]) {
                if (delivery.value != "9") {
                    newPrice = deliveryTypes[parseInt(delivery.value)-1].priceOfDeliveryType;
                }else{
                    return;
                }
            }
        }
        setPriceOfDeliveryType(newPrice);
    }
    const handleChangePaymentType = () => {
        if (payments) {
            const pay = document.getElementById("pay") as HTMLSelectElement | null;
            if (pay && pay.value && payments[parseInt(pay.value)-1]) {
                if(pay.value != "9"){
                    setPriceOfPayment(payments[parseInt(pay.value)-1].priceOfPayment);
                }else{
                    return;
                }
            }

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
        <div className="container">
            <div className="pt-5 mt-5 pb-5">
                <div className="row">
                    <h1 className="text-start col-md-3">Thanh toán</h1>
                    <p className="col-md-1 pt-4" style={{ marginLeft: "-150px" }}>({cartItems?.length})</p>
                </div>
                <hr />
            </div>
            <div className="row">
                <div className="col-md-8">
                    {cartItems != null && cartItems.map((cartItem) => (<BookInPay cartItem={cartItem} />))}
                </div>
                <div className="col-md-4 pt-5">

                    <h4 className="text-start">Địa chỉ nhận hàng: </h4>
                    <div className="row">
                        <div className="col-md-8">
                            <h5 className="text-end mb-3 mt-4" style={{ paddingLeft: "30px" }}>Tên khách hàng: </h5>
                        </div>
                        <div className="col-md-4">
                            <h5 className="text-end mb-3 mt-4" style={{ color: "orange" }}>{user?.user_name}</h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <h5 className="text-end mb-3" style={{ paddingLeft: "30px" }}>Số điện thoại: </h5>
                        </div>
                        <div className="col-md-4">
                            <h5 className="text-end mb-3" style={{ color: "orange" }}>{user?.phone_number}</h5>
                        </div>
                    </div>
                    <h5 className="text-end mb-5" style={{ color: "orange" }}>{cart?.deliveryAddress}</h5>

                    <h4 className="text-start mb-4">Phương thức vận chuyển: </h4>
                    <select className="form-select mb-5" id="delivery" aria-label="Default select example" style={{ color: "orange" }} onChange={handleChangeDeliveryType}>
                        <option value="9">Kéo xuống</option>
                        {deliveryTypes?.map((deliveryType) => (<option value={deliveryType.deliveryTypeID}>{deliveryType.deliveryTypeName}</option>))}
                    </select>

                    <h4 className="text-start mb-4">Phương thức thanh toán: </h4>
                    <select className="form-select mb-5" id="pay" aria-label="Default select example" style={{ color: "orange" }} onChange={handleChangePaymentType}>
                        <option value="9">Kéo xuống</option>
                        {payments?.map((payment) => (<option value={payment.paymentID}>{payment.paymentName}</option>))}
                    </select>

                    <h3 className="text-start mt-5 pt-5" style={{color:"red"}}>Chi tiết thanh toán: </h3>
                    <h4 className="text-start">Tiền sách:</h4>
                    <h5 className="text-end" style={{ color: "orange", paddingBottom: "20px" }}>{Format(priceBook)} đ</h5>
                    <h4 className="text-start">Phí vận chuyển:</h4>
                    <h5 className="text-end" style={{ color: "orange", paddingBottom: "20px" }}>{Format(priceOfDeliveryType)} đ</h5>
                    <h4 className="text-start">Phí thanh toán:</h4>
                    <h5 className="text-end" style={{ color: "orange"}}>{Format(priceOfPayment)} đ</h5>
                    <hr/>
                    <h4 className="text-start" style={{paddingTop:"60px"}}>Tổng:</h4>
                    <h3 className="text-end" style={{ color: "orange", paddingBottom: "40px" }}>{Format(totalPrice)} đ</h3>
                    <button type="button" className="btn btn-danger w-50 mb-5">Mua ngay</button>
                </div>
            </div>
        </div>
    );
}

export default Pay;