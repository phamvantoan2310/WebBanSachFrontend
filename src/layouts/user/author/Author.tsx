import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthorModel from "../../../models/AuthorModel";
import BookModel from "../../../models/BookModel";
import ListBook from "../../product/listBook";
import { getAuthor, getAuthorByAuthorID } from "../../../api/authorApi";
import { getBookByAuthorID } from "../../../api/bookApi";
import BookProp from "./authorComponent/bookProp";


const Author: React.FC = () => {
    const { authorID } = useParams();
    let authorIDOk = 0
    try {
        authorIDOk = parseInt(authorID + '');
    } catch (error) {
        console.log(error);
        authorIDOk = 0;
    }

    const [author, setAuthor] = useState<AuthorModel | null>(null);
    const [books, setBooks] = useState<BookModel[] | undefined>([]);
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
        if(author){
            getBookByAuthorID(author.author_id).then(
                result=>{
                    setBooks(result);
                    console.log(author.author_id);
                }
            ).catch(
                error=>{
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
            <h1 className="text-start">Tác giả</h1>
            <hr />
            <div className="row mt-5">
                <div className="col-sm-8" style={{ borderRight: "1px solid black" }}>
                    <div className="row">
                        {books?.map((book) => (<BookProp key={book.book_id} book={book} />))}
                    </div>
                </div>
                <div className="col-sm-4">
                    <h2 style={{color:"rebeccapurple"}}>{author?.author_name}</h2>
                    <h4 className="text-start mt-5">Ngày sinh: {author?.birthday + ""}</h4>
                    <h4 className="text-start mt-5">Mô tả: {author?.decription}</h4>
                </div>
            </div>
        </div>
    );
}

export default Author;