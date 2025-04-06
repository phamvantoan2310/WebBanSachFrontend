import { Link, NavLink, useNavigate } from "react-router-dom";
import BookModel from "../../../../models/BookModel";
import { useEffect, useState } from "react";
import ImageModel from "../../../../models/ImageModel";
import { getImagesByBookId } from "../../../../api/imageApi";
import Format from "../../../../util/ToLocaleString";
import RenderRating from "../../../../util/RenderRating";

interface bookPropInterface {
    book: BookModel;
}

const BookInCategory: React.FC<bookPropInterface> = ({ book }) => {
    const [images, setImages] = useState<ImageModel[]>([]);

    useEffect(() => {
        const masach: number = book.book_id;
        getImagesByBookId(masach).then(
            result => {
                setImages(result);
            }
        ).catch(
            error => {
                console.log(error);
            }
        );
    }, [])

    let dulieuanh: string = "";
    if (images[0] && images[0].data) {
        dulieuanh = images[0].data;
    }

    return (
        <div className=" col-md-2 mt-4" style={{ height: "370px", width: "300px" }}>
            <div style={{ marginLeft: "100px" }}>
                <Link to={`/staff/changebookinformation/${book.book_id}`}>
                    <img
                        src={"data:image/png;base64," + dulieuanh}
                        className="card-img-top"
                        alt={book.book_name}
                        style={{ height: '300px', width: "200px" }}
                    />
                </Link>
            </div>
            <div style={{ marginLeft: "100px" }}>
                <Link to={`/staff/changebookinformation/${book.book_id}`} style={{ textDecoration: 'none' }}>
                    <div className="text-start mt-3" style={{ height: "50px" }}>
                        <h5>{book.book_name}</h5>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default BookInCategory;