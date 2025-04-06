import OrderModel from "../models/OrderModel";

export async function getRevenueByRevenueDate(token: string, revenueDate: string) {
    const orders: OrderModel[] = [];
    const endpoint = `http://localhost:8080/orders/search/findByOrderDateAndOrderStatus?orderDate=${revenueDate}&orderStatus=Hoàn Thành`;
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error("fail call api getRevenueByRevenueDate");
        }

        const responseData = await response.json();
        const data = await responseData._embedded.orderses;

        for (const key in data) {                //nhập sách vào dãy
            orders.push({
                orderID: data[key].orderID,
                deliveryAddress: data[key].deliveryAddress,
                deliveryDate: data[key].deliveryDate,
                orderDate: data[key].orderDate,
                orderStatus: data[key].orderStatus,
                totalPrice: data[key].totalPrice,
                deliveryPhoneNumber: data[key].deliveryPhoneNumber,
                deliveryUserName: data[key].deliveryUserName,
            });
        };

        return orders;
    } catch (error) {
        console.log(error);
    }
}