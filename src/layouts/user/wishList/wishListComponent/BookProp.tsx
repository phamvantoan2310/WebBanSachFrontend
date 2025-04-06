import React, { useEffect, useState } from "react";
import BookModel from "../../../../models/BookModel";
import ImageModel from "../../../../models/ImageModel";
import { getImagesByBookId } from "../../../../api/imageApi";
import { Link, useNavigate } from "react-router-dom";
import RenderRating from "../../../../util/RenderRating";
import Format from "../../../../util/ToLocaleString";

interface bookPropInterface {
    book: BookModel;
    wishListID: number;
}

const BookProp: React.FC<bookPropInterface> = ({ book, wishListID }) => {
    const [images, setImages] = useState<ImageModel[]>([]);
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const token = localStorage.getItem("tokenLogin");

    const navigate = useNavigate();

    useEffect(() => {
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
    }, [])

    const handleRemoveBookInWishList = async () => {
        const endpoint = "http://localhost:8080/user/removebookinwishlist";
        const requestData = {
            bookID: book.book_id,
            wishListID: wishListID,
        };

        console.log(requestData);

        try {
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                alert("Xóa thành công");
                navigate(0);
            } else {
                alert("Xóa thất bại");
            }
        } catch (error) {
            alert("Xóa thất bại");
            console.log(error)
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

    return (
        <div className="col-md-4 mt-2">
            <div className="card shadow-lg rounded-4" style={{ minHeight: "670px" }}>
                <Link to={`/book/${book.book_id}`} className="d-block overflow-hidden rounded-top">
                    <img
                        src={"data:image/png;base64," + dulieuanh}
                        className="card-img-top object-fit-cover"
                        alt={book.book_name}
                        style={{ height: '450px' }}
                    />
                </Link>

                <div className="card-body d-flex flex-column justify-content-between">
                    <Link to={`/book/${book.book_id}`} style={{ textDecoration: 'none' }}>
                        <h5 className="card-title text-truncate" title={book.book_name}>{book.book_name}</h5>
                    </Link>

                    <div className="price mb-3 d-flex align-items-center">
                        <span className="original-price text-muted me-2">
                            <del>{Format(book.listed_price)} đ</del>
                        </span>
                        <span className="discounted-price text-danger fw-bold">
                            {Format(book.price)} đ
                        </span>
                    </div>

                    <div className="row mt-2" role="group">
                        <div className="col-6">
                            <button
                                className="btn w-100 position-relative"
                                style={{ border: "1px solid grey" }}
                                onClick={handleRemoveBookInWishList}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                <i className="fa fa-heart" style={{ color: "grey" }} />
                                {isHovered && (
                                    <span className="position-absolute top-100 start-50 translate-middle-x mt-2 bg-dark text-white px-2 py-1 rounded w-100">
                                        Xóa khỏi danh sách
                                    </span>
                                )}
                            </button>
                        </div>

                        <div className="col-6">
                            <Link to={`/book/${book.book_id}`} className="btn btn-danger w-100">
                                <i className="fas fa-shopping-cart" />
                            </Link>
                        </div>
                    </div>

                    <h5 className="card-title mt-4 text-end">
                        {RenderRating(book.point || 0)}
                    </h5>
                </div>
            </div>
        </div>

    );
}
export default BookProp;