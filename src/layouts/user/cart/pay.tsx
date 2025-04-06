import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { buyNow, buyOneBook, getCart, getCartItem } from "../../../api/cartApi";
import Format from "../../../util/ToLocaleString";
import BookInPay from "./payComponent/bookInPay";
import DeliveryTypeModel from "../../../models/DeliveryTypeModel";
import PaymentModel from "../../../models/PaymentModel";
import { getDeliveryType } from "../../../api/deliveryTypeApi";
import { getPayment } from "../../../api/paymentApi";
import BookModel from "../../../models/BookModel";
import { getABook } from "../../../api/bookApi";
import ImageModel from "../../../models/ImageModel";
import { getImagesByBookId } from "../../../api/imageApi";
import Stripe from "react-stripe-checkout";
import { HomeOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import UserModel from "../../../models/UserModel";
import { getAUser } from "../../../api/userApi";

const Pay: React.FC = () => {
    const token = localStorage.getItem("tokenLogin");
    useEffect(() => {
        if (token != null) {
            getAUser(token).then(
                result => {
                    if (result?.account_status == false) {
                        alert("Tài khoản chưa kích hoạt, vui lòng kích hoạt tài khoản trước khi đăng nhập!");
                        navigate("/user/login")
                    } else {
                        setUser(result);
                        setDeliveryAddress(result?.address);
                        setDeliveryPhoneNumber(result?.phone_number);
                        setDeliveryUserName(result?.user_name);
                        setdataload(false);
                    }
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



    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);
    const [deliveryTypes, setDeliveryTypes] = useState<DeliveryTypeModel[] | undefined>([]);
    const [payments, setPayments] = useState<PaymentModel[] | undefined>([]);
    const [priceBook, setPriceBook] = useState(0);
    const [priceOfDeliveryType, setPriceOfDeliveryType] = useState(15000);
    const [priceOfPayment, setPriceOfPayment] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    const [deliveryTypeID, setDeliveryTypeID] = useState(1);
    const [paymentID, setPaymentID] = useState(1);

    const [cartItemCondition, setCartItemCondition] = useState<boolean>(true);
    const [book, setBook] = useState<BookModel | null>(null);
    const [images, setImages] = useState<ImageModel[]>([]);

    const navigate = useNavigate();

    const { bookIDOk } = useParams();
    const { NumberOfBook } = useParams();

    const [stripeCondition, setStripeCondition] = useState<boolean>(false);



    const location = useLocation();
    const { selectedBooks } = location.state || {};
    const [totalNumberOfBooks, setTotalNumberOfBooks] = useState<number>();
    const [deliveryUserName, setDeliveryUserName] = useState<string | undefined>("");
    const [deliveryPhoneNumber, setDeliveryPhoneNumber] = useState<string | undefined>("");
    const [deliveryAddress, setDeliveryAddress] = useState<string | undefined>("");

    const [user, setUser] = useState<UserModel | null>();


    useEffect(() => {
        if (bookIDOk != null && !isNaN(parseInt(bookIDOk))) {    //nếu nhận về bookID và số lượng thì tức là người dùng click mua  
            setCartItemCondition(false);                         //ngay ở sách và chỉ hiển thị một mình sách
            getABook(parseInt(bookIDOk)).then(
                result => {
                    setBook(result);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        } else {                                                 // nếu không nhận vào bookID thì tức là người dùng chọn trực tiếp vào 
            setCartItemCondition(true);
            setdataload(false)                    //giỏ hàng thì lấy tất cả CartItem của giỏ hàng
        }
    }, [])

    useEffect(() => {                            //lấy phương thức vận chuyển
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

    useEffect(() => {                          //lấy phương thức thanh toán
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

    useEffect(() => {                         //tính toán tổng tiền và gọi lại khi thay đổi một trong 3 giá trị trong state
        setTotalPrice(priceBook + priceOfDeliveryType + priceOfPayment);
    }, [priceBook, priceOfDeliveryType, priceOfPayment])

    useEffect(() => {
        if (bookIDOk != null && !isNaN(parseInt(bookIDOk)) && book?.price != undefined) {        //nếu mua ngay ở sách thì chỉ lấy giá của 
            setPriceBook(book?.price * parseInt((NumberOfBook != undefined ? NumberOfBook : "1")))      //cuốn sách được truyền ID
        } else {
            if (selectedBooks != null) {                                                              //nếu không có ID sách được truyền vào thì 
                let newTotalPrice = 0;
                let totalNumberOfBooks = 0;                                                        //lấy giá của toàn bộ sách ở selectedbooks
                for (let key in selectedBooks) {
                    newTotalPrice += selectedBooks[key].book.price * selectedBooks[key].numberOfBook;
                    totalNumberOfBooks += selectedBooks[key].numberOfBook;
                }
                setPriceBook(newTotalPrice);
                setTotalNumberOfBooks(totalNumberOfBooks);
            }
        }
    }, [selectedBooks, book])

    useEffect(() => {                                   //lấy ảnh của sách nếu có ID của sách được truyền vào
        if (book != null) {
            const masach: number = book.book_id;
            getImagesByBookId(masach).then(
                result => {
                    setImages(result);
                    setdataload(false);
                }
            ).catch(
                error => {
                    seterror(error);
                    setdataload(false);
                }
            );
        }
    }, [book])


    const handleChangeDeliveryType = () => {        //thay đổi giá của phương thức vận chuyển khi thay đổi phương thức vận chuyển
        let newPrice = 0;
        if (deliveryTypes) {
            const delivery = document.getElementById("delivery") as HTMLSelectElement | null;
            if (delivery && delivery.value && deliveryTypes[parseInt(delivery.value) - 1]) {
                if (delivery.value != "9") {
                    newPrice = deliveryTypes[parseInt(delivery.value) - 1].priceOfDeliveryType;
                    setDeliveryTypeID(parseInt(delivery.value));
                } else {
                    return;
                }
            }
        }
        setPriceOfDeliveryType(newPrice);
    }
    const handleChangePaymentType = () => {       //thay đổi giá của phương thức thanh toán khi phương thức thanh toán thay đổi
        if (payments) {
            const pay = document.getElementById("pay") as HTMLSelectElement | null;
            if (pay && pay.value && payments[parseInt(pay.value) - 1]) {
                if (pay.value != "9") {
                    setPriceOfPayment(payments[parseInt(pay.value) - 1].priceOfPayment);
                    setPaymentID(parseInt(pay.value));
                } else {
                    return;
                }
            }

        }
    }

    const handleBuyNow = () => {      //tạo order khi mua sách, hiện thanh toán bằng thẻ khi chọn thanh toán bằng thẻ
        if (token == null) {
            navigate("/user/login");
            return;
        } else if (true) {
            if (cartItemCondition && deliveryAddress && deliveryPhoneNumber && deliveryUserName) {
                buyNow(deliveryTypeID, paymentID, token, deliveryAddress, deliveryPhoneNumber, deliveryUserName, selectedBooks).then(
                    result => {
                        alert("Mua thành công, vui lòng chờ duyệt đơn hàng");
                    }
                ).catch(
                    error => {
                        alert("Quá trình mua gặp lỗi, vui lòng thử lại");
                    }
                );
            } else if (bookIDOk && NumberOfBook && deliveryAddress && deliveryPhoneNumber && deliveryUserName) {
                buyOneBook(deliveryTypeID, paymentID, token, parseInt(bookIDOk), parseInt(NumberOfBook), deliveryAddress, deliveryPhoneNumber, deliveryUserName).then(
                    result => {
                        alert("Mua sách thành công");
                    }
                ).catch(
                    error => {
                        alert("Quá trình mua gặp lỗi, vui lòng thử lại");
                    }
                )
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

    let dulieuanh: string = "";
    if (images[0] && images[0].data) {
        dulieuanh = images[0].data;
    }

    async function handleToken(tokenStripe: any) {                 //lấy token để thanh toán credit card
        const endpoint: string = "http://localhost:8080/api/payment/charge";
        try {
            await fetch(endpoint, {
                method: 'POST',
                headers: {
                    token: tokenStripe.id,
                    amount: totalPrice + "",
                    Authorization: `Bearer ${token}`
                }
            }).then(() => {
                setStripeCondition(false);
                handleBuyNow();
            }).catch((error) => {
                alert(error);
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="container">
            <div className="pt-5 mt-5">
                <div className="row">
                    <h1 className="text-start col-md-3">Thanh toán</h1>
                    <p className="col-md-1 pt-4" style={{ marginLeft: "-150px" }}>({cartItemCondition ? totalNumberOfBooks : 1})</p>{/*xét điều kiện */}
                </div>
                <h3 className="text-end" style={{ marginRight: "200px" }}>Chi tiết đơn hàng</h3>
                <hr />
            </div>
            <div className="row">
                <div className="col-md-8">
                    <div className="row" style={{ backgroundColor: "#e6e6e6", borderRadius: "10px", height: "50px" }}>
                        <div className="col-md-4 mt-2">

                        </div>
                        <div className="col-md-6 mt-2" style={{ paddingRight: "220px" }}>
                            Sách
                        </div>
                        <div className="col-md-2 mt-2" style={{ paddingRight: "60px" }}>
                            Số lượng
                        </div>
                    </div>
                    {cartItemCondition && selectedBooks != null && selectedBooks.map((item: { book: BookModel; numberOfBook: number }) => (<BookInPay book={item.book} numberOfBook={item.numberOfBook} />))}  {/*xét điều kiện */}
                    {!cartItemCondition && (
                        <div className="row mt-5" style={{ backgroundColor: "antiquewhite", borderRadius: "10px" }}>
                            <div className="col-md-4">
                                <Link to={`/book/${book?.book_id}`}>
                                    <img
                                        src={"data:image/png;base64," + dulieuanh}
                                        className="card-img-top"
                                        alt={book?.book_name}
                                        style={{ height: '150px', width: '100px' }}
                                    />
                                </Link>
                            </div>
                            <div className="col-md-8 mt-2" style={{ paddingLeft: "130px" }}>
                                <Link to={`/book/${book?.book_id}`} style={{ textDecoration: 'none' }}>
                                    <h5 className="text-start">{book?.book_name}</h5>
                                </Link>
                                <p className="text-start">Giá: {Format(book?.price)} đ</p>
                                <div className="d-flex align-items-center">
                                    Số lượng:<input className="form-control text-center w-25" type="number" value={NumberOfBook} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="col-md-4">

                    <h5 className="text-start mt-5">Thông tin giao hàng: </h5>
                    <form className="form">
                        <div className="mb-3 row">
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    style={{ background: "none", border: "none", marginLeft: "20px", width: "350px", color: "GrayText" }}
                                    className="form-control"
                                    value={deliveryUserName}
                                    onChange={(e) => setDeliveryUserName(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6 d-flex align-items-center justify-content-end" >
                                <UserOutlined style={{ marginRight: "10px" }} />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    style={{ background: "none", border: "none", marginLeft: "20px", width: "350px", color: "GrayText" }}
                                    className="form-control"
                                    value={deliveryPhoneNumber}
                                    onChange={(e) => setDeliveryPhoneNumber(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6 d-flex align-items-center justify-content-end">
                                <PhoneOutlined style={{ marginRight: "10px" }} />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    style={{ background: "none", border: "none", marginLeft: "20px", width: "350px", color: "GrayText" }}
                                    className="form-control"
                                    value={deliveryAddress}
                                    onChange={(e) => setDeliveryAddress(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6 d-flex align-items-center justify-content-end">
                                <HomeOutlined style={{ marginRight: "10px" }} />
                            </div>
                        </div>
                    </form>

                    <h5 className="text-start mb-4">Phương thức vận chuyển: </h5>
                    <select className="form-select mb-2" id="delivery" aria-label="Default select example" style={{ color: "orange" }} onChange={handleChangeDeliveryType}>
                        {deliveryTypes?.map((deliveryType) => (<option value={deliveryType.deliveryTypeID}>{deliveryType.deliveryTypeName}</option>))}
                    </select>

                    <h5 className="text-start mb-4">Phương thức thanh toán: </h5>
                    <select className="form-select mb-5" id="pay" aria-label="Default select example" style={{ color: "orange" }} onChange={handleChangePaymentType}>
                        {payments?.map((payment) => (<option value={payment.paymentID}>{payment.paymentName}</option>))}
                    </select>

                    <h3 className="text-start mt-5 mb-4" style={{ color: "red" }}>Chi tiết thanh toán: </h3>
                    <p className="text-start" style={{ paddingLeft: "20px" }}>Tiền sách: {Format(priceBook)} đ</p>
                    <p className="text-start" style={{ paddingLeft: "20px" }}>Phí vận chuyển: {Format(priceOfDeliveryType)} đ</p>
                    <p className="text-start" style={{ paddingLeft: "20px" }}>Phí thanh toán: {Format(priceOfPayment)} đ</p>
                    <hr />
                    <h4 className="text-start" style={{ paddingTop: "10px" }}>Tổng:</h4>
                    <h3 className="text-end" style={{ color: "red", paddingBottom: "40px" }}>{Format(totalPrice)} đ</h3>
                    {!stripeCondition && <button type="button" className="btn btn-danger w-50 mb-5" onClick={paymentID == 1 ? handleBuyNow : () => setStripeCondition(true)}>Mua ngay</button>}
                    {stripeCondition && <Stripe stripeKey="pk_test_51Oyy9G08IedeBdvZREyX6FZsHUEClaKK89nvZNm9g9LPqNfqPoAP2etIcXBW3roGjfzQNdBLm0dYH4VWcmI7sZ2L00HpZPfcD0" token={handleToken} />}
                    {stripeCondition && <button type="button" className="btn btn-danger" style={{ marginLeft: "50px" }} onClick={() => setStripeCondition(false)}>Đổi phương thức thanh toán</button>}
                </div>
            </div>
        </div>
    );
}

export default Pay;