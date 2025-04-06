import React, { useEffect, useState } from "react";
import BookModel from "../../../../models/BookModel";
import { Link, useNavigate } from "react-router-dom";
import ImageModel from "../../../../models/ImageModel";
import { getImagesByBookId } from "../../../../api/imageApi";
import { changeNumberOfBook, deleteBook } from "../../../../api/bookApi";

interface BookInWareHouseInterface {
    book: BookModel;
}

const BookInWareHouse: React.FC<BookInWareHouseInterface> = (props) => {
    const token = localStorage.getItem("tokenLogin");
    const navigate = useNavigate();
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);
    const [images, setImages] = useState<ImageModel[]>([]);
    const [NumberOfBook, setNumberOfBook] = useState(0);

    const [number_of_book, setNumber_Of_Book] = useState<number | undefined>(props.book.number_of_book);



    useEffect(() => {
        if (props.book != null) {
            const masach: number = props.book.book_id;
            getImagesByBookId(masach).then(
                result => {
                    setImages(result);
                    setdataload(false);
                }
            ).catch(
                error => {
                    console.log(error);
                    setdataload(false);
                }
            );
        }
    }, [props.book])

    const increasing = () => {
        setNumberOfBook(NumberOfBook + 1);
    }

    const decreasing = () => {
        if (NumberOfBook >= 1) {
            setNumberOfBook(NumberOfBook - 1);
        }
    }

    const handleNumberOfBookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newNumberOfBook = parseInt(e.target.value);
        setNumberOfBook(newNumberOfBook);
    }

    const handleChange = () => {
        if (token) {
            changeNumberOfBook(token, NumberOfBook, props.book.book_id).then(
                result => {
                    alert("Thay đổi thành công");
                    if (number_of_book) {
                        setNumber_Of_Book(number_of_book + NumberOfBook);
                    }
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }

    // ********************************
    const handleDeleteBook = async() => {
        const confirmDelete = window.confirm("Xác nhận xóa sách?");
        if (confirmDelete) {
            if (token) {
                await deleteBook(token, props.book.book_id).then(
                    result => {
                        console.log(result);
                    }
                ).catch(
                    error => {
                        console.log(error);
                    }
                )
                await deleteBook(token, props.book.book_id).then(
                    result => {
                        alert("xóa thành công");
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
        <div className="row pt-5 pb-5" style={{ backgroundColor: "white", borderRadius: "10px", border: "1px solid #060270" }}>
            <div className="col-md-4">
                <img
                    src={"data:image/png;base64," + dulieuanh}
                    className="card-img-top"
                    alt={props.book.book_name}
                    style={{ height: '150px', width: '100px' }}
                />
            </div>
            <div className="col-md-4">
                <h6 className="text-start" style={{ color: " #AAAAAA" }}>Mã sách: {props.book.book_id}</h6>
                <h5 className="text-start" style={{ color: "blueviolet" }}>{props.book.book_name}</h5>
                <h6 className="text-start">Số lượng tồn: {number_of_book}</h6>
                <h6 className="text-start">Đã bán: {props.book.quantity_sold}</h6>
                <h6 className="text-start">Nhập thêm hàng: </h6>
                <div className="d-flex align-items-center">
                    <button className="btn btn-outline-secondary me-2" onClick={decreasing}>-</button>
                    <input className="form-control text-center" type="number" value={NumberOfBook} min={1} onChange={handleNumberOfBookChange} />
                    <button className="btn btn-outline-secondary ms-2" onClick={increasing}>+</button>
                </div>
            </div>
            <div className="col-md-4">
                <button className="btn btn-success" style={{ marginLeft: "200px", width: "150px" }} onClick={handleChange}>Lưu thay đổi</button>
                <button className="btn btn-danger mt-5" style={{ marginLeft: "200px", width: "150px" }} onClick={handleDeleteBook}>Xóa</button>
            </div>
        </div>
    );
}

export default BookInWareHouse;
