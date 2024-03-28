import OrderModel from "../models/OrderModel";
import OrderItemModel from "../models/OrderItemModel";

export async function getOrderByUserID(userID: number, token: string) {
    const orders: OrderModel[] = [];
    try {
        const endpoint = `http://localhost:8080/users/${userID}/orderList`;
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error("fail call api getOrderByUserID");
        }

        const responseData = await response.json();

        const data = responseData._embedded.orderses;

        for (let key in data) {
            orders.push({
                orderID: data[key].orderID,
                orderDate: data[key].orderDate,
                totalPrice: data[key].totalPrice,
                deliveryAddress: data[key].deliveryAddress,
                deliveryDate: data[key].deliveryDate,
                orderStatus: data[key].orderStatus
            })
        }

        return orders;
    } catch (error) {
        console.log(error);
    }
}

export async function getOrderItem(orderID: number, token: string) {
    const orderItems: OrderItemModel[] = [];
    try {
        const endpoint = `http://localhost:8080/orders/${orderID}/orderItemList`;
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            throw new Error("fail call api getOrderItem");
        }
        const responseData = await response.json();
        const data = responseData._embedded.orderItems;

        for (let key in data) {
            orderItems.push({
                orderItemID: data[key].orderItemID,
                numberOfOrderItem: data[key].numberOfOrderItem,
                price: data[key].price,
            })
        }
        return orderItems;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteOrder(orderID: number, token: string) {
    try {
        const endpoint = `http://localhost:8080/user/deleteorder`;
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderID)
        });
        if (!response.ok) {
            throw new Error("fail call api deleteOrder");
        }
        return response;
    } catch (error) {
        console.log(error);
    }
}