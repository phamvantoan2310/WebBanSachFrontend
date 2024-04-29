import { json } from "stream/consumers";

export async function getRevenueByRevenueDate(token: string, revenueDate: string) {
    const endpoint = `http://localhost:8080/admin/getrevenuebyrevenuedate?revenueDate=${revenueDate}`;
    try {
        const response = await fetch(endpoint, {
            method : 'GET',
            headers : {
                'Content-type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
        });

        if(!response.ok){
            throw new Error("fail call api getRevenueByRevenueDate");
        }

        const responseData = await response.json();

        return({
            revenueID : responseData.revenueID,
            totalRevenue : responseData.totalRevenue,
            revenueDate : responseData.revenueDate
        });


    } catch (error) {
        console.log(error);
    }
}