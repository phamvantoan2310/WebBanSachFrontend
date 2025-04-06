import React from "react";
import BookModel from "../models/BookModel";
import { my_request } from "./request";

interface book {
    bookID: number;
    bookName: string;
    price: number;
    listedPrice: number;
    decription: string;
    numberOfBooks: number;
    point: number;
    content: string;
}

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
            author_id: responseData[key].author_id,
            quantity_sold: responseData[key].quantitySold,
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
        if ((await getBook(endpoint)).result.length > 0){
            return getBook(endpoint);
        }else{
            return getBook(`http://localhost:8080/books/search/findByAuthor_AuthorName?sort=bookID,desc&size=8&page=0&authorName=${bookName}`)
        }
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
        if (responseData) {
            return {
                book_id: responseData.bookID,
                book_name: responseData.bookName,
                description: responseData.decription,
                price: responseData.price,
                listed_price: responseData.listedPrice,
                number_of_book: responseData.numberOfBooks,
                point: responseData.point,
                quantity_sold: responseData.quantitySold,
                publisher: responseData.publisher,
                publication_year: responseData.publicationYear,
                language: responseData.language,
                content: responseData.content,
            }
        } else {
            throw new Error("book undefined");
        }
    } catch (error) {
        console.error("ERROR: " + error);
        return null;
    }
}

export async function getBookByOrderItemID(orderItemID: number, token: string) {
    const endpoint = `http://localhost:8080/order-items/${orderItemID}/book`;
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error("fail call api getBookByOrderItemID");
        }

        const responseData = await response.json();
        if (responseData) {
            return {
                book_id: responseData.bookID,
                book_name: responseData.bookName,
                description: responseData.decription,
                price: responseData.price,
                listed_price: responseData.listedPrice,
                number_of_book: responseData.numberOfBooks,
                point: responseData.point,
                author_id: responseData.author_id
            }
        } else {
            throw new Error("book undefined");
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getBookByAuthorID(authorID: number) {
    const books: BookModel[] = [];
    const endpoint = `http://localhost:8080/authors/${authorID}/bookList`;
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("fail call api findBookByAuthorID");
        }

        const responseData = await response.json();
        const data = responseData._embedded.books;

        for (const item of data) {             //sử dụng for in không được vì có thể là lỗi từ các thuộc tính không mong muốn từ prototype của mảng
            books.push({
                book_id: item.bookID,
                book_name: item.bookName,
                description: item.decription,
                price: item.price,
                listed_price: item.listedPrice,
                number_of_book: item.numberOfBooks,
                point: item.point,
                author_id: item.author_id,
                quantity_sold: item.quantitySold
            });
        }

        return books;
    } catch (error) {
        console.log(error);
    }
}

export async function bookChange(bookID: number, bookName: string, numberOfBooks: number, listedPrice: number, price: number, decription: string, point: number, authorID: number, categoryID: number, token: string, content: string) {
    const endpoint = "http://localhost:8080/staff/bookchange";
    try {
        const Book: book = {
            bookID: bookID,
            bookName: bookName,
            decription: decription,
            listedPrice: listedPrice,
            numberOfBooks: numberOfBooks,
            point: point,
            price: price,
            content: content
        }

        const bookChangeResponse = {
            book: Book,
            authorID: authorID,
            categoryID: categoryID,
        }
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bookChangeResponse)
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function staffGetAllBook(token: string) {
    const result: BookModel[] = [];
    const endpoint = "http://localhost:8080/books";
    try {
        const response = await fetch(endpoint, {       //gọi endpoint lấy kết quả dạng json 
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        const responseData = data._embedded.books; //lấy danh sách từ kết quả vừa lấy

        for (const key in responseData) {                //nhập sách vào dãy
            result.push({
                book_id: responseData[key].bookID,
                book_name: responseData[key].bookName,
                description: responseData[key].decription,
                price: responseData[key].price,
                listed_price: responseData[key].listedPrice,
                number_of_book: responseData[key].numberOfBooks,
                point: responseData[key].point,
                author_id: responseData[key].author_id,
                quantity_sold: responseData[key].quantitySold
            });
        };
        return result;
    } catch (error) {
        console.log(error);
    }
}
export async function staffFindBook(token: string, bookName: string) {
    const books: BookModel[] = [];
    const endpoint = `http://localhost:8080/books/search/findByBookNameContaining?sort=bookID,desc&size=8&page=0&bookName=${bookName}`;
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            throw new Error("fail call api staffFindBook");
        }
        const responseData = await response.json();
        const data = responseData._embedded.books;
        for (const key in data) {                //nhập sách vào dãy
            books.push({
                book_id: data[key].bookID,
                book_name: data[key].bookName,
                description: data[key].decription,
                price: data[key].price,
                listed_price: data[key].listedPrice,
                number_of_book: data[key].numberOfBooks,
                point: data[key].point,
                author_id: data[key].author_id,
                quantity_sold: data[key].quantitySold
            });
        };
        return books;
    } catch (error) {
        console.log(error);
    }
}

export async function changeNumberOfBook(token: string, numberOfBook: number, bookID: number) {
    const endpoint = "http://localhost:8080/staff/numberofbookchange";
    const numberOfBookChangeResponse = {
        bookID: bookID,
        numberOfBook: numberOfBook
    }
    try {
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(numberOfBookChangeResponse)
        });

        if (!response.ok) {
            throw new Error("fail call api changeNumberOfBook");
        }

        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteBook(token: string, bookID: number) {
    const endpoint = "http://localhost:8080/staff/deletebook";
    try {
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bookID)
        });
        if (!response.ok) {
            throw new Error("fail call api deleteToken");
        }
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function getBookByBillItemID(billID: number, token: string) {
    const endpoint = `http://localhost:8080/billitems/${billID}/book`;
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error("fail call api getBookByBillItemID");
        }

        const responseData = await response.json();

        return {
            book_id: responseData.bookID,
            book_name: responseData.bookName,
            description: responseData.decription,
            price: responseData.price,
            listed_price: responseData.listedPrice,
            number_of_book: responseData.numberOfBooks,
            point: responseData.point,
            author_id: responseData.author_id,
            quantity_sold: responseData.quantitySold,
            publisher: responseData.publisher,
            publication_year: responseData.publicationYear,
            language: responseData.language
        }
    } catch (error) {
        console.log(error);
    }
}

export async function getBookByCategoryID(token: string, categoryID: number) {
    const books: BookModel[] = [];
    const endpoint = `http://localhost:8080/categorys/${categoryID}/bookList`;
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            throw new Error("fail call api staffFindBook");
        }
        const responseData = await response.json();
        const data = responseData._embedded.books;
        for (const key in data) {                //nhập sách vào dãy
            books.push({
                book_id: data[key].bookID,
                book_name: data[key].bookName,
                description: data[key].decription,
                price: data[key].price,
                listed_price: data[key].listedPrice,
                number_of_book: data[key].numberOfBooks,
                point: data[key].point,
                author_id: data[key].author_id,
                quantity_sold: data[key].quantitySold
            });
        };
        return books;
    } catch (error) {
        console.log(error);
    }
}

export async function existByBookName(bookname: string) {
    const endpoint = `http://localhost:8080/books/search/existsByBookName?bookName=${bookname}`;
    try {
        const response = await fetch(endpoint);
        const result = response.json();
        return result;
    } catch (error) {
        console.log("error: " + error);
    }
}