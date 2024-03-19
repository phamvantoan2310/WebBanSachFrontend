import React, { useEffect, useState } from "react";
import CartItemModel from "../../../models/CartItemModel";
import BookModel from "../../../models/BookModel";
import { deleteCartItem, getBookInCartItem } from "../../../api/cartApi";
import ImageModel from "../../../models/ImageModel";
import { getImagesByBookId } from "../../../api/imageApi";
import RenderRating from "../../../util/RenderRating";
import Format from "../../../util/ToLocaleString";
import { Link, Navigate, useNavigate } from "react-router-dom";

interface BookInCartITemInterface {
    cartItem: CartItemModel;
}

const BookInPay: React.FC<BookInCartITemInterface> = (props) => {
    const [book, setBook] = useState<BookModel | null>(null);
    const [images, setImages] = useState<ImageModel[]>([]);
    const token = localStorage.getItem("tokenLogin");
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);
    const [NumberOfBook, setNumberOfBook] = useState(props.cartItem.numberOfCartItem);
    const navigate = useNavigate();


    useEffect(() => {
        getBookInCartItem(props.cartItem.cartItemID, token != null ? token : "").then(
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
            <div className="col-md-8 mt-2" style={{paddingLeft:"130px"}}>
                <Link to={`/book/${book?.book_id}`} style={{ textDecoration: 'none' }}>
                    <h5 className="text-start">{book?.book_name}</h5>
                </Link>
                <p className="text-start">Giá: {Format(book?.price)} đ</p>
                <div className="d-flex align-items-center">
                    Số lượng:<input className="form-control text-center w-25" type="number" value={NumberOfBook} />
                </div>
            </div>
        </div>
    );
}

export default BookInPay;