import { useState } from "react";
import CartModel from "../models/CartModel";
import { jwtDecode } from "jwt-decode";
import CartItemModel from "../models/CartItemModel";
import { Console } from "console";

export async function getCart(token: string) {
    try {
        const userdata = jwtDecode(token);
        let userID = '';
        if (userdata) {
            userID = userdata.jti + '';
        }

        const endpoint = `http://localhost:8080/users/${userID}/cart`;

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error("fail call api getCart");
        }

        const responseData = await response.json();

        if (responseData) {
            return {
                cartID: responseData.cartID,
                deliveryAddress: responseData.deliveryAddress
            }
        } else {
            throw new Error("Cart undefined");
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getCartItem(cartID: number, token: string) {
    try {
        const cartItems: CartItemModel[] = [];
        if (cartID != null) {
            const endpoint = `http://localhost:8080/carts/${cartID}/cartItemList`;

            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error("fail call api getCartItem");
            }

            const responseData = await response.json();
            const data = responseData._embedded.cartItems;

            for (const key in data) {
                cartItems.push({
                    cartItemID: data[key].cartItemID,
                    numberOfCartItem: data[key].numberOfCartItem,
                    price: data[key].price
                })
            }
        }
        return cartItems;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getBookInCartItem(cartItemID: number, token: string) {
    try {
        const endpoint = `http://localhost:8080/cart-items/${cartItemID}/book`;

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error("fail call api getBookInCartItem");
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
            throw new Error("Book undefined");
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function addCartItem(bookID: number, numberOfBook: number, token: string) {
    try {
        const addCartItemResponse = {
            bookID: bookID,
            numberOfBook: numberOfBook
        }
        const endpoint = "http://localhost:8080/user/addCartItem";

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(addCartItemResponse)
        });

        if (!response.ok) {
            throw new Error("fail call api addCartItem!");
        }
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteCartItem(cartItemID:number, token: string) {
    try {
        const endpoint = "http://localhost:8080/user/deleteCartItem";
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
            body: JSON.stringify(cartItemID)
        });
        if(!response.ok){
            throw new Error("fail call api deleteCartItem");
        }
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteAllCartItem(cartID: number, token: string) {
    try {
        const endpoint = "http://localhost:8080/user/deleteAllCartItem";
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
            body: JSON.stringify(cartID)
        });

        if(!response.ok){
            throw new Error("Xóa thất bại");
        }

        return response;
    } catch (error) {
        console.log(error);
    }
}