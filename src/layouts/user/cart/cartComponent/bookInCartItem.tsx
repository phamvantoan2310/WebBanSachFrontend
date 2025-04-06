import React, { useEffect, useState } from "react";
import CartItemModel from "../../../../models/CartItemModel";
import BookModel from "../../../../models/BookModel";
import { deleteCartItem, getBookInCartItem, updateNumberOfCartItem } from "../../../../api/cartApi";
import ImageModel from "../../../../models/ImageModel";
import { getImagesByBookId } from "../../../../api/imageApi";
import RenderRating from "../../../../util/RenderRating";
import Format from "../../../../util/ToLocaleString";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Checkbox } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

interface BookInCartITemInterface {
    cartItem: CartItemModel;
    handleChooseBook: (book: BookModel, numberOfBook: number) => void;
    handleRemoveBook: (book: BookModel) => void;
    isSelectedAllBooks: boolean;
}

const BookInCartITem: React.FC<BookInCartITemInterface> = ({ cartItem, handleChooseBook, handleRemoveBook, isSelectedAllBooks }) => {
    const [book, setBook] = useState<BookModel | null>(null);
    const [images, setImages] = useState<ImageModel[]>([]);
    const token = localStorage.getItem("tokenLogin");
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);
    const [NumberOfBook, setNumberOfBook] = useState(cartItem.numberOfCartItem);
    const navigate = useNavigate();

    const [isSelectedBook, setIsSelectedBook] = useState<boolean>(false);


    useEffect(() => {
        getBookInCartItem(cartItem.cartItemID, token != null ? token : "").then(
            result => {
                setBook(result);
                setdataload(false);
            }
        ).catch(
            error => {
                seterror(error);
                setdataload(false);
            }
        )
    }, [])

    useEffect(() => {
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

    const handleDeleteCartItem = () => {
        if (token != null) {
            const confirmDelete = window.confirm("Xác nhận xóa sách khỏi giỏ hàng?");
            if (confirmDelete) {
                deleteCartItem(cartItem.cartItemID, token).then(
                    result => {
                        alert("Xóa thành công");
                        navigate(0);
                    }
                ).catch(
                    error => {
                        console.log(error);
                    }
                )
            }
        }
    }

    const handleChangeNumberOfCartItem = (numberOfBook: number) => {
        if (token != null) {
            updateNumberOfCartItem(cartItem.cartItemID, numberOfBook, token).then(
                result => {
                    navigate(0);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }

    // chọn/xóa sách mua
    const handleChangeValueCheckbox = () => {
        setIsSelectedBook(!isSelectedBook);
    };

    useEffect(() => {
        if (book) {
            if (isSelectedBook) {
                handleChooseBook(book, NumberOfBook);
            } else {
                handleRemoveBook(book);
            }
        }
    }, [isSelectedBook]);

    useEffect(() => {
        setIsSelectedBook(isSelectedAllBooks);
    }, [isSelectedAllBooks]);


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

    return (
        <div className="row mt-5" style={{ backgroundColor: "antiquewhite", borderRadius: "10px", height: "170px" }}>
            <div className="col-md-1 d-flex align-items-center justify-content-center">
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" checked={isSelectedBook} id="checkbox1" style={{ fontSize: "30px" }} onChange={handleChangeValueCheckbox} />
                </div>
            </div>
            <div className="col-md-3 mt-2">
                <Link to={`/book/${book?.book_id}`}>
                    <img
                        src={"data:image/png;base64," + dulieuanh}
                        className="card-img-top"
                        alt={book?.book_name}
                        style={{ height: '150px', width: '100px' }}
                    />
                </Link>
            </div>
            <div className="col-md-4 mt-4">
                <Link to={`/book/${book?.book_id}`} style={{ textDecoration: 'none' }}>
                    <h5 className="text-start">{book?.book_name}</h5>
                </Link>
                <p className="text-start">Giá: {Format(book?.price)} đ</p>
                <div className="d-flex align-items-center">
                    Số lượng:<input className="form-control w-25" style={{ background: "none", border: "none" }} type="number" value={NumberOfBook} onChange={(e) => {
                        handleChangeNumberOfCartItem(Number(e.target.value));
                        setNumberOfBook(Number(e.target.value))
                    }} />
                </div>
            </div>
            <div className="col-md-2 pt-5 mt-3">
                <p>{Format(parseInt(book?.price + "") * NumberOfBook)} đ</p>
            </div>
            <div className="col-md-2 pt-5 mt-2">
                <button className="btn btn-danger text-end" onClick={handleDeleteCartItem}><DeleteOutlined /></button>
            </div>
        </div>
    );
}

export default BookInCartITem;