import { useEffect, useState } from "react";
import AuthorModel from "../../../models/AuthorModel";
import { AuthorSearch, createAuthor, deleteAuthor, getAllAuthor, updateAuthor } from "../../../api/authorApi";
import { Link, useNavigate } from "react-router-dom";
import RequireAdminAndStaff from "../../../util/requireAdminAndStaff";

const AuthorAdmin: React.FC = () => {
    const token = localStorage.getItem("tokenLogin");
    const navigate = useNavigate();
    const [authors, setAuthors] = useState<AuthorModel[] | undefined>([]);
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);

    const [createAuthorCondition, setCreateAuthorCondition] = useState<boolean>(false);

    const [authorName, setAuthorName] = useState<string>("");
    const [birthday, setBirthday] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [updateAuthorCondition, setUpdateAuthorCondition] = useState<boolean>(false);
    const [authorSelected, setAuthorSelected] = useState<AuthorModel>();
    const [authorNameUpdate, settAuthorNameUpdate] = useState<string>("");
    const [birthdayUpdate, setBirthdayUpdate] = useState<string>("");
    const [descriptionUpdate, setDescriptionUpdate] = useState<string>("");

    const [authorNameWantToFind, setAuthorNameWantToFind] = useState<string>("");

    useEffect(() => {
        getAllAuthor().then(
            result => {
                setAuthors(result);
                setdataload(false);
            }
        ).catch(
            error => {
                seterror(error);
                setdataload(false);
            }
        )
    }, []);

    const handleCreateAuthor = () => {
        if (authorName && birthday && description && token) {
            createAuthor(authorName, birthday, description, token).then(
                result => {
                    alert("Thêm tác giả thành công");
                    navigate(0);
                }
            ).catch(
                error => {
                    alert(error);
                }
            )
        }
    }

    const handleDeleteAuthor = (author_id: number) => {
        const confirmDelete = window.confirm("Xác nhận xóa tác giả?");
        if (confirmDelete) {
            if (token) {
                deleteAuthor(author_id, token).then(
                    result => {
                        alert("Xóa tác giả thành công!")
                        navigate(0);
                    }
                ).catch(
                    error => {
                        alert(error);
                        console.log(error);
                    }
                )
            }
        }
    }

    const handleUpdateAuthor = () => {
        if (authorNameUpdate || birthdayUpdate || descriptionUpdate) {
            if (token && authorSelected) {
                updateAuthor(authorSelected?.author_id, authorNameUpdate, birthdayUpdate, descriptionUpdate, token).then(
                    result => {
                        alert("Cập nhật tác giả thành công!");
                        navigate(0);
                    }
                ).catch(
                    error => {
                        console.log(error);
                        alert(error);
                    }
                )
            }
        }
    }

    const handleSearchAuthor = () => {
        if (token && authorNameWantToFind) {
            AuthorSearch(token, authorNameWantToFind).then(
                result => {
                    if (result?.length == 0) {
                        alert("không tìm thấy tác giả");
                    } else {
                        setAuthors(result);
                    }
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }

        if (authorNameWantToFind == "") {
            getAllAuthor().then(
                result => {
                    setAuthors(result);
                }
            ).catch(
                error => {
                    seterror(error);
                }
            )
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
            <h1 className="text-start">Quản lý tác giả</h1>
            <div className="row mt-5 pt-5">
                <div className="col-md-6 d-flex">
                    <input className="form-control me-2" type="search" placeholder="Tìm kiếm tác giả" aria-label="Search" style={{ width: "500px", marginLeft: "35px" }} onChange={(e) => setAuthorNameWantToFind(e.target.value)} value={authorNameWantToFind}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearchAuthor();
                            }
                        }}
                    />
                    <button className="btn btn-outline-success" type="button" onClick={handleSearchAuthor}>Tìm kiếm</button>
                </div>
                <div className="col-md-6">
                    <button className="btn btn-primary" style={{ marginLeft: "500px" }} onClick={() => setCreateAuthorCondition(true)}>Thêm tác giả</button>
                </div>
            </div>
            <hr />
            {createAuthorCondition && <div className="container fixed-top" style={{ marginTop: "120px" }}>
                <div className="container mt-5" style={{ marginLeft: "185px" }}>
                    <div style={{ backgroundColor: " #e3e0eb", border: "1px solid violet", height: "500px", width: "900px", borderRadius: "20px" }}>
                        <button className="btn" style={{ marginLeft: "855px", fontSize: "20px" }} onClick={() => setCreateAuthorCondition(false)}>X</button>
                        <h3 style={{ color: "blueviolet" }}>Thêm tác giả</h3>
                        <div className="container row">
                            <div className="col-md-6">
                                <h6 className="text-start mt-5">Tên tác giả</h6>
                                <input className="form-control" type="text" placeholder="Nhập tên tác giả" value={authorName} onChange={(e) => setAuthorName(e.target.value)}></input>
                            </div>
                            <div className="col-md-6">
                                <h6 className="text-start mt-5">Ngày sinh</h6>
                                <input className="form-control" type="date" value={birthday} onChange={(e) => {
                                    const date = new Date(e.target.value);
                                    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                                    setBirthday(formattedDate);
                                }}></input>
                            </div>
                            <div>
                                <h6 className="text-start mt-5">Mô tả</h6>
                                <input className="form-control" type="text" placeholder="Nhập mô tả" value={description} onChange={(e) => setDescription(e.target.value)}></input>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="btn btn-success" type="submit" style={{ marginTop: "-150px" }} onClick={handleCreateAuthor}>Thêm tác giả</button>
            </div>}
            {updateAuthorCondition && <div className="container fixed-top" style={{ marginTop: "120px" }}>
                <div className="container mt-5" style={{ marginLeft: "185px" }}>
                    <div style={{ backgroundColor: " #e3e0eb", border: "1px solid violet", height: "500px", width: "900px", borderRadius: "20px" }}>
                        <button className="btn" style={{ marginLeft: "855px", fontSize: "20px" }} onClick={() => setUpdateAuthorCondition(false)}>X</button>
                        <h3 style={{ color: "blueviolet", marginLeft: "15px" }} className="text-start">Mã tác giả: {authorSelected?.author_id}</h3>
                        <div className="container row">
                            <div className="col-md-6">
                                <h6 className="text-start mt-5">{authorSelected?.author_name}</h6>
                                <input className="form-control" type="text" placeholder="Nhập tên tác giả" value={authorNameUpdate} onChange={(e) => settAuthorNameUpdate(e.target.value)}></input>
                            </div>
                            <div className="col-md-6">
                                <h6 className="text-start mt-5">{authorSelected?.birthday + ""}</h6>
                                <input className="form-control" type="date" value={birthdayUpdate} onChange={(e) => {
                                    const date = new Date(e.target.value);
                                    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                                    setBirthdayUpdate(formattedDate);
                                }}></input>
                            </div>
                            <div>
                                <h6 className="text-start mt-5">Mô tả</h6>
                                <input className="form-control" type="text" placeholder="Nhập mô tả" value={descriptionUpdate} onChange={(e) => setDescriptionUpdate(e.target.value)}></input>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="btn btn-success" type="submit" style={{ marginTop: "-150px" }} onClick={handleUpdateAuthor}>Cập nhật</button>
            </div>}
            <div className="container row overflow-auto" style={{ height: "600px" }}>
                {authors?.map(author => (
                    <div className="col-md-6" style={{ height: "200px" }}>
                        <div className="container mt-5 row" style={{ backgroundColor: "lightgray", border: "1px solid #44D62C", borderRadius: "10px", width: "600px", marginRight: "25px", marginLeft: "25px" }}>
                            <div className="text-end">
                                <i className="fa fa-edit" style={{ color: "red", marginRight: "-20px" }} aria-hidden="true" onClick={() => (setUpdateAuthorCondition(true), setAuthorSelected(author))}></i>
                            </div>
                            <div className="col-md-6">
                                <h5 className="text-start mb-5" style={{ color: "gray" }}>{author.author_name}</h5>
                                <h6 className="text-start d-flex">Mã tác giả:
                                    <p style={{ color: "blueviolet", marginLeft: "10px" }}>{author.author_id}</p>
                                </h6>
                                <h6 className="text-start d-flex mt-2">📅 Ngày sinh:
                                    <p style={{ color: "blueviolet", marginLeft: "10px" }}>{author.birthday + ""}</p>
                                </h6>
                            </div>

                            <div className="col-md-6">
                                <h5 className="text-start mt-1">📖 Mô tả:</h5>
                                <textarea
                                    className="form-control"
                                    value={author.decription}
                                    readOnly
                                    style={{ backgroundColor: "white", color: "blueviolet", resize: "none", height: "100px" }}
                                ></textarea>
                            </div>

                            <div className="text-end mb-3">
                                <button className="btn btn-danger w-25" onClick={() => handleDeleteAuthor(author.author_id)}>Xóa tác giả</button>
                            </div>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    )
}
const Author = RequireAdminAndStaff(AuthorAdmin);
export default Author;