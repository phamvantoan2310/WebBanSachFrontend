import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BookModel from "../../models/BookModel";
import { getABook, getBookByCategoryID } from "../../api/bookApi";
import ImageBookDetail from "./BookDetailComponent/ImageBookDetail";
import AuthorModel from "../../models/AuthorModel";
import { getAuthor } from "../../api/authorApi";
import Evaluate from "./BookDetailComponent/Evaluate";
import RenderRating from "../../util/RenderRating";
import Format from "../../util/ToLocaleString";
import { addCartItem } from "../../api/cartApi";
import { getCategoryByBookID } from "../../api/categoryApi";
import CategoryModel from "../../models/CategoryModel";
import BookInBookDetail from "./BookDetailComponent/BookInBookDetail";

const BookDetail: React.FC = () => {
    const token = localStorage.getItem("tokenLogin");
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

    const [books, setBooks] = useState<BookModel[] | undefined>([]);

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

    useEffect(() => {
        if (token && categorys && categorys.length > 0) { // Kiểm tra categorys có phần tử không
            if (categorys[0] && categorys[0].categoryID !== undefined) {
                getBookByCategoryID(token, categorys[0].categoryID).then(
                    result => {
                        setBooks(result);
                    }
                ).catch(
                    error => {
                        console.log(error);
                    }
                )
            }
        }
    }, [bookIDOk, categorys]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [bookIDOk]);


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
                    <div className="card text-start">
                        <div className="card-body">
                            <h2 className="card-title">{Book?.book_name}</h2>
                            <br />
                            <p className="card-text text-end">{categorys?.map((category) => category.categoryName + "-")}</p>
                            <br />
                            <h3 className="card-title text-end">{RenderRating(Book?.point ? Book.point : 0)}</h3>
                            <br />
                            <div className={"price mb-3 text-end"} >
                                <span className="original-price" style={{ paddingRight: "10px" }}>
                                    <del style={{ color: "red", fontSize: "23px" }}>{Format(Book?.listed_price)} đ</del>
                                </span>

                                <span className="discounted-price">
                                    <strong style={{ fontSize: "23px" }}>{Format(Book?.price)} đ</strong>
                                </span>
                            </div>
                            <br />
                            <div className="row">
                                <div className="col-md-5">
                                    <p className="card-text">{Book?.number_of_book != undefined && Book?.number_of_book > 0 ? "Còn hàng" : "Hết hàng"}</p>
                                </div>
                                <div className="col-md-7 text-end">
                                    <Link to={`/user/author/${Author?.author_id}`} style={{ textDecoration: "none" }}>
                                        <p className="card-text">Tác Giả: {Author?.author_name}</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card text-start mt-2" style={{ height: "297px" }}>
                        <div className="card-body">
                            <p className="card-subtitle mb-2" style={{ color: "GrayText" }}>Nhà xuất bản: {Book?.publisher}</p>
                            <br />
                            <p className="card-subtitle mb-2" style={{ color: "GrayText" }}>Năm xuất bản: {Book?.publication_year + ""}</p>
                            <br />
                            <p className="card-subtitle mb-2" style={{ color: "GrayText" }}>Đã bán: {Book?.quantity_sold}</p>
                            <br />
                            <p className="card-subtitle mb-2" style={{ color: "GrayText" }}>Trong kho: {Book?.number_of_book}</p>
                            <br />
                            <p className="card-subtitle mb-2" style={{ color: "GrayText" }}>Ngôn ngữ: {Book?.language}</p>
                        </div>
                    </div>
                </div>
                <div className="col-3">
                    <div style={{ marginBottom: "53px" }}>
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
                    <h6 className="text-start">Mô tả :</h6>
                    <div className="card text-start mt-2" style={{ height: "295px" }}>
                        <div className="card-body overflow-auto" style={{ maxHeight: "380px", maxWidth: "1300px" }}>
                            <p className="card-subtitle mb-2" style={{ color: "GrayText" }}>{Book?.description}</p>
                        </div>
                    </div>
                </div>
            </div>
            <hr style={{ border: "5px solid blue" }} />
            <div className="row">
                <div className="alert alert-light col-md-6" role="alert">
                    <h3 style={{ color: " #ff9900" }}>Đánh Giá</h3>
                    <Evaluate key={bookIDOk} bookID={bookIDOk} />
                </div>
                <div className="alert alert-light col-md-6" role="alert">
                    <h3 className="text-start mb-4" style={{ textAlign: "center", color: "gray" }}>Đọc trước</h3>
                    <div className="overflow-auto text-start" style={{ maxHeight: "400px", maxWidth: "1300px" }}>
                        <p>{Book?.content}...</p>
                    </div>
                </div>
            </div>
            <hr style={{ border: "5px solid blue" }} />
            <div className="row mt-5" style={{ backgroundColor: " #f2f2f3", borderRadius: "10px" }}>
                <h2 className="text-start mt-3" style={{ color: " #006699" }}>Có thể bạn cũng thích</h2>
                {books?.map(book =>
                    <BookInBookDetail key={book.book_id} book={book} />
                )}
            </div>
        </div>
    );
}

export default BookDetail;



