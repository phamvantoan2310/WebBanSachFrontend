import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthorModel from "../../../models/AuthorModel";
import BookModel from "../../../models/BookModel";
import ListBook from "../../product/listBook";
import { getAuthor, getAuthorByAuthorID } from "../../../api/authorApi";
import { getBookByAuthorID } from "../../../api/bookApi";
import BookProp from "./authorComponent/bookProp";


const AuthorDetail: React.FC = () => {
    const { authorID } = useParams();
    let authorIDOk = 0
    try {
        authorIDOk = parseInt(authorID + '');
    } catch (error) {
        console.log(error);
        authorIDOk = 0;
    }

    const [author, setAuthor] = useState<AuthorModel | null>(null);
    const [books, setBooks] = useState<BookModel[]>([]);
    const [dataload, setDataLoad] = useState<boolean>(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAuthorByAuthorID(authorIDOk).then(
            result => {
                setAuthor(result);
                setDataLoad(false);
            }
        ).catch(
            error => {
                setError(error);
                setDataLoad(false);
            })
    }, [authorID])

    useEffect(() => {
        if (author) {
            getBookByAuthorID(author.author_id).then(
                result => {
                    if (result != undefined) {
                        setBooks(result);
                    }
                }
            ).catch(
                error => {
                    setError(error);
                }
            )
        }
    }, [author])

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
            <h1 className="text-start fw-bold">📚 Tác giả</h1>
            <hr />
            <div className="row mt-5">
                <div className="col-sm-8 overflow-auto pe-4" style={{ borderRight: "2px solid black", width: "880px", height: "700px" }}>
                    <div className="row">
                        {books?.length > 0 ? (
                            books.map((book) => (
                                <BookProp key={book.book_id} book={book} />
                            ))
                        ) : (
                            <p className="text-muted">Không có sách nào được tìm thấy.</p>
                        )}
                    </div>
                </div>

                <div className="col-sm-4 ps-4">
                    <h2 className="text-start fw-semibold mb-5">✍️ Giới thiệu tác giả</h2>
                    {author ? (
                        <div style={{ border: "1px solid #d9d9d9", borderRadius: "3px", padding: "10px" }}>
                            <h3 style={{ color: "rebeccapurple" }}>{author.author_name}</h3>
                            <p className="text-start mt-4"><strong>📅 Ngày sinh:</strong> {author.birthday + "" || "Không xác định"}</p>
                            <p className="text-start mt-4"><strong>📖 Mô tả:</strong> {author.decription || "Chưa có mô tả."}</p>
                        </div>
                    ) : (
                        <p className="text-muted">Thông tin tác giả không khả dụng.</p>
                    )}
                </div>
            </div>
        </div>

    );
}

export default AuthorDetail;