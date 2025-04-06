import React, { useEffect, useState } from "react";
import BookModel from "../../../../models/BookModel";
import ImageModel from "../../../../models/ImageModel";
import { getImagesByBookId } from "../../../../api/imageApi";
import Format from "../../../../util/ToLocaleString";
import { Link, Navigate, useNavigate } from "react-router-dom";

interface BookInCartITemInterface {
    book: BookModel;
    numberOfBook: number;
}

const BookInPay: React.FC<BookInCartITemInterface> = ({ book, numberOfBook }) => {
    const [images, setImages] = useState<ImageModel[]>([]);
    const token = localStorage.getItem("tokenLogin");
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);
    const [NumberOfBook, setNumberOfBook] = useState(numberOfBook);
    const navigate = useNavigate();



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
        <div className="row mt-5" style={{ backgroundColor: "antiquewhite", borderRadius: "10px", height: "170px" }}>
            <div className="col-md-4 mt-2">
                <Link to={`/book/${book?.book_id}`}>
                    <img
                        src={"data:image/png;base64," + dulieuanh}
                        className="card-img-top"
                        alt={book?.book_name}
                        style={{ height: '150px', width: '100px' }}
                    />
                </Link>
            </div>
            <div className="col-md-6 mt-4" style={{ paddingLeft: "100px" }}>
                <Link to={`/book/${book?.book_id}`} style={{ textDecoration: 'none' }}>
                    <h5 className="text-start mt-4">{book?.book_name}</h5>
                </Link>
                <p className="text-start">Giá: {Format(book?.price)} đ</p>
            </div>
            <div className="col-md-2 mt-5">
                <p className="text-start mt-4">Số lượng: {NumberOfBook}</p>
            </div>
        </div>
    );
}

export default BookInPay;