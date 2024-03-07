import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WishList from "../../models/WishList";
import { jwtDecode } from "jwt-decode";
import { getWishList } from "../../api/wishListApi";

const WishListItem: React.FC = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>('');
    const [wishLists, setWishList] = useState<WishList[]>([]);
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState<any>(null);

    useEffect(() => {
        try {
            if (localStorage.getItem('tokenLogin') == null) {
                navigate("/user/login")
            }
            if (localStorage.getItem('tokenLogin') != null) {
                setToken(localStorage.getItem('tokenLogin'));
            }
            console.log(token);
            getWishList(token != null ? token : '').then(
                result => {
                    console.log(result);
                    setWishList(result);
                    setdataload(false);
                }
            )
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
        <div className="container">
            <div className="mb-3 col-md-6 col-12 mx-auto">
                <div className="mb-3">
                    {wishLists.map(wishlist => (<button type="button" className="btn btn-success" key={wishlist.wishList_id}>{wishlist.wishList_name}</button>))}
                </div>
            </div>
            <div className="mb-3 col-md-6 col-12 mx-auto">

            </div>
        </div>
    );
}

export default WishListItem;