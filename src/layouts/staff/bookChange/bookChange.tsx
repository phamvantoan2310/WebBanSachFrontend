import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import BookModel from "../../../models/BookModel";
import { bookChange, getABook } from "../../../api/bookApi";
import ImageModel from "../../../models/ImageModel";
import { addBookImage, deleteBookImage, getImagesByBookId } from "../../../api/imageApi";
import GetBase64 from "../../../util/getBase64";
import Format from "../../../util/ToLocaleString";
import AuthorModel from "../../../models/AuthorModel";
import { getAuthor, getAuthorByContainingAuthorName } from "../../../api/authorApi";
import RequireStaff from "../../../util/requireStaff";
import RequireAdminAndStaff from "../../../util/requireAdminAndStaff";
import CategoryModel from "../../../models/CategoryModel";
import { getAllCategory, getCategoryByBookID } from "../../../api/categoryApi";
const BookChangeStaffAndAdmin: React.FC = () => {
    const token = localStorage.getItem("tokenLogin")
    const navigate = useNavigate();
    const { bookID } = useParams();
    let bookIDOk = 0;                         //lấy book id
    try {
        if (bookID) {
            bookIDOk = parseInt(bookID);
            if (isNaN(bookIDOk)) {
                bookIDOk = 0;
            }
        }
    } catch (error) {
        console.log(error);
        bookIDOk = 0;
    }

    const [book, setBook] = useState<BookModel | null>();                             //lấy book, author, image
    const [images, setImages] = useState<ImageModel[]>([]);
    const [author, setAuthor] = useState<AuthorModel | null>(null);
    const [selectedImage, setSelectedImage] = useState<ImageModel | null>(null);
    const [allCategorys, setAllCategorys] = useState<CategoryModel[] | undefined>([]);
    const [categorys, setCategorys] = useState<CategoryModel[] | null>();
    const [dataload, setDataload] = useState<boolean>(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getAllCategory().then(
            result => {
                setAllCategorys(result);
            }
        ).catch(
            error => {
                console.log(error);
            }
        )
    }, [])

    useEffect(() => {
        getCategoryByBookID(bookIDOk).then(
            result => {
                setCategorys(result);
            }
        ).catch(
            error => {
                console.log(error);
            }
        )
    }, [])



    useEffect(() => {
        if (token) {
            getABook(bookIDOk).then(
                result => {
                    setBook(result);
                    setDataload(false);
                }
            ).catch(
                error => {
                    setError(error);
                    setDataload(false);
                }
            )
        }
    }, [bookIDOk])

    useEffect(() => {
        if (bookIDOk) {
            getAuthor(bookIDOk).then(
                result => {
                    setAuthor(result);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }, [bookIDOk])

    useEffect(() => {
        getImagesByBookId(bookIDOk).then(
            result => {
                setImages(result);
            }
        ).catch(
            error => {
                console.log(error);
            }
        );
    }, [bookIDOk])

    useEffect(() => {
        if (images.length > 0) {
            setSelectedImage(images[0]);
        }
    }, [images])

    const chooseImage = (image: ImageModel) => {
        setSelectedImage(image);
    }

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {     //thêm ảnh
        if (e.target.files && token && book) {
            addBookImage(e.target.files[0], book, token).then(
                result => {
                    alert("Thêm ảnh thành công");
                    navigate(0);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }

    const handleDeleteImage = () => {                                  //xóa ảnh
        if (token && selectedImage) {
            deleteBookImage(selectedImage.image_id, token).then(
                result => {
                    alert("Xóa ảnh thành công");
                    setImages(preImage => preImage.filter(image => image !== selectedImage));
                    navigate(0);
                }
            ).catch(
                error => {
                    console.log(error);
                    alert("Quá trình xóa ảnh lỗi");
                }
            )
        }
    }

    const [bookNameCondition, setBookNameCondition] = useState<boolean>(false);         //điều kiện hiện input
    const [authorCondition, setAuthorCondition] = useState<boolean>(false);
    const [listedPriceCondition, setListedPriceCondition] = useState<boolean>(false);
    const [priceCondition, setPriceCondition] = useState<boolean>(false);
    const [decriptionCondition, setDecriptionCondition] = useState<boolean>(false);
    const [categoryCondition, setCategoryCondition] = useState<boolean>(false);
    const [contentCondition, setContentCondition] = useState<boolean>(false);

    const [authors, setAuthors] = useState<AuthorModel[]>([])

    const [bookName, setBookName] = useState("");                         //data cần thay đổi
    const [listedPrice, setListedPrice] = useState("0");
    const [price, setPrice] = useState("0");
    const [decription, setDecription] = useState("");
    const [content, setContent] = useState("");
    const [authorID, setAuthorID] = useState(0);
    const [categoryID, setCategoryID] = useState(0);


    const handelAuthorNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {        //thao tác tìm tác giả theo tên và chọn tác giả để set và authorID
        if (token && e.target.value != null) {
            getAuthorByContainingAuthorName(e.target.value, token).then(
                result => {
                    if (result) {
                        setAuthors(result);
                    }
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        } else {
            setAuthors([]);
        }
    }

    const handleAuthorChange = () => {
        if (document.getElementById("authorID") as HTMLSelectElement | null) {
            const author = document.getElementById("authorID") as HTMLSelectElement | null;
            if (author) {
                setAuthorID(parseInt(author.value));
            }
        }
    }

    useEffect(() => {   //điều kiện chọn tác giả khi chỉ có duy nhất 1 tác giả được tìm ra, không có sự thay đổi ở select
        if (authors.length > 0) {
            setAuthorID(authors[0].author_id);
        }
    }, [authors])


    const handleCategoryChange = () => {
        if (document.getElementById("categoryID") as HTMLSelectElement | null) {
            const category = document.getElementById("categoryID") as HTMLSelectElement | null;
            if (category) {
                setCategoryID(parseInt(category.value));
            }
        }
    }

    const handleSubmit = () => {                       //lưu thay đổi
        if (token && book && book.point && book.number_of_book) {
            const listedprice = parseInt(listedPrice);
            const Price = parseInt(price);

            bookChange(book.book_id, bookName, book.number_of_book, isNaN(listedprice) ? 0 : listedprice, isNaN(Price) ? 0 : Price, decription, book.point, authorID, categoryID, token, content).then(
                result => {
                    alert("Lưu thay đổi thành công");
                    navigate(0);
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
    }
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
        <div className="container mt-5 pt-5">
            <h1 className="text-start">Sách</h1>
            <hr />
            <div className="row">  {/*image */}
                <div>
                    {(selectedImage) && <img src={"data:image/png;base64," + selectedImage.data} style={{ height: "500px", marginBottom: "10px", width: '300px' }} />}
                </div>
                <button className="btn btn-danger w-25 row mt-3" style={{ marginLeft: "500px" }} onClick={handleDeleteImage}>Chọn ảnh và click xóa</button>
                <input
                    type="file"
                    id="avatar"
                    className="form-control btn btn-success w-25 row mt-1"
                    style={{ marginLeft: "500px" }}
                    accept="images/*"
                    onChange={handleAvatarChange}
                />
                <div className="row mt-2" style={{ marginLeft: "325px" }}>
                    {
                        images.map((hinhAnh, index) => (
                            <div className={"col-1"} key={index}>
                                <img onClick={() => chooseImage(hinhAnh)} src={"data:image/png;base64," + hinhAnh.data} style={{ width: '50px' }} />
                            </div>
                        ))
                    }
                </div>
            </div>
            <hr />
            <div className="mt-5" style={{ border: "1px solid green", width: "450px", borderRadius: "5px", margin: "20px", padding: "20px", marginLeft: "425px" }}>  {/*book id */}
                <h3 className="text-start mb-3" style={{ color: " #800000" }}>Mã sách: {book?.book_id}</h3>


                {/*book name */}
                <div className="row mb-2">
                    <div className="col-md-10">
                        <h5 className="text-start ">Tên sách:   {book?.book_name}</h5>
                    </div>
                    <div className="col-md-2 text-start">
                        <i className="fa fa-edit" style={{ color: "red" }} aria-hidden="true" onClick={() => setBookNameCondition(bookNameCondition ? false : true)}></i>
                    </div>
                </div>
                {bookNameCondition && <input style={{ width: "400px", border: "1px solid #1B03A3" }} className="form-control mb-3" placeholder="Tên sách muốn thay đổi" onChange={(e) => setBookName(e.target.value)} value={bookName}></input>}

                {/*book author */}
                <div className="row mb-2">
                    <div className="col-md-10">
                        <h5 className="text-start mb-2">Tác giả:   {author?.author_name}</h5>
                    </div>
                    <div className="col-md-2 text-start" >
                        <i className="fa fa-edit" style={{ color: "red" }} aria-hidden="true" onClick={() => setAuthorCondition(authorCondition ? false : true)}></i>
                    </div>
                </div>
                {authorCondition && (
                    <input style={{ width: "400px", border: "1px solid #1B03A3" }} className="form-control mb-3" placeholder="Tác giả muốn thay đổi" onChange={handelAuthorNameChange}></input>)
                }
                {authorCondition && authors?.length != 0 && <select className="form-select mb-3" id="authorID" aria-label="Default select example" onChange={handleAuthorChange} style={{ width: "400px" }}>
                    {authors?.map(author => (<option value={`${author.author_id}`}>{author.author_name}</option>))}
                </select>}

                {/*book category */}
                <div className="row mb-2">
                    <div className="col-md-10">
                        {categorys && <h5 className="text-start mb-2">Thể loại: {categorys.length > 0 ? categorys[0]?.categoryName : "Chưa cập nhật!"}</h5>}
                    </div>
                    <div className="col-md-2 text-start" >
                        <i className="fa fa-edit" style={{ color: "red" }} aria-hidden="true" onClick={() => setCategoryCondition(categoryCondition ? false : true)}></i>
                    </div>
                </div>
                {categoryCondition && allCategorys?.length != 0 && <select className="form-select mb-3" id="categoryID" aria-label="Default select example" onChange={handleCategoryChange} style={{ width: "400px", border: "1px solid #1B03A3" }}>
                    {allCategorys?.map(category => (<option value={`${category.categoryID}`}>{category?.categoryName}</option>))}
                </select>}

                {/*listed price */}
                <div className="row mb-2">
                    <div className="col-md-10">
                        <h5 className="text-start mb-2">Giá niêm yết:   {Format(book?.listed_price)} đ</h5>
                    </div>
                    <div className="col-md-2 text-start">
                        <i className="fa fa-edit" style={{ color: "red" }} aria-hidden="true" onClick={() => setListedPriceCondition(listedPriceCondition ? false : true)}></i>
                    </div>
                </div>
                {listedPriceCondition && <input className="form-control mb-3" style={{ width: "400px", border: "1px solid #1B03A3" }} type="number" placeholder="Giá niêm yết muốn thay đổi" onChange={(e) => setListedPrice(e.target.value)} value={listedPrice}></input>}


                {/*price */}
                <div className="row mb-2">
                    <div className="col-md-10">
                        <h5 className="text-start mb-2">Giá đã giảm:   {Format(book?.price)} đ</h5>
                    </div>
                    <div className="col-md-2 text-start" >
                        <i className="fa fa-edit" style={{ color: "red" }} aria-hidden="true" onClick={() => setPriceCondition(priceCondition ? false : true)}></i>
                    </div>
                </div>
                {priceCondition && <input style={{ width: "400px", border: "1px solid #1B03A3" }} className="form-control mb-3" type="number" placeholder="Giá bán muốn thay đổi" onChange={(e) => setPrice(e.target.value)} value={price}></input>}


                {/*decription */}
                <div className="row mb-2">
                    <div className="col-md-10">
                        <h5 className="text-start mb-2">Mô tả</h5>
                    </div>
                    <div className="col-md-2 text-start">
                        <i className="fa fa-edit" style={{ color: "red" }} aria-hidden="true" onClick={() => setDecriptionCondition(decriptionCondition ? false : true)}></i>
                    </div>
                </div>
                {decriptionCondition && <input style={{ width: "400px", border: "1px solid #1B03A3" }} className="form-control mb-3" placeholder="Mô tả sách muốn thay đổi" onChange={(e) => setDecription(e.target.value)} value={decription}></input>}


                {/*content */}
                <div className="row mb-2">
                    <div className="col-md-10">
                        <h5 className="text-start mb-2">Nội dung</h5>
                    </div>
                    <div className="col-md-2 text-start">
                        <i className="fa fa-edit" style={{ color: "red" }} aria-hidden="true" onClick={() => setContentCondition(contentCondition ? false : true)}></i>
                    </div>
                </div>
                {contentCondition && <input style={{ width: "400px", border: "1px solid #1B03A3" }} className="form-control mb-3" placeholder="Nội dung sách muốn thay đổi" onChange={(e) => setContent(e.target.value)} value={content}></input>}
            </div>
            <div className="mt-2">
                <button className="btn btn-success" onClick={handleSubmit}>Lưu thay đổi</button>
            </div>
        </div>
    );
}

const BookChange = RequireAdminAndStaff(BookChangeStaffAndAdmin);
export default BookChange; 