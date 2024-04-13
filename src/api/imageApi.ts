import React from "react";
import ImageModel from "../models/ImageModel";
import { my_request } from "./request";
import { request } from "http";
import GetBase64 from "../util/getBase64";
import BookModel from "../models/BookModel";
interface image {
    imageID: number;
    imageName: string;
    imageLink: string;
    data: string;
}

async function getImage(endpoint: string): Promise<ImageModel[]> {
    const result: ImageModel[] = [];

    const response = await my_request(endpoint);

    const responseData = response._embedded.images;

    for (const key in responseData) {
        result.push({
            image_id: responseData[key].imageID,
            image_name: responseData[key].imageName,
            image_link: responseData[key].imageLink,
            data: responseData[key].data,
        });
    }

    return result;
}


export async function getImagesByBookId(book_id: number): Promise<ImageModel[]> {

    const endpoint: string = `http://localhost:8080/books/${book_id}/imageList`;

    return getImage(endpoint);
}

export async function getAImagesByBookId(book_id: number): Promise<ImageModel[]> {

    const endpoint: string = `http://localhost:8080/books/${book_id}?size=1&page=0`;



    return getImage(endpoint);
}

export async function addBookImage(data: File, book: BookModel, token: string) {
    try {
        const dataimage = await GetBase64(data);
        if (dataimage != null) {
            const newImage: image = {
                imageID: 0,
                imageName: book?.book_name + "",
                imageLink: "",
                data: dataimage
            }

            const addBookImage = {
                image: newImage,
                bookID: book.book_id
            }
            const endpoint = "http://localhost:8080/staff/addbookimage";
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(addBookImage)
            });
            if (!response.ok) {
                throw new Error("fail call api addBookImage");
            }
            return response;
        }
    } catch (error) {
        console.log(error);
    }
}

export async function deleteBookImage(imageID: number, token: string) {
    try {
        const endpoint = "http://localhost:8080/staff/deletebookimage";
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Content-type':'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(imageID)
        });
        if(!response.ok){
            throw new Error("fail call api deleteBookImage");
        }
        return response;
    } catch (error) {
        console.log(error);
    }
}