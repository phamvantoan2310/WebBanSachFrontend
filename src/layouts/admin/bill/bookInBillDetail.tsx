import { useEffect, useState } from "react";
import BillItemModel from "../../../models/BillItemModel";
import BookModel from "../../../models/BookModel";
import { getBookByBillItemID } from "../../../api/bookApi";
import { Link } from "react-router-dom";
import ImageModel from "../../../models/ImageModel";
import { getImagesByBookId } from "../../../api/imageApi";
import Format from "../../../util/ToLocaleString";

interface BookInBillDetailProps {
    billItem: BillItemModel;
}

const BookInBillDetail: React.FC<BookInBillDetailProps> = ({ billItem }) => {
    const token = localStorage.getItem("tokenLogin");

    const [book, setBook] = useState<BookModel | null>();
    const [images, setImages] = useState<ImageModel[]>([]);
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);

    console.log(billItem.billItemID)

    useEffect(() => {
        if (token) {
            getBookByBillItemID(billItem.billItemID, token).then(
                result => {
                    setBook(result);
                    setdataload(false);
                }
            ).catch(
                error => {
                    seterror(error);
                }
            )
        }
    }, []);

    useEffect(() => {
        if (book != null) {
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
        }
    }, [book])

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
        <div className="row mt-3 mb-3" >
            <div className="col-md-4">
                <Link to={`/staff/changebookinformation/${book?.book_id}`}>
                    <img
                        src={"data:image/png;base64," + dulieuanh}
                        className="card-img-top"
                        alt={book?.book_name}
                        style={{ height: '150px', width: '100px' }}
                    />
                </Link>
            </div>
            <div className="col-md-4 mt-2">
                <Link to={`/staff/changebookinformation/${book?.book_id}`} style={{ textDecoration: 'none' }}>
                    <h5 className="text-start">{book?.book_name}</h5>
                </Link>
                <p className="text-start mt-4" style={{ color: "red" }}>Giá đang bán: {Format(book?.price)} đ</p>
                <h6 className="text-start">Số lượng trong kho: {book?.number_of_book}</h6>
            </div>
            <div className="col-md-4 pt-5 mt-2">
                <p className="text-start" style={{ color: "red" }}>Giá nhập: {Format(billItem.price)} đ</p>
                <h6 className="text-start">Số lượng nhập: {billItem.numberOfBillItem}</h6>
            </div>
        </div>
    )
}
export default BookInBillDetail;