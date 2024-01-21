import React, { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import ImageModel from "../../../models/ImageModel";
import { getImageByBookId } from "../../../api/imageApi";

interface bookPropInterface {
    book: BookModel;
}

const BookProp: React.FC<bookPropInterface> = ({book} ) => {
    const [images, setImages] = useState<ImageModel[]>([]);
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);

    useEffect(() => {
        const masach: number = book.book_id;
        getImageByBookId(masach).then(
            result=>{
                setImages(result);
                setdataload(false);
            }
        ).catch(
            error=>{
                seterror(error);
                setdataload(false);
            }
        );
    }, [])

    if(dataload){
        return(
            <div>
                <h1>Đang tải dữ liệu</h1>
            </div>
        );
    }
    
    if(error){
        return(
            <div>
                <h1>Gặp lỗi: {error}</h1>
            </div>
        );
    }

    let dulieuanh : string = "";
    if(images[0] && images[0].data){
        dulieuanh = images[0].data;
    }

    return (
        <div className="col-md-3 mt-2">
            <div className="card" style={{blockSize:"700px"}}>
                <img
                    src={"data:image/png;base64,"+dulieuanh}
                    className="card-img-top"
                    alt={book.book_name}
                    style={{ height: '450px'}}
                />
                <div className="card-body">
                    <h5 className="card-title">{book.book_name}</h5>
                    <p className="card-text">{book.description}</p>
                    <div className="price">
                        <span className="original-price" style={{paddingRight:"10px"}}>
                            <del>{book.price}đ</del>
                        </span>

                        <span className="discounted-price">
                            <strong>{book.listed_price}đ</strong>
                        </span>
                    </div>
                    <div className="row mt-2" role="group">
                        <div className="col-6">
                            <a href="#" className="btn btn-secondary btn-block">
                                <i className="fas fa-heart"></i>
                            </a>
                        </div>
                        <div className="col-6">
                            <button className="btn btn-danger btn-block">
                                <i className="fas fa-shopping-cart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default BookProp;