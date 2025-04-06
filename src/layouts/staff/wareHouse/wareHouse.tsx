import React, { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import { getAllBook, staffFindBook, staffGetAllBook } from "../../../api/bookApi";
import BookInWareHouse from "./wareHouseComponent/bookInWareHouse";
import { Link } from "react-router-dom";
import RequireStaff from "../../../util/requireStaff";
import RequireAdminAndStaff from "../../../util/requireAdminAndStaff";

const WareHouseStaffAndAdmin: React.FC = () => {
    const token = localStorage.getItem("tokenLogin");

    const [books, setBooks] = useState<BookModel[] | undefined>([]);
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);

    const [bookName, setBookName] = useState("");

    useEffect(() => {
        if (token) {
            staffGetAllBook(token).then(
                result => {
                    setBooks(result);
                    setdataload(false);
                }
            ).catch(
                error => {
                    seterror(error);
                    setdataload(false);
                }
            )
        }
    }, [])

    const handleStaffSearchBook = () => {
        if (token && bookName != "") {
            staffFindBook(token, bookName).then(
                result => {
                    setBooks(result);
                    console.log(result);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        } else {
            if (token) {
                staffGetAllBook(token).then(
                    result => {
                        setBooks(result);
                        setdataload(false);
                    }
                ).catch(
                    error => {
                        seterror(error);
                        setdataload(false);
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

    return (
        <div className="container pt-5">
            <h1 className="text-start pt-5">Kho ({books?.length} sản phẩm)</h1>
            <Link to={"/admin/addbook"}>
                <button className="btn btn-primary" style={{ marginLeft: "1150px", width: "150px" }}>Thêm sản phẩm</button>
            </Link>
            <hr />
            <div className="d-flex pt-3">
                <input className="form-control me-2" type="search" placeholder="Tìm kiếm sách" aria-label="Search" style={{width:"500px", marginLeft:"699px"}} onChange={(e) => setBookName(e.target.value)} value={bookName}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleStaffSearchBook();
                        }
                    }}
                />
                <button className="btn btn-outline-success" type="button" onClick={handleStaffSearchBook}>Tìm kiếm</button>
            </div>
            <div className="overflow-auto mt-3" style={{ height: "800px" }}>
                {books?.map((book) => <BookInWareHouse key={book.book_id} book={book} />)}
            </div>
        </div>
    );
}

const WareHouse = RequireAdminAndStaff(WareHouseStaffAndAdmin);
export default WareHouse;