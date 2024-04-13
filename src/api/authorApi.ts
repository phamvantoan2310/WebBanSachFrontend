import AuthorModel from "../models/AuthorModel";
import { my_request } from "./request";

export async function getAuthor(bookID:number): Promise<AuthorModel|null> {
    const endpoint: string = `http://localhost:8080/books/${bookID}/author`;
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error("fail call API getABook");
        }
        const responseData = await response.json(); //gọi endpoint lấy kết quả dạng json 

        if(responseData){
            return{
                author_id: responseData.authorID,
                author_name: responseData.authorName,
                birthday: responseData.birthday,
                decription: responseData.decription
            }
        }else{
            throw new Error("author andefined");
        }
    }catch(error){
        console.error("ERROR: " + error);
        return null;
    }
}

export async function getAuthorByAuthorID(authorID:number): Promise<AuthorModel|null> {
    const endpoint: string = `http://localhost:8080/authors/${authorID}`;
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error("fail call API getAuthorByAuthorID");
        }
        const responseData = await response.json(); //gọi endpoint lấy kết quả dạng json 

        if(responseData){
            return{
                author_id: responseData.authorID,
                author_name: responseData.authorName,
                birthday: responseData.birthday,
                decription: responseData.decription
            }
        }else{
            throw new Error("author andefined");
        }
    }catch(error){
        console.error("ERROR: " + error);
        return null;
    }
}

export async function getAuthorByContainingAuthorName(authorName:string, token: string) {
    const authors: AuthorModel[] = [];
    const endpoint = `http://localhost:8080/authors/search/findByAuthorNameContaining?sort=authorID,desc&size=8&page=0&authorName=${authorName}`;
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        });
        if(!response.ok){
            throw new Error("fail call api getAuthorByContainingAuthorName");
        }
        const responseData = await response.json();
        const data = responseData._embedded.authors;

        for(const key of data){
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