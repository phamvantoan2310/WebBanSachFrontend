import { useNavigate } from "react-router-dom";
import RequireAdminAndStaff from "../../../util/requireAdminAndStaff"
import { useEffect, useState } from "react";
import CategoryModel from "../../../models/CategoryModel";
import { createCategory, deleteCategory, existByCategoryName, getAllCategory } from "../../../api/categoryApi";
import BookModel from "../../../models/BookModel";
import { getBookByCategoryID } from "../../../api/bookApi";
import { error } from "console";
import BookInCategory from "./categoryComponent/bookInCategory";
import { DeleteOutlined } from "@ant-design/icons";

const CategoryAdmin: React.FC = () => {
    const token = localStorage.getItem("tokenLogin");
    const navigate = useNavigate();
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);

    const [categorys, setCategorys] = useState<CategoryModel[] | undefined>([]);
    const [selectedCategory, setSelectedCategory] = useState<CategoryModel>();
    const [books, setBooks] = useState<BookModel[] | undefined>([]);

    const [notification, setNotification] = useState<string>("");
    const [createCategoryCondition, setCreateCategoryCondition] = useState<boolean>();
    const [categoryName, setCategoryName] = useState<string>("");

    useEffect(() => {
        getAllCategory().then(
            result => {
                setCategorys(result);
                setdataload(false);
            }
        ).catch(
            error => {
                seterror(error)
                setdataload(false);
            }
        )
    }, [])


    useEffect(() => {
        if (categorys && categorys.length > 0) {
            setSelectedCategory(categorys[0])
        }
    }, [categorys])


    useEffect(() => {
        if (selectedCategory?.categoryID && token) {
            getBookByCategoryID(token, selectedCategory.categoryID).then(
                result => {
                    setBooks(result);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }, [selectedCategory])


    const handleCreateCategory = async () => {
        if (token && categoryName) {
            if (await existByCategoryName(categoryName)) {
                setNotification("Thể loại đã tồn tại");
            } else {
                createCategory(categoryName, token).then(
                    result => {
                        alert("Thêm thể loại thành công!");
                        navigate(0);
                    }
                ).catch(
                    error => {
                        console.log(error);
                        alert("Thêm thể loại sách thất bại");
                    }
                )
            }
        }
    }

    const handleDeleteCategory = () => {
        const confirmDelete = window.confirm("Xác nhận xóa thể loại");
        if (confirmDelete) {
            if (selectedCategory?.categoryID && token) {
                deleteCategory(selectedCategory.categoryID, token).then(
                    result => {
                        alert("Xóa thể loại thành công!")
                        navigate(0);
                    }
                ).catch(
                    error => {
                        console.log(error);
                        setNotification("Xóa thể loại thất bại");
                    }
                )
            }
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
        <div className="container mt-5 pt-5" style={{ marginLeft: "80px" }}>
            <div className="row">
                <div className="col-md-6">
                    <h1 className="text-start">Quản lý thể loại sách</h1>
                </div>
                <div className="col-md-6">
                    <button className="btn btn-primary mt-5" style={{ marginLeft: "480px" }} onClick={() => setCreateCategoryCondition(true)}>Tạo thể loại sách</button>
                </div>
            </div>

            <hr />
            <div className="row">
                <div className="col-md-3">
                    <div className="list-group overflow-auto" style={{ maxHeight: "520px", maxWidth: "500px" }}>
                        {categorys != undefined && categorys.map((category) => (
                            <a style={{ border: "1px solid #b3e6ff" }}><button className="btn btn-primary list-group-item list-group-item-action" onClick={() => setSelectedCategory(category)}>{category.categoryName}</button></a>
                        ))}
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="d-flex">
                        <h3 className="text-start" style={{ color: " #990033", marginLeft: "100px" }}>{selectedCategory?.categoryName}</h3>
                        <button className="btn btn-danger mb-2" style={{ marginLeft: "20px" }} onClick={handleDeleteCategory}><DeleteOutlined /></button>
                    </div>
                    <div className="row overflow-auto" style={{ maxHeight: "700px", maxWidth: "1000px" }}>
                        {books?.map(book => (<BookInCategory book={book} key={book.book_id} />))}
                    </div>
                </div>
            </div>
            {/* form tạo thể loại */}
            {createCategoryCondition && <div className="container fixed-top p-4 shadow-lg bg-white rounded" style={{ marginTop: "200px", maxWidth: "400px", border: "1px solid green" }}>
                <h3 className="text-start" style={{ marginLeft: "5px", color: "green" }}>Tạo thể loại sách</h3>
                <button className="btn btn-danger position-absolute top-0 end-0 m-3" onClick={() => { setCreateCategoryCondition(false) }}>X</button>
                <div>
                    <div className="row mb-2 mt-4">
                        <input type="text" className="form-control" style={{ border: "1px solid green" }} placeholder="Tên thể loại" onChange={(e) => setCategoryName(e.target.value)} />
                    </div>
                    <button className="btn btn-primary mt-3" onClick={handleCreateCategory}>Thêm</button>
                    <div style={{ color: "red" }}>{notification}</div>
                </div>
            </div>}
        </div>
    )
}

const Category = RequireAdminAndStaff(CategoryAdmin);
export default Category;