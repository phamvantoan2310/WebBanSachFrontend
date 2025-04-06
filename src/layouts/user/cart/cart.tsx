import React, { useEffect, useState } from "react";
import CartModel from "../../../models/CartModel";
import { deleteAllCartItem, getBookInCartItem, getCart, getCartItem } from "../../../api/cartApi";
import CartItemModel from "../../../models/CartItemModel";
import Format from "../../../util/ToLocaleString";
import BookModel from "../../../models/BookModel";
import { useNavigate } from "react-router-dom";
import BookInCartITem from "./cartComponent/bookInCartItem";
import { jwtDecode } from "jwt-decode";
import { getAUser } from "../../../api/userApi";

const Cart: React.FC = () => {
    const token = localStorage.getItem("tokenLogin");
    const navigate = useNavigate();
    useEffect(() => {
        if (token) {
            const dataToken = jwtDecode(token);
            if (dataToken.exp != undefined ? dataToken.exp : 0 > Math.floor(Date.now())) {
                getAUser(token).then(
                    result => {
                        if (result?.account_status == false) {
                            alert("Tài khoản chưa kích hoạt, vui lòng kích hoạt tài khoản trước khi đăng nhập!");
                            navigate("/user/login")
                        }
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
        } else {
            navigate("/user/login");
            return;
        }
    }, [token])



    const [cart, setCart] = useState<CartModel | null>(null);
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);
    const [cartItems, setCartItems] = useState<CartItemModel[] | null>([]);

    let totalPrice: number = 0;
    let totalSelectedBooks: number = 0;

    type SelectedBook = {
        book: BookModel;
        numberOfBook: number;
    };

    const [selectedBooks, setSelectedBooks] = useState<SelectedBook[]>([]);

    const [isSelectedAllBook, setIsSelectedAllBook] = useState<boolean>(false);

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
    }, [cart, token])

    if (selectedBooks) {
        for (let key in selectedBooks) {
            const bookPrice = selectedBooks[key]?.book?.price ?? 0;
            const numberOfBook = selectedBooks[key]?.numberOfBook ?? 0;
            totalSelectedBooks += numberOfBook;
            totalPrice += bookPrice * numberOfBook;
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
            const confirmDelete = window.confirm("Xác nhận xóa tất cả sách?");
            if (confirmDelete) {
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

    }

    const handlePayment = () => {
        if (selectedBooks.length != 0) {
            navigate("/user/pay", { state: { selectedBooks } });
        }

    };

    //chọn từng cuốn sách mua
    const handleChooseBook = (book: BookModel, numberOfBook: number) => {
        const aSelectedBook = {
            book: book,
            numberOfBook: numberOfBook
        };
        setSelectedBooks((selectedBooks) => [...selectedBooks, aSelectedBook]);
    };

    //xóa sách được chọn mua
    const handleRemoveBook = (book: BookModel) => {
        setSelectedBooks((selectedBooks) => selectedBooks.filter((item) => item.book.book_id !== book.book_id));
    }

    //chọn tất cả sách mua
    const handleSelectAll = async () => {
        setIsSelectedAllBook(!isSelectedAllBook);
        if (!isSelectedAllBook) {
            try {
                const allBooksPromises = cartItems?.map(async (item) => {
                    const result = await getBookInCartItem(item.cartItemID, token != null ? token : "");

                    // Kiểm tra result có hợp lệ không
                    if (result) {
                        return {
                            book: result,
                            numberOfBook: item.numberOfCartItem,
                        };
                    }

                    // Nếu result là null, trả về undefined
                    return undefined;
                });

                if (allBooksPromises) {
                    const allBooks = await Promise.all(allBooksPromises);

                    // Lọc ra các giá trị hợp lệ
                    const validBooks = allBooks.filter((book) => book !== undefined) as { book: BookModel; numberOfBook: number; }[];

                    setSelectedBooks(validBooks);
                }
            } catch (error) {
                console.error("Lỗi khi chọn tất cả sách:", error);
            }
        } else {
            setSelectedBooks([]);
        }
    };


    return (
        <div className="container">
            <div className="pt-5 mt-5">
                <div className="row">
                    <h1 className="text-start col-md-2">Giỏ Hàng</h1>
                    <p className="col-md-2 pt-4" style={{ marginLeft: "-90px" }}>({cartItems?.length} sản phẩm)</p>
                </div>
                <hr />
            </div>
            <div className="row">
                <div className="col-md-8">
                    <div className="row mt-5" style={{ backgroundColor: "antiquewhite", borderRadius: "10px", height: "50px" }}>
                        <div className="col-md-1 d-flex align-items-center justify-content-center">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" checked={isSelectedAllBook} onChange={handleSelectAll} style={{ fontSize: "30px" }} />
                            </div>
                        </div>
                        <div className="col-md-3 mt-2">
                            Chọn tất cả
                        </div>
                        <div className="col-md-4 mt-2 text-start">
                            Sách
                        </div>
                        <div className="col-md-2 mt-2">
                            Thành tiền
                        </div>
                    </div>
                    {cartItems != null && cartItems.map((cartItem) => (<BookInCartITem cartItem={cartItem} handleChooseBook={handleChooseBook} handleRemoveBook={handleRemoveBook} isSelectedAllBooks={isSelectedAllBook} />))}
                    <button type="button" className="btn btn-danger" style={{ width: "100px", height: "40px", marginTop: "30px" }} onClick={handleDeleteAllCartItem}>Xóa tất cả</button>
                </div>
                <div className="col-md-4 pt-5">
                    <div style={{ backgroundColor: " #f8eded", height: "300px", borderRadius: "5px" }}>
                        <h3 className="text-start" style={{ marginLeft: "20px" }}>Tổng số tiền: </h3>
                        <h3 className="text-end" style={{ color: " #cc0000", paddingBottom: "20px", marginRight: "20px" }}>{Format(totalPrice)} đ</h3>
                        <hr />
                        <h4 className="text-start" style={{ marginLeft: "20px" }}>Số lượng sản phẩm: </h4>
                        <h4 className="text-end" style={{ marginRight: "15px", color: " #060270" }}>{totalSelectedBooks} cuốn sách</h4>
                        <button onClick={handlePayment} className="btn mt-5 w-25" style={{ marginLeft: "280px", backgroundColor: " #FF5101", color: "white" }}>
                            Mua sách
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;