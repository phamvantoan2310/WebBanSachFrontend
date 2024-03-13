import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import WishList from "../../models/WishList";
import { jwtDecode } from "jwt-decode";
import { addWishList, getWishList } from "../../api/wishListApi";

const WishListItem: React.FC = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>('');
    const [wishLists, setWishList] = useState<WishList[]>([]);
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState<any>(null);
    const [formCondition, setFormCondition] = useState(false);

    const getRandomColor = () => {
        const colors = ["#FF5733", "#33FF57", "#5733FF", "#FFFF33", "#33FFFF"];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };

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
            if (localStorage.getItem('tokenLogin') == null) {
                navigate("/user/login");
                return;
            }
            if (localStorage.getItem('tokenLogin') != null) {
                setToken(localStorage.getItem('tokenLogin'));
            }
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
        <div className="container pt-5 mt-5 pb-5">
            <div className="row">
                {wishLists.map((wishlist) => (
                    <div key={wishlist.wishList_id} className="col-md-4 mb-3">
                        <Link to={`/user/wishList/${wishlist.wishList_id}/${wishlist.wishList_name}`} style={{ textDecoration: 'none' }}>
                            <div className="card" style={{ backgroundColor: getRandomColor() }}>
                                <div className="card-body">
                                    <h5 className="card-title">{wishlist.wishList_name}</h5>
                                    {/* Add additional content or buttons as needed */}
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            <hr />
            {!formCondition && <button type="button" className="btn btn-success" onClick={() => { setFormCondition(true) }}>Tạo danh sách mới</button>}

            {formCondition && (<div className="container alert alert-light" >
                <div className="row">
                    <div className="col-md-4 mb-3 mt-3">
                        <div className="form-group">
                            <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Tên" onChange={(e) => setWishListName(e.target.value)} />
                        </div>
                    </div>
                    <div className="col-md-4 mb-3 mt-3">
                        <div className="form-group">
                            <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Mô tả" onChange={(e) => setDecription(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8 mb-5 mt-3">
                        <button type="button" className="btn btn-success" onClick={handleAddWishList}>Thêm</button>
                    </div>
                    <div className="mt-5">
                        <button type="button" className="btn btn-danger" onClick={() => { setFormCondition(false) }}>Đóng</button>
                    </div>
                </div>
            </div>)}
        </div>
    );
}

export default WishListItem;