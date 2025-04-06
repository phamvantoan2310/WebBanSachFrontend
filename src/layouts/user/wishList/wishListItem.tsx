import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import WishList from "../../../models/WishList";
import { jwtDecode } from "jwt-decode";
import { addWishList, getWishList } from "../../../api/wishListApi";
import { getAUser } from "../../../api/userApi";

const WishListItem: React.FC = () => {
    const token = localStorage.getItem("tokenLogin");
    useEffect(() => {
        if (token) {
            const dataToken = jwtDecode(token);
            if (dataToken.exp != undefined ? dataToken.exp : 0 > Math.floor(Date.now())) {
                getAUser(token).then(
                    result => {
                        if (result?.account_status == false) {
                            navigate("/account")
                        }
                    }
                ).catch(
                    error => {
                        console.log(error);
                    }
                )
            } else {
                navigate("/user/login");
                return;
            }
        } else {
            navigate("/user/login");
            return;
        }
    }, [token])


    const navigate = useNavigate();
    const [wishLists, setWishList] = useState<WishList[]>([]);
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState<any>(null);
    const [formCondition, setFormCondition] = useState(false);

    const [wishListName, setWishListName] = useState('');
    const [decription, setDecription] = useState('');

    const handleAddWishList = () => {
        const wishlist: WishList = {
            wishList_id: 0,
            wishList_name: wishListName
        }
        addWishList(wishlist, token).then(
            respose => {
                if (respose?.ok) {
                    setDecription("Tạo wishlist thành công");
                    setWishList([...wishLists, wishlist]);
                    setFormCondition(false);
                } else {
                    setDecription("thêm thất bại")
                }
            }
        ).catch(
            error => {
                console.log(error);
            }
        )
    }

    useEffect(() => {
        try {
            if (token) {
                getWishList(token != null ? token : '').then(
                    result => {
                        console.log(result);
                        setWishList(result);
                        setdataload(false);
                    }
                )
            } else {
                navigate("/user/login");
            }

        } catch (error) {
            setdataload(false);
            seterror(error);
        }

    }, [token])

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
        <div className="container py-5">
            <div className="text-center mb-4 mt-5">
                <h2 className="fw-bold">Danh sách Yêu thích</h2>
                <p className="text-muted">Quản lý và tạo các danh sách yêu thích của bạn một cách dễ dàng.</p>
            </div>

            <div className="row g-4">
                {wishLists.map((wishlist) => (
                    <div key={wishlist.wishList_id} className="col-md-4">
                        <Link to={`/user/wishList/${wishlist.wishList_id}/${wishlist.wishList_name}`} style={{ textDecoration: 'none' }}>
                            <div className="card shadow-lg border-0 rounded-4" style={{ backgroundColor: " #5733FF", transition: 'transform 0.3s' }}>
                                <div className="card-body text-white">
                                    <h5 className="card-title fw-semibold">{wishlist.wishList_name}</h5>
                                    <p className="card-text">Xem chi tiết &raquo;</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            <hr className="my-5" />

            {!formCondition && (
                <div className="text-center">
                    <button type="button" className="btn btn-primary px-4 py-2" onClick={() => setFormCondition(true)}>
                        + Tạo danh sách mới
                    </button>
                </div>
            )}

            {formCondition && (
                <div className="mt-4 p-4 bg-light rounded-4 shadow-sm" style={{ width: "500px", border: "1px solid #80EE98", marginLeft: "400px" }}>
                    <h4 className="mb-4">Tạo danh sách yêu thích mới</h4>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <input
                                type="text"
                                style={{ width: "465px" }}
                                className="form-control"
                                placeholder="Tên danh sách"
                                onChange={(e) => setWishListName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleAddWishList();
                                    }
                                }}
                            />
                        </div>
                        <div className=" col-md-6 d-flex gap-3" style={{ marginLeft: "270px" }}>
                            <button type="button" className="btn btn-success px-4" onClick={handleAddWishList}>
                                Thêm
                            </button>
                            <button type="button" className="btn btn-danger px-4" onClick={() => setFormCondition(false)}>
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WishListItem;