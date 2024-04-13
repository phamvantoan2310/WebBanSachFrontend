import React, { useEffect, useState } from "react";
import BookModel from "../../../../models/BookModel";
import { getBookByOrderItemID } from "../../../../api/bookApi";
import { Link } from "react-router-dom";
import ImageModel from "../../../../models/ImageModel";
import { getImagesByBookId } from "../../../../api/imageApi";
import Format from "../../../../util/ToLocaleString";
interface BookInReportProcessInterface {
    orderItemID: number;
}

const BookInReportProcess: React.FC<BookInReportProcessInterface> = (props) => {
    const token = localStorage.getItem("tokenLogin");
    const [book, setBook] = useState<BookModel | null>();
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);
    const [images, setImages] = useState<ImageModel[]>([]);

    useEffect(() => {
        if (token) {
            getBookByOrderItemID(props.orderItemID, token).then(
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
        }
    }, [props.orderItemID])

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
        <div className="container">
            <div className="row">
                <div className="col-md-4">
                    <img
                        src={"data:image/png;base64," + dulieuanh}
                        className="card-img-top"
                        alt={book?.book_name}
                        style={{ height: '150px', width: '100px' }}
                    />
                </div>
                <div className="col-md-4">
                    <h5 className="text-start" style={{color:"blue"}}>{book?.book_name}</h5>
                    <p className="text-start">Giá: {Format(book?.price)} đ</p>
                </div>
                <div className="col-md-4 pt-5 mt-2">
                </div>
            </div>
        </div>
    );
}
export default BookInReportProcess;