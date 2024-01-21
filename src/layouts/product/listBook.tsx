import React, { useEffect, useState } from "react";
import BookProp from "./Component/BookProp";
import { findByName, getAllBook } from "../../api/bookApi";
import BookModel from "../../models/BookModel";
import Pagination from "./Component/Pagination";

interface listBookInterface{
    bookName : string;
}

const ListBook: React.FC<listBookInterface> = (props) => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);    

    

    useEffect(()=>{
        if(props.bookName === ''){
            getAllBook(currentPage-1).then(
                kq=>{
                    setBooks(kq.result);
                    setTotalPages(kq.totalPages);   
                    setdataload(false);
                }
            ).catch(
                loi=>{ 
                    setdataload(false);
                    seterror(loi.message);
                }
            );
        }else{
            findByName(props.bookName).then(
                kq=>{
                    setBooks(kq.result);
                    setTotalPages(kq.totalPages);   
                    setdataload(false);
                }
            ).catch(
                loi=>{ 
                    setdataload(false);
                    seterror(loi.message);
                }
            );
        }
    },[currentPage, props.bookName])  //chỉ gọi endpoint một lần

    const paginationMethod = (page:number) =>{
        setCurrentPage(page);
    }


    if(dataload){
        return(
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

    if(books.length===0){
        return (
            <div className="container">
                <div className="d-flex align-items-center justify-content-center">
                    <h1 style={{background: "green"}}>Hiện không tìm thấy sách theo yêu cầu!</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="row mt-4">
                {
                    books.map((book) => (<BookProp key={book.book_id} book={book}/>))
                }
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} paginationMethod={paginationMethod}/>
        </div>
    );
}

export default ListBook;