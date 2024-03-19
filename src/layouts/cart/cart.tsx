import React, { useEffect, useState } from "react";
import CartModel from "../../models/CartModel";
import { deleteAllCartItem, getBookInCartItem, getCart, getCartItem } from "../../api/cartApi";
import CartItemModel from "../../models/CartItemModel";
import Format from "../../util/ToLocaleString";
import BookModel from "../../models/BookModel";
import { Link, useNavigate } from "react-router-dom";
import RenderRating from "../../util/RenderRating";
import BookInCartITem from "./cartComponent/bookInCartItem";

const Cart: React.FC = () => {
    const token = localStorage.getItem("tokenLogin");
    const [cart, setCart] = useState<CartModel | null>(null);
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);
    const [cartItems, setCartItems] = useState<CartItemModel[] | null>([]);
    let totalPrice: number = 0;

    const navigate = useNavigate();

    useEffect(() => {
        if (token != null) {
            getCart(token).then(
                result => {
                    setCart(result);
                    setdataload(false);
                    console.log(result);
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
                    console.log(result);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }, [cart, cartItems])

    if (cartItems != null) {
        for (let key in cartItems) {
            totalPrice += cartItems[key].price;
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

    const handleDeleteAllCartItem = () => {
        if (cart != null && token != null) {
            deleteAllCartItem(cart.cartID, token).then(
                result => {
                    alert("Xóa thành công");
                    navigate("/user/cart");
                }
            ).catch(
                error => {
                    console.log(error);
                    alert("Xóa thất bại");
                }
            )
        }

    }


    return (
        <div className="container">
            <div className="pt-5 mt-5 pb-5">
                <div className="row">
                    <h1 className="text-start col-md-2">Giỏ Hàng</h1>
                    <p className="col-md-1 pt-4" style={{ marginLeft: "-80px" }}>({cartItems?.length})</p>
                </div>
                <hr />
            </div>
            <div className="row">
                <div className="col-md-8">
                    {cartItems != null && cartItems.map((cartItem) => (<BookInCartITem cartItem={cartItem} />))}
                    <button type="button" className="btn btn-danger" style={{ width: "100px", height: "40px", marginTop: "30px" }} onClick={handleDeleteAllCartItem}>Xóa tất cả</button>
                </div>
                <div className="col-md-4 pt-5">
                    <h3 className="text-start">Tổng tiền: </h3>
                    <h3 className="text-end" style={{ color: "orange", paddingBottom: "60px" }}>{Format(totalPrice)} đ</h3>
                    <h4 className="text-start">Địa chỉ nhận hàng: </h4>
                    <h5 className="text-end mb-5" style={{ color: "orange" }}>{cart?.deliveryAddress}</h5>
                    <Link to={"/user/pay"}>
                        <button type="button" className="btn btn-success mt-5 w-50">Mua ngay</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Cart;