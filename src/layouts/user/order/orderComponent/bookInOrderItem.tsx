import React, { useEffect, useState } from "react";
import OrderItemModel from "../../../../models/OrderItemModel";
import { Link, useNavigate } from "react-router-dom";
import BookModel from "../../../../models/BookModel";
import { getBookByOrderItemID } from "../../../../api/bookApi";
import Format from "../../../../util/ToLocaleString";
interface BookInOrderItemInterface {
    orderItem: OrderItemModel;
}
const BookInOrderItem: React.FC<BookInOrderItemInterface> = (props) => {
    const token = localStorage.getItem("tokenLogin");
    const navigate = useNavigate();
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);
    const [book, setBook] = useState<BookModel | null>(null);


    useEffect(() => {
        if (token != null) {
            getBookByOrderItemID(props.orderItem.orderItemID, token).then(
                result => {
                    setBook(result);
                    setdataload(false);
                }
            ).catch(
                error => {
                    seterror(error);
                    setdataload(false);
                }
            )
        } else {
            navigate("/user/login");
            return;
        }
    }, [props.orderItem])

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
        <div className="container" style={{ marginLeft: "30px" }}>
            <Link to={`/book/${book?.book_id}`} style={{ textDecoration: 'none' }}>
                <h5 className="text-start" >{book?.book_name}</h5>
            </Link>
        </div>
    );
}

export default BookInOrderItem;