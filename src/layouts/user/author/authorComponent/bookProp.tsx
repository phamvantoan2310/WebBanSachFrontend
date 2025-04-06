import { useEffect, useState } from "react";
import BookModel from "../../../../models/BookModel";
import ImageModel from "../../../../models/ImageModel";
import { getImagesByBookId } from "../../../../api/imageApi";
import { Link } from "react-router-dom";
import Format from "../../../../util/ToLocaleString";
import RenderRating from "../../../../util/RenderRating";
import WishList from "../../../../models/WishList";
import { getWishList } from "../../../../api/wishListApi";
import { Button, Modal, Space, Typography } from "antd";

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
                method: 'PUT',
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

    let dulieuanh: string = "";
    if (images[0] && images[0].data) {
        dulieuanh = images[0].data;
    }

    return (
        <div className="col-md-4 mt-2">
            <div className="card" style={{ blockSize: "700px", height: "680px" }}>
                <Link to={`/book/${book.book_id}`}>
                    <img
                        src={"data:image/png;base64," + dulieuanh}
                        className="card-img-top"
                        alt={book.book_name}
                        style={{ height: '450px' }}
                    />
                </Link>
                {wishListCondition && (     // WishList
                    <Modal
                        title={<Typography.Title level={3} style={{ color: '#1890ff' }}>Chọn danh sách yêu thích</Typography.Title>}
                        open={wishListCondition}
                        onCancel={() => setWishListCondition(false)}
                        footer={null}
                        centered
                    >
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {wishLists.map((wishlist) => (
                                <Button
                                    key={wishlist.wishList_id}
                                    type="primary"
                                    block
                                    onClick={() => handleAddBookToWishList(wishlist.wishList_id)}
                                >
                                    {wishlist.wishList_name}
                                </Button>
                            ))}
                        </Space>
                    </Modal>)}
                <div className="card-body">
                    <Link to={`/book/${book.book_id}`} style={{ textDecoration: 'none' }}>
                        <h5 className="card-title">{book.book_name}</h5>
                    </Link>
                    <div className="price mb-3">
                        <span className="original-price" style={{ paddingRight: "10px" }}>
                            <del>{Format(book.listed_price)} đ</del>
                        </span>

                        <span className="discounted-price">
                            <strong>{Format(book.price)} đ</strong>
                        </span>
                    </div>
                    <div className="row mt-2" role="group">
                        <div className="col-6">
                            <button className="btn btn-secondary btn-block" title="Danh sách yêu thích!" onClick={() => { handleGetWishList(); setWishListCondition(true) }}>
                                <i className="fa fa-heart"></i>
                            </button>
                        </div>
                        <div className="col-6">
                            <button className="btn btn-danger btn-block" title="Giỏ hàng">
                                <Link to={`/book/${book.book_id}`} style={{ color: "white" }}>
                                    <i className="fas fa-shopping-cart"></i>
                                </Link>
                            </button>
                        </div>
                        <h5 className="card-title mt-5 text-end">{RenderRating(book.point ? book.point : 0)}</h5>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default BookProp;