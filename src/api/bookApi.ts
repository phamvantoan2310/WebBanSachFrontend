import React from "react";
import BookModel from "../models/BookModel";
import { my_request } from "./request";

interface getResult{
    result: BookModel[];
    totalPages: number;
    totalBooks: number;
}

async function getBook(endpoint: string): Promise<getResult> {
    const result: BookModel[] = [];

    const response = await my_request(endpoint); //gọi endpoint lấy kết quả dạng json 

    const responseData = response._embedded.books; //lấy danh sách từ kết quả vừa lấy

    for(const key in responseData){                //nhập sách vào dãy
        result.push({
            book_id: responseData[key].bookID,
            book_name: responseData[key].bookName,
            description: responseData[key].decription,
            price: responseData[key].price,
            listed_price: responseData[key].listedPrice,
            number_of_book:responseData[key].number_of_book,
            author_id: responseData[key].author_id
        });
    }

    const numberPages: number = response.page.totalPages;
    const numberBooks: number = response.page.totalElements;

    return {result: result, totalBooks: numberBooks, totalPages: numberPages};
}

export async function getAllBook(currentPage: number): Promise<getResult> {     
    const endpoint: string = `http://localhost:8080/books?sort=bookID,desc&page=${currentPage}&size=8`;

    return getBook(endpoint);
}

export async function get3Book(): Promise<getResult> {
    const endpoint: string = "http://localhost:8080/books?sort=bookID,desc&page=0&size=3";

    return getBook(endpoint);
}

export async function findByName(bookName:string): Promise<getResult> {
    const endpoint: string = `http://localhost:8080/books/search/findByBookNameContaining?sort=bookID,desc&size=8&page=0&bookName=${bookName}`;
    return getBook(endpoint);
}