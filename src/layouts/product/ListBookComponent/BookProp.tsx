import React, { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import ImageModel from "../../../models/ImageModel";
import { getImagesByBookId } from "../../../api/imageApi";
import { Link, NavLink } from "react-router-dom";
import RenderRating from "../../../util/RenderRating";
import Format from "../../../util/ToLocaleString";
import WishList from "../../../models/WishList";
import { getWishList } from "../../../api/wishListApi";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    isAdmin: boolean;
    isStaff: boolean;
    isUser: boolean;
}

interface bookPropInterface {
    book: BookModel;
}

const BookProp: React.FC<bookPropInterface> = ({ book }) => {
    const [images, setImages] = useState<ImageModel[]>([]);
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);

    const token = localStorage.getItem("tokenLogin");
    const [wishListCondition, setWishListCondition] = useState(false);
    const [wishLists, setWishLists] = useState<WishList[]>([]);

    const [staffCondition, setStaffCondition] = useState<boolean>(false);

    useEffect(() => {
        if (token) {
            const decodeJwt = jwtDecode(token) as JwtPayload;
            const isStaff = decodeJwt.isStaff;
            if (isStaff) {
                setStaffCondition(true);
            }
        }
    }, [token])

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

    const handleGetWishList = () => {
        if (token != null) {
            getWishList(token).then(
                result => {
                    console.log(result);
                    setWishLists(result);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }

    const handleAddBookToWishList = async (wishListID: number) => {
        const endpoint = "http://localhost:8080/user/addbooktowishlist";
        const requestData = {
            bookID: book.book_id,
            wishListID: wishListID,
        };

        console.log(requestData);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                alert("Thêm thành công");
            } else {
                alert("Thêm thất bại");
            }
        } catch (error) {
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
        <div className="col-md-3 mt-2">
            <div className="card" style={{ blockSize: "700px", height: "680px" }}>
                {staffCondition ? (                                          //tùy chỉnh hiển thị phụ thuộc vào quyền
                    <img 
                        src={"data:image/png;base64," + dulieuanh}
                        className="card-img-top"
                        alt={book.book_name}
                        style={{ height: '450px' }}
                    />
                ) :
                    (<Link to={`/book/${book.book_id}`}>
                        <img
                            src={"data:image/png;base64," + dulieuanh}
                            className="card-img-top"
                            alt={book.book_name}
                            style={{ height: '450px' }}
                        />
                    </Link>)}


                {wishListCondition && (     // WishList
                    <div className="fixed-top" style={{ top: "350px", left: "650px", right: "600px", borderRadius: "10px", backgroundColor: "gray" }}>
                        <h3 style={{ color: "whitesmoke" }}>Chọn danh sách yêu thích</h3>
                        {wishLists.map((wishlist) => (
                            <button className="btn btn-success mb-2" style={{ width: "200px", paddingLeft: "20px" }} key={wishlist.wishList_id} onClick={() => handleAddBookToWishList(wishlist.wishList_id)}>{wishlist.wishList_name}</button>
                        ))}
                        <button className="btn btn-danger" onClick={() => setWishListCondition(false)}>Đóng</button>
                    </div>)}


                <div className="card-body">
                    {staffCondition ? (<h5 className="card-title">{book.book_name}</h5>) :         //tùy chỉnh hiển thị phụ thuộc vào quyền
                        (<Link to={`/book/${book.book_id}`} style={{ textDecoration: 'none' }}>
                            <h5 className="card-title">{book.book_name}</h5>
                        </Link>)}
                    <div className="price mb-3">
                        <span className="original-price" style={{ paddingRight: "10px" }}>
                            <del style={{ color: "red" }}>{Format(book.listed_price)} đ</del>
                        </span>

                        <span className="discounted-price">
                            <strong>{Format(book.price)} đ</strong>
                        </span>
                    </div>
                    {staffCondition ?                        //tùy chỉnh hiển thị phụ thuộc vào quyền
                        (<Link to={`/staff/changebookinformation/${book.book_id}`}>
                            <button className="btn btn-success w-50 mt-4">Sửa</button>
                        </Link>) :
                        (<div className="row mt-2" role="group">
                            <div className="col-6">
                                <button className="btn btn-secondary btn-block" onClick={() => { handleGetWishList(); setWishListCondition(true) }}>
                                    <i className="fas fa-heart"></i>
                                </button>
                            </div>
                            <div className="col-6">
                                <button className="btn btn-danger btn-block">
                                    <NavLink to={`/book/${book.book_id}`}>
                                        <i className="fas fa-shopping-cart" style={{ color: "white" }}></i>
                                    </NavLink>
                                </button>
                            </div>
                            <h5 className="card-title mt-5 text-end">{RenderRating(book.point ? book.point : 0)}</h5>
                        </div>)}
                </div>
            </div>
        </div>
    );
}
export default BookProp;