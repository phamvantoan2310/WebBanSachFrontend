import { jwtDecode } from "jwt-decode";
import WishList from "../models/WishList";
import { Console } from "console";
import BookModel from "../models/BookModel";

export async function getWishList(token: string) {
    const wishLists: WishList[] = [];
    try {
        const userData = jwtDecode(token);
        console.log(userData);
        let userId = '';
        if (userData) {
            userId = userData.jti + '';
        }
        const endpoint = `http://localhost:8080/users/${userId}/wishListList`;
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error("fail call API getWishList");
        }

        const responseData = await response.json();

        const data = responseData._embedded.wishLists;

        for (const key in data) {
            wishLists.push({
                wishList_id: data[key].wishListID,
                wishList_name: data[key].wishlistName
            });
        }
    } catch (error: any) {
        console.error("Invalid token:", error.message);
    }
    // const userData = jwtDecode(token);

    return wishLists;
}

export async function addWishList(wishlist: WishList, token: string | null) {
    try {
        const endpoint = 'http://localhost:8080/user/addwishlist';
        const data = {
            wishListID: 0,
            wishlistName: wishlist.wishList_name,
        }
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
        return response;
    } catch (error) {
        console.log("Error: " + error);
    }
}

export async function getBookInWishList(wishListID: string, token: string) {
    try {
        const endpoint = `http://localhost:8080/wish-lists/${wishListID}/bookList`;

        const books: BookModel[] = [];

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            throw new Error("fail call api getBookInWishList");
        }
        const responseData = await response.json();
        const data = responseData._embedded.books;

        for (const key in data) {
            books.push({
                book_id: data[key].bookID,
                book_name: data[key].bookName,
                price: data[key].price,
                listed_price: data[key].listedPrice,
                description: data[key].decription,
                number_of_book: data[key].numberOfBooks,
                point: data[key].point
            });
        }
        return books;
    } catch (error) {
        console.log("Error" + error);
    }
}

export async function deleteWishList(wishListID: number, token: string) {
    try {
        const endpoint = 'http://localhost:8080/user/deletewishlist';
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(wishListID)
        })
        return response;
    } catch (error) {
        console.log("Error: " + error);
    }
}


export async function changeWishListName(wishListID: number, wishListName: string, token: string) {
    try {
        const endpoint = 'http://localhost:8080/user/changewishlistname';
        const changeWishListNameResponse = {
            wishlistID: wishListID,
            wishlistName: wishListName
        }
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(changeWishListNameResponse)
        })
        return response;
    } catch (error) {
        console.log("Error: " + error);
    }
}

export async function existByWishListName(wishlistName: string) {
    const endpoint = `http://localhost:8080/wish-lists/search/existsByWishlistName?wishlistName=${wishlistName}`;
    try {
        const response = await fetch(endpoint);
        const result = response.json();
        return result;
    } catch (error) {
        console.log("error: " + error);
    }
}
