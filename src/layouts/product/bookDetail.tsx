import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BookModel from "../../models/BookModel";
import { getABook } from "../../api/bookApi";
import ImageBookDetail from "./BookDetailComponent/ImageBookDetail";
import AuthorModel from "../../models/AuthorModel";
import { getAuthor } from "../../api/authorApi";
import Evaluate from "./BookDetailComponent/Evaluate";
import RenderRating from "../../util/RenderRating";
import Format from "../../util/ToLocaleString";
import { addCartItem } from "../../api/cartApi";
import { getCategoryByBookID } from "../../api/categoryApi";
import CategoryModel from "../../models/CategoryModel";

const BookDetail: React.FC = () => {
    const { bookID } = useParams();

    let bookIDOk: number = 0;
    try {
        bookIDOk = parseInt(bookID + '');
        if (Number.isNaN(bookIDOk)) {
            bookIDOk = 0;
        }
    } catch (error) {
        console.error("ERROR: " + error);
        bookIDOk = 0;
    }

    const [Book, setBook] = useState<BookModel | null>(null);
    const [dataload, setDataLoad] = useState<boolean>(true);
    const [error, setError] = useState(null);
    const [Author, setAuthor] = useState<AuthorModel | null>(null);
    const [NumberOfBook, setNumberOfBook] = useState(1);
    const [categorys, setCategorys] = useState<CategoryModel[] | undefined>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getABook(bookIDOk).then(
            result => {
                setBook(result);
                setDataLoad(false);
            }
        ).catch(
            error => {
                setError(error);
                setDataLoad(false);
            }
        )
    }, [bookIDOk])

    useEffect(() => {
        getAuthor(bookIDOk).then(
            author => {
                setAuthor(author);
            }
        ).catch(
        )
    }, [bookIDOk])

    useEffect(() => {
        getCategoryByBookID(bookIDOk).then(
            result => {
                setCategorys(result);
            }
        ).catch(
            error => {
                console.log(error);
            }
        )
    }, [bookIDOk])

    const increasing = () => {
        const inventoryQuantity = (Book && Book.number_of_book ? Book.number_of_book : 0);
        if (NumberOfBook < inventoryQuantity) {
            setNumberOfBook(NumberOfBook + 1);
        }
    }

    const decreasing = () => {
        if (NumberOfBook >= 2) {
            setNumberOfBook(NumberOfBook - 1);
        }
    }

    const handleNumberOfBookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newNumberOfBook = parseInt(e.target.value);
        const inventoryQuantity = (Book && Book.number_of_book ? Book.number_of_book : 0);
        if (!isNaN(newNumberOfBook) && newNumberOfBook >= 1 && newNumberOfBook <= inventoryQuantity) {
            setNumberOfBook(newNumberOfBook);
        }
    }

    const handleBuyNow = () => {

    }

    const handleAddToCart = () => {
        const token = localStorage.getItem("tokenLogin");
        if (token == null) {
            navigate("/user/login");
        } else {
            addCartItem(bookIDOk, NumberOfBook, token).then(
                result => {
                    alert("Thêm sản phẩm thành công!");
                }
            ).catch(
                error => {
                    console.log(error);
                    alert("Thêm sản phẩm thất bại!");
                }
            )
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
        <div className="container pt-5" >
            <hr />
            <div className="row mt-4 mb-4">
                <div className="col-5" >
                    <ImageBookDetail key={bookIDOk} bookID={bookIDOk} />
                </div>
                <div className="col-4">
                    <div className="card text-start" style={{ width: "26rem" }}>
                        <div className="card-body">
                            <h3 className="card-title">{Book?.book_name}</h3>
                            <br />
                            <p className="card-text text-end" style={{ fontSize: "0.75em" }}>{categorys?.map((category) => category.categoryName + "-")}</p>
                            <br />
                            <h3 className="card-title text-end">{RenderRating(Book?.point ? Book.point : 0)}</h3>
                            <br />
                            <h4 className="card-subtitle mb-2 text-danger text-end" >{Format(Book?.price)} đ</h4>
                            <br />
                            <Link to={`/user/author/${Author?.author_id}`} style={{textDecoration:"none"}}>
                                <p className="card-text text-end">Tác Giả: {Author?.author_name}</p>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-3">
                    <div>
                        <div className="mb-2">Số lượng</div>
                        <div className="d-flex align-items-center">
                            <button className="btn btn-outline-secondary me-2" onClick={decreasing}>-</button>
                            <input className="form-control text-center" type="number" value={NumberOfBook} min={1} onChange={handleNumberOfBookChange} />
                            <button className="btn btn-outline-secondary ms-2" onClick={increasing}>+</button>
                        </div>
                        {
                            Book?.price && (
                                <div className="mt-2 text-center">
                                    Số tiền tạm tính <br />
                                    <h4>{Format(NumberOfBook * Book.price)} đ</h4>
                                </div>
                            )
                        }
                        <div className="d-grid gap-2">
                            <Link to={`/user/pay/${bookIDOk}/${NumberOfBook}`}>
                                <button type="button" className="btn btn-danger mt-3 w-100" onClick={handleBuyNow}>Mua ngay</button>
                            </Link>
                            <button type="button" className="btn btn-outline-secondary mt-2" onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <div className="alert alert-light" role="alert">
                <h3 style={{ textAlign: "center" }}>Đánh Giá</h3>
                <Evaluate key={bookIDOk} bookID={bookIDOk} />
            </div>
            <hr />
        </div>
    );
}

export default BookDetail;



