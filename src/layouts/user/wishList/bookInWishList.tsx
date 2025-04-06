import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { changeWishListName, deleteWishList, existByWishListName, getBookInWishList } from "../../../api/wishListApi";
import BookModel from "../../../models/BookModel";
import BookProp from "./wishListComponent/BookProp";
import { SettingOutlined } from "@ant-design/icons";

const BookInWishList: React.FC = () => {
    const { wishListID } = useParams();
    const { wishListName } = useParams();
    const token = localStorage.getItem("tokenLogin");
    const navigate = useNavigate();

    const [listBook, setListBook] = useState<BookModel[] | undefined>([]);
    const [dataload, setDataLoad] = useState(true);
    const [error, seterror] = useState('');
    const [notification, setNotification] = useState('');

    const handleDeleteWishList = () => {
        if (token != null && wishListID != undefined) {
            const confirmDelete = window.confirm("Xác nhận xóa danh sách yêu thích?");
            if (confirmDelete) {
                const wishListIDNumber = parseInt(wishListID);
                deleteWishList(wishListIDNumber, token).then(
                    response => {
                        if (response?.ok) {
                            setNotification('');
                            navigate("/user/wishList");
                        } else {
                            alert("Xóa không thành công")
                        }
                    }
                )
            }
        }
    }
    useEffect(() => {
        if (wishListID != null && token != undefined) {
            getBookInWishList(wishListID, token).then(
                result => {
                    setDataLoad(false);
                    setListBook(result);
                }
            ).catch(
                error => {
                    setDataLoad(false);
                    seterror(error);
                }
            )
        }
    }, []);

    const [nameChangeCondition, setNameChangeCondition] = useState<boolean>(false);
    const [nameChange, setNameChange] = useState<string>("")

    const handleChangeName = async () => {
        if (wishListID && nameChange && token) {
            const alreadyWishListName = await existByWishListName(nameChange);
            if (alreadyWishListName == false) {
                changeWishListName(Number(wishListID), nameChange, token).then(
                    result => {
                        alert("Đổi tên thành công!");
                        navigate("/user/wishList")
                    }
                ).catch(
                    error => {
                        console.log(error);
                        setNotification("Đổi tên thất bại!")
                    }
                )
            } else {
                setNotification("Tên danh sách đã tồn tại!");
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
        <div className="container pt-5 mt-5 mb-5 pb-5">
            <div className="row">
                {/* Danh sách sách */}
                <div className="col-sm-9">
                    <div className="row mt-4">
                        {listBook?.map((book) => (
                            <BookProp
                                key={book.book_id}
                                book={book}
                                wishListID={parseInt(wishListID !== undefined ? wishListID : "0")}
                            />
                        ))}
                    </div>
                </div>

                {/* Thông tin danh sách yêu thích */}
                <div className="col-sm-3">
                    <div className="sticky-top" style={{ top: "200px" }}>
                        <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                            <div className="card-body bg-success text-center">
                                <div className="text-end" style={{ color: "white" }}>
                                    <SettingOutlined onClick={() => setNameChangeCondition(true)} />
                                </div>
                                <h3 className="text-white fw-bold py-4">{wishListName}</h3>
                            </div>

                            <div className="card-body p-4">
                                <p className="fs-5 mb-4">📚 Số lượng sách: {listBook?.length}</p>

                                <button
                                    className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleDeleteWishList}>
                                    <i className="fa fa-trash" aria-hidden="true"></i>
                                    Xóa danh sách
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*form cập nhật mật khẩu */}
            {nameChangeCondition && <div className="container fixed-top p-4 shadow-lg bg-white rounded" style={{ marginTop: "250px", maxWidth: "400px", border: "1px solid green" }}>
                <h3 className="text-start" style={{ marginLeft: "5px", color: "green" }}>Đổi tên</h3>
                <button className="btn btn-danger position-absolute top-0 end-0 m-3" onClick={() => (setNameChangeCondition(false))}>X</button>
                <div className="mt-5">
                    <input type="text" className="form-control mb-3" style={{ border: "1px solid green" }} placeholder="Tên mới" onChange={(e) => setNameChange(e.target.value)} />
                    <button className="btn btn-primary" onClick={handleChangeName}>Thay đổi</button>
                    <div style={{ color: "red" }}>{notification}</div>
                </div>
            </div>}
        </div>

    );
}

export default BookInWishList;