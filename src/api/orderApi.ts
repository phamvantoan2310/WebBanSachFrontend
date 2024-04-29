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

export async function getOrderByReportID(token: string, reportID: number) {
    const endpoint = `http://localhost:8080/reports/${reportID}/orders`;
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        const responseData = await response.json();
        if (responseData) {
            return ({
                orderID: responseData.orderID,
                orderDate: responseData.orderDate,
                totalPrice: responseData.totalPrice,
                deliveryAddress: responseData.deliveryAddress,
                deliveryDate: responseData.deliveryDate,
                orderStatus: responseData.orderStatus
            });
        } else {
            throw new Error("order undefined");
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function completeOrder(token: string, orderID: number) {
    const endpoint = "http://localhost:8080/user/completeorder";
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderID)
        });
        if (!response.ok) {
            throw new Error("fail call api completeOrder");
        }
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function getOrderByOrderStatus(token: string, orderStatus: string) {
    const endpoint = `http://localhost:8080/orders/search/findByOrderStatus?orderStatus=${orderStatus}`;
    const orders: OrderModel[] = [];
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("fail call api getOrderByOrderStatus");
        }
        const responseData = await response.json();
        const data = responseData._embedded.orderses;
        for (const order of data) {
            orders.push({
                orderID: order.orderID,
                orderDate: order.orderDate,
                deliveryAddress: order.deliveryAddress,
                deliveryDate: order.deliveryDate,
                orderStatus: order.orderStatus,
                totalPrice: order.totalPrice
            });
        }

        return orders;
    } catch (error) {
        console.log(error);
    }
}

export async function getOrderByOrderID(orderID: number, token: string) {
    try {
        const endpoint = `http://localhost:8080/orders/${orderID}`;
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error("fail call api getOrderByOrderID");
        }

        const responseData = await response.json();
        return ({
            orderID: responseData.orderID,
            orderDate: responseData.orderDate,
            totalPrice: responseData.totalPrice,
            deliveryAddress: responseData.deliveryAddress,
            deliveryDate: responseData.deliveryDate,
            orderStatus: responseData.orderStatus
        });

    } catch (error) {
        console.log(error);
    }
}

export async function confirmOrder(token: string, orderID: number) {
    const endpoint = "http://localhost:8080/staff/confirmorder";
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderID)
        });

        if (!response.ok) {
            throw new Error("fail call api confirmOrder");
        }
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function getOrderByDeliveryOrder(token: string, deliveryOrder: string) {
    const endpoint = "";
    const orders: OrderModel[] = [];

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const responseData = await response.json();
        const data = responseData._embedded.orderses;

        for (const orderData of data) {
            orders.push({
                orderID: orderData.orderID,
                orderDate: orderData.orderDate,
                totalPrice: orderData.totalPrice,
                deliveryAddress: orderData.deliveryAddress,
                deliveryDate: orderData.deliveryDate,
                orderStatus: orderData.orderStatus
            })
        }
        return orders;
    } catch (error) {
        console.log(error);
    }
}

