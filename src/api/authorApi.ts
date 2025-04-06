import AuthorModel from "../models/AuthorModel";
import { my_request } from "./request";

export async function getAuthor(bookID: number): Promise<AuthorModel | null> {
    const endpoint: string = `http://localhost:8080/books/${bookID}/author`;
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error("fail call API getABook");
        }
        const responseData = await response.json(); //gọi endpoint lấy kết quả dạng json 

        if (responseData) {
            return {
                author_id: responseData.authorID,
                author_name: responseData.authorName,
                birthday: responseData.birthday,
                decription: responseData.decription
            }
        } else {
            throw new Error("author andefined");
        }
    } catch (error) {
        console.error("ERROR: " + error);
        return null;
    }
}

export async function getAllAuthor() {
    const authors: AuthorModel[] = [];
    const endpoint = "http://localhost:8080/authors";
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("fail call api getAllAuthor");
        }
        const responseData = await response.json();
        const data = responseData._embedded.authors;

        for (let key in data) {
            authors.push({
                author_id: data[key].authorID,
                author_name: data[key].authorName,
                birthday: data[key].birthday,
                decription: data[key].decription
            });
        }
        return authors;
    } catch (error) {
        console.log(error);
    }
}

export async function getAuthorByAuthorID(authorID: number): Promise<AuthorModel | null> {
    const endpoint: string = `http://localhost:8080/authors/${authorID}`;
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error("fail call API getAuthorByAuthorID");
        }
        const responseData = await response.json(); //gọi endpoint lấy kết quả dạng json 

        if (responseData) {
            return {
                author_id: responseData.authorID,
                author_name: responseData.authorName,
                birthday: responseData.birthday,
                decription: responseData.decription
            }
        } else {
            throw new Error("author andefined");
        }
    } catch (error) {
        console.error("ERROR: " + error);
        return null;
    }
}

export async function getAuthorByContainingAuthorName(authorName: string, token: string) {
    const authors: AuthorModel[] = [];
    const endpoint = `http://localhost:8080/authors/search/findByAuthorNameContaining?sort=authorID,desc&size=8&page=0&authorName=${authorName}`;
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("fail call api getAuthorByContainingAuthorName");
        }
        const responseData = await response.json();
        const data = responseData._embedded.authors;

        for (const key of data) {
            authors.push({
                author_id: key.authorID,
                author_name: key.authorName,
                birthday: key.birthday,
                decription: key.ecription
            });
        }
        return authors;
    } catch (error) {
        console.log(error);
    }
}

export async function createAuthor(authorName: string, birthday: string, description: string, token: string) {
    const endpoint = "http://localhost:8080/admin/createauthor";
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                authorID: 0,
                authorName: authorName,
                birthday: birthday,
                decription: description
            })
        });
        if (!response.ok) {
            throw new Error("fail call api createAuthor");
        }
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function updateAuthor(authorID: number, authorName: string, birthday: string, description: string, token: string) {
    const endpoint = "http://localhost:8080/admin/updateauthor";
    try {
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                authorID: authorID,
                authorName: authorName,
                birthday: birthday,
                decription: description
            })
        });
        if (!response.ok) {
            throw new Error("fail call api updateAuthor");
        }
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteAuthor(authorID: number, token: string) {
    const endpoint = "http://localhost:8080/admin/deleteauthor";
    try {
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(authorID)
        });
        if (!response.ok) {
            throw new Error("fail call api deleteAuthor");
        }
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function AuthorSearch(token: string, authorName: string) {
    const authors: AuthorModel[] = [];
    const endpoint = `http://localhost:8080/authors/search/findByAuthorNameContaining?sort=authorID,desc&size=8&page=0&authorName=${authorName}`;
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            throw new Error("fail call api authorSearch");
        }
        const responseData = await response.json();
        const data = responseData._embedded.authors;
        for (const key in data) {                //nhập sách vào dãy
            authors.push({
                author_id: data[key].authorID,
                author_name: data[key].authorName,
                birthday: data[key].birthday,
                decription: data[key].decription,
            });
        };
        return authors;
    } catch (error) {
        console.log(error);
    }
}