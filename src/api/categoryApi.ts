import { key } from "localforage";
import CategoryModel from "../models/CategoryModel";

export async function getAllCategory() {
    const categories : CategoryModel[] = [];
    const endpoint = "http://localhost:8080/categorys";
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type' : 'application/json',
            },
        });

        if(!response.ok){
            throw new Error("fail call api getAllCategory");
        }
        const responseData = await response.json();
        const data = responseData._embedded.categories;

        for(let key in data){
            categories.push({
                categoryID: data[key].categoryID,
                categoryName: data[key].categoryName
            });
        }
        return categories;
    } catch (error) {
        console.log(error);
    }
}

export async function getCategoryByBookID(bookID:number) {
    const categories : CategoryModel[] = [];
    const endpoint = `http://localhost:8080/books/${bookID}/categoryList`;
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type' : 'application/json',
            },
        });

        if(!response.ok){
            throw new Error("fail call api getCategoryByBookID");
        }
        const responseData = await response.json();
        const data = responseData._embedded.categories;

        for(let key in data){
            categories.push({
                categoryID: data[key].categoryID,
                categoryName: data[key].categoryName
            });
        }
        return categories;
    } catch (error) {
        console.log(error);
    }
}