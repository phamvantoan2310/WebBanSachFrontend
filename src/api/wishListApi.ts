import { jwtDecode } from "jwt-decode";
import WishList from "../models/WishList";

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
            throw new Error("fail call API getABook");
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
