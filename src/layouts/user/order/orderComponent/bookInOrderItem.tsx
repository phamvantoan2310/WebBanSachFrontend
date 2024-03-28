import React, { useEffect, useState } from "react";
import OrderItemModel from "../../../../models/OrderItemModel";
import { Link, useNavigate } from "react-router-dom";
import BookModel from "../../../../models/BookModel";
import { getBookByOrderItemID } from "../../../../api/bookApi";
import { getAImagesByBookId, getImagesByBookId } from "../../../../api/imageApi";
import ImageModel from "../../../../models/ImageModel";
import Format from "../../../../util/ToLocaleString";
interface BookInOrderItemInterface {
    orderItem: OrderItemModel;
}
const BookInOrderItem: React.FC<BookInOrderItemInterface> = (props) => {
    const token = localStorage.getItem("tokenLogin");
    const navigate = useNavigate();
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);
    const [book, setBook] = useState<BookModel | null>(null);
    const [images, setImages] = useState<ImageModel[]>([]);


    useEffect(() => {
        if (token != null) {
            getBookByOrderItemID(props.orderItem.orderItemID, token).then(
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
        } else {
            navigate("/user/login");
            return;
        }
    }, [props.orderItem])

    useEffect(() => {
        if (book != null) {
            const masach: number = book.book_id;
            getImagesByBookId(masach).then(
                result => {
                    setImages(result);
                }
            ).catch(
                error => {
                    console.log(error);
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
        <div className="row">
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
            <div className="col-md-4">
                <Link to={`/book/${book?.book_id}`} style={{ textDecoration: 'none' }}>
                    <h5 className="text-start">{book?.book_name}</h5>
                </Link>
                <p className="text-start">Giá: {Format(book?.price)} đ</p>
            </div>
            <div className="col-md-4 pt-5 mt-2">
            </div>
        </div>
    );
}

export default BookInOrderItem;