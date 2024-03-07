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