import { key } from "localforage";
import CategoryModel from "../models/CategoryModel";

export async function getAllCategory() {
    const categories: CategoryModel[] = [];
    const endpoint = "http://localhost:8080/categorys";
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("fail call api getAllCategory");
        }
        const responseData = await response.json();
        const data = responseData._embedded.categories;

        for (let key in data) {
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

export async function getCategoryByBookID(bookID: number) {
    const categories: CategoryModel[] = [];
    const endpoint = `http://localhost:8080/books/${bookID}/categoryList`;
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("fail call api getCategoryByBookID");
        }
        const responseData = await response.json();
        const data = responseData._embedded.categories;

        for (let key in data) {
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

export async function createCategory(categoryName: string, token: string) {
    const endpoint = "http://localhost:8080/admin/createcategory";
    const createCategoryResponse = {
        categoryName: categoryName,
    }
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(createCategoryResponse)
        });

        if (!response.ok) {
            throw new Error("fail call api createCategory!");
        }
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function existByCategoryName(categoryName: string) {
    const endpoint = `http://localhost:8080/categorys/search/existsByCategoryName?categoryName=${categoryName}`;
    try {
        const response = await fetch(endpoint);
        const result = response.json();
        return result;
    } catch (error) {
        console.log("error: " + error);
    }
}

export async function deleteCategory(categoryID: number, token: string) {
    const endpoint = "http://localhost:8080/admin/deletecategory";
    try {
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(categoryID)
        });

        if (!response.ok) {
            throw new Error("fail call api deleteCategory!");
        }
        return response;
    } catch (error) {
        console.log(error);
    }
}