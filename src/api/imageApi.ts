import React from "react";
import ImageModel from "../models/ImageModel";
import { my_request } from "./request";
import { request } from "http";

export async function getImageByBookId(book_id: number): Promise<ImageModel[]> {
    const result: ImageModel[] = [];

    const endpoint: string = `http://localhost:8080/books/${book_id}/imageList`;

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