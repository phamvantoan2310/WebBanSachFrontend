import React, { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import ImageModel from "../../../models/ImageModel";
import { getImagesByBookId } from "../../../api/imageApi";
import { get3Book } from "../../../api/bookApi";
import { Link, NavLink } from "react-router-dom";


const Carousel: React.FC = () => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);
    const [image1, setImage1] = useState<ImageModel[]>([]);
    const [image2, setImage2] = useState<ImageModel[]>([]);
    const [image3, setImage3] = useState<ImageModel[]>([]);

    useEffect(() => {  //lấy toàn bộ sách
        get3Book().then(
            result => {
                setBooks(result.result);
                setdataload(false);
            }
        ).catch(
            error => {
                seterror(error);
                setdataload(false);
            }
        );
    }, [])
    const book1: BookModel = books[0]  //lấy 3 cuốn sách đầu tiên
    const book2: BookModel = books[1]
    const book3: BookModel = books[2]

    let book1ID: number = (book1 && book1.book_id) ? book1.book_id : 0
    let book2ID: number = (book2 && book2.book_id) ? book2.book_id : 0
    let book3ID: number = (book3 && book3.book_id) ? book3.book_id : 0


    useEffect(() => {       //lấy ảnh của 3 cuốn sách đầu qua id
        getImagesByBookId(book1ID).then(result => {
            setImage1(result);
            setdataload(false);
        }).catch(error => {
            setdataload(false);
        });
    }, [book1ID])

    useEffect(() => {
        getImagesByBookId(book2ID).then(result => {
            setImage2(result);
            setdataload(false);
        }).catch(error => {
            setdataload(false);
        });
    }, [book2ID])

    useEffect(() => {
        getImagesByBookId(book3ID).then(result => {
            setImage3(result);
            setdataload(false);
        }).catch(error => {
            setdataload(false);
        });
    }, [book3ID])

    let dulieuanh1: string = (image1[0] && image1[0].data) ? image1[0].data : "dataimage1";
    let dulieuanh2: string = (image2[0] && image2[0].data) ? image2[0].data : "dataimage2";
    let dulieuanh3: string = (image3[0] && image3[0].data) ? image3[0].data : "dataimage3";


    let book_name1: string = (book1 && book1.book_name) ? book1.book_name : "1";
    let book_name2: string = (book2 && book2.book_name) ? book2.book_name : "2";
    let book_name3: string = (book3 && book3.book_name) ? book3.book_name : "3";


    let description1: string = (book1 && book1.description) ? book1.description : "decription1";
    let description2: string = (book2 && book2.description) ? book2.description : "decription2";
    let description3: string = (book3 && book3.description) ? book3.description : "decription3";

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
        <div id="carouselExampleCaptions" className="carousel slide carousel-dark">
            <div className="carousel-inner" style={{ backgroundColor: " #ddddee", height: "300px" }}>
                <div className="text-start" style={{ color: " #8000ff", marginLeft: "100px" }}>
                    <h3 style={{font: "icon", fontSize:"25px"}}>SÁCH MỚI HÔM NAY</h3>
                </div>
                <div className="carousel-item active" data-bs-interval="10000">
                    <div className="row align-items-center">
                        <div className="col-5 text-center">
                            <img src={"data:image/png;base64," + dulieuanh1} className="float-end" style={{ width: '150px', height: '220px' }} />
                        </div>
                        <div className="col-7">
                            <Link to={`/book/${book1ID}`} style={{ textDecoration: 'none' }}>
                                <h5>{book_name1}</h5>
                            </Link>
                            <p>{description1.substring(0, 50)}...</p>
                        </div>
                    </div>
                </div>
                <div className="carousel-item" data-bs-interval="10000">
                    <div className="row align-items-center">
                        <div className="col-5 text-center">
                            <img src={"data:image/png;base64," + dulieuanh2} className="float-end" style={{ width: '150px', height: '220px' }} />
                        </div>
                        <div className="col-7">
                            <Link to={`/book/${book2ID}`} style={{ textDecoration: 'none' }}>
                                <h5>{book_name2}</h5>
                            </Link>
                            <p>{description2.substring(0, 50)}...</p>
                        </div>
                    </div>
                </div>
                <div className="carousel-item" data-bs-interval="10000">
                    <div className="row align-items-center">
                        <div className="col-5 text-center">
                            <img src={"data:image/png;base64," + dulieuanh3} className="float-end" style={{ width: '150px', height: '220px' }} />
                        </div>
                        <div className="col-7">
                            <Link to={`/book/${book3ID}`} style={{ textDecoration: 'none' }}>
                                <h5>{book_name3}</h5>
                            </Link>
                            <p>{description3.substring(0, 50)}...</p>
                        </div>
                    </div>
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
}
export default Carousel;