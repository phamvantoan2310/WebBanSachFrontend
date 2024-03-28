import React from "react";
import BookModel from "../models/BookModel";
import { my_request } from "./request";

interface getResult {
    result: BookModel[];
    totalPages: number;
    totalBooks: number;
}

async function getBook(endpoint: string): Promise<getResult> {
    const result: BookModel[] = [];

    const response = await my_request(endpoint); //gọi endpoint lấy kết quả dạng json 

    const responseData = response._embedded.books; //lấy danh sách từ kết quả vừa lấy

    for (const key in responseData) {                //nhập sách vào dãy
        result.push({
            book_id: responseData[key].bookID,
            book_name: responseData[key].bookName,
            description: responseData[key].decription,
            price: responseData[key].price,
            listed_price: responseData[key].listedPrice,
            number_of_book: responseData[key].numberOfBooks,
            point: responseData[key].point,
            author_id: responseData[key].author_id
        });
    }

    const numberPages: number = response.page.totalPages;
    const numberBooks: number = response.page.totalElements;

    return { result: result, totalBooks: numberBooks, totalPages: numberPages };
}

export async function getAllBook(currentPage: number): Promise<getResult> {
    const endpoint: string = `http://localhost:8080/books?sort=bookID,desc&page=${currentPage}&size=8`;

    return getBook(endpoint);
}

export async function get3Book(): Promise<getResult> {
    const endpoint: string = "http://localhost:8080/books?sort=bookID,desc&page=0&size=3";

    return getBook(endpoint);
}

export async function findBook(bookName: string, categoryID: number): Promise<getResult> {
    let endpoint: string = `http://localhost:8080/books?sort=bookID,desc&page=0&size=8`;


    if (bookName !== "" && categoryID === 0) {
        endpoint = `http://localhost:8080/books/search/findByBookNameContaining?sort=bookID,desc&size=8&page=0&bookName=${bookName}`;
    } else if (bookName === "" && categoryID > 0) {
        endpoint = `http://localhost:8080/books/search/findByCategoryList_CategoryID?sort=bookID,desc&categoryID=${categoryID}`;
    } else if (bookName !== "" && categoryID > 0) {
        endpoint = `http://localhost:8080/books/search/findByBookNameContainingAndCategoryList_CategoryID?sort=bookID,desc&bookName=${bookName}&categoryID=${categoryID}`;
    }


    return getBook(endpoint);
}

export async function getABook(bookID: number): Promise<BookModel | null> {
    const endpoint: string = `http://localhost:8080/books/${bookID}`;
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error("fail call API getABook");
        }
        const responseData = await response.json(); //gọi endpoint lấy kết quả dạng json 

        if(responseData){
            return{
                book_id: responseData.bookID,
                book_name: responseData.bookName,
                description: responseData.decription,
                price: responseData.price,
                listed_price: responseData.listedPrice,
                number_of_book: responseData.numberOfBooks,
                point: responseData.point,
                author_id: responseData.author_id
            }
        }else{
            throw new Error("book undefined");
        }
    }catch(error){
        console.error("ERROR: " + error);
        return null;
    }
}

export async function getBookByOrderItemID(orderItemID:number, token: string) {
    const endpoint = `http://localhost:8080/order-items/${orderItemID}/book`;
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
        });

        if(!response.ok){
            throw new Error("fail call api getBookByOrderItemID");
        }

        const responseData = await response.json();
        if(responseData){
            return{
                book_id: responseData.bookID,
                book_name: responseData.bookName,
                description: responseData.decription,
                price: responseData.price,
                listed_price: responseData.listedPrice,
                number_of_book: responseData.numberOfBooks,
                point: responseData.point,
                author_id: responseData.author_id
            }
        }else{
            throw new Error("book undefined");
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}