import React from "react";
import ImageModel from "../models/ImageModel";
import { my_request } from "./request";
import { request } from "http";
async function getImage(endpoint: string): Promise<ImageModel[]> {
    const result: ImageModel[] = [];

    const response = await my_request(endpoint);

    const responseData = response._embedded.images;

    for(const key in responseData){
        result.push({
            image_id : responseData[key].imageID,
            image_name : responseData[key].imageName,
            image_link : responseData[key].imageLink,
            data : responseData[key].data,
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