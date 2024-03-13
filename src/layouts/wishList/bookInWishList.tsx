import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteWishList, getBookInWishList } from "../../api/wishListApi";
import BookModel from "../../models/BookModel";
import BookProp from "./wishListComponent/BookProp";

const BookInWishList: React.FC = () => {
    const { wishListID } = useParams();
    const { wishListName } = useParams();
    const token = localStorage.getItem("tokenLogin");
    const navigate = useNavigate();

    const [listBook, setListBook] = useState<BookModel[] | undefined>([]);
    const [dataload, setDataLoad] = useState(true);
    const [error, seterror] = useState('');
    const [notification, setNotification] = useState('');

    const handleDeleteWishList = () =>{
        if(token != null && wishListID!= undefined){
            const wishListIDNumber = parseInt(wishListID);
            deleteWishList(wishListIDNumber,token).then(
                response =>{
                    if(response?.ok){
                        setNotification('');
                        navigate("/user/wishList");
                    }else{
                        setNotification("Xóa không thành công")
                    }
                }
            )
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

    if(dataload){
        return(
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
                <div className="col-sm-9">
                    <div className="row mt-4">
                        {listBook?.map((book) => (<BookProp key={book.book_id} book={book} wishListID={parseInt((wishListID!=undefined) ? wishListID : "0")} />))}
                    </div>
                </div>
                <div className="col-sm-3">
                    <div className="container box pt-4 mt-2" >
                        <div className="card card-with-text" style={{position:"fixed"}}>
                            <div className="card-body bg-success" style={{borderRadius:"5px"}}>
                                <h3 style={{color:"white", paddingTop:"70px"}}>{wishListName}</h3>
                            </div>
                            <div className="card-body" style={{borderRadius:"5px"}}>
                                <p>Số lượng sách: {listBook?.length}</p>
                                <i className="fa fa-trash fa-2x" aria-hidden="true" style={{color:"red"}} onClick={handleDeleteWishList}></i>
                            </div>
                        </div>
                    </div>
                    <p>{notification}</p>
                </div>
            </div>
        </div>
    );
}

export default BookInWishList;