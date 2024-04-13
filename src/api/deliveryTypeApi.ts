import { log } from "console"
import DeliveryTypeModel from "../models/DeliveryTypeModel";

export async function getDeliveryType(token: string) {
    try {
        const deliveryTypes: DeliveryTypeModel[] = [];
        const endpoint = "http://localhost:8080/delivery-types";
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error("fail call api getDeliveryType");
        }
        const responseData = await response.json();
        const data = responseData._embedded.deliveryTypes;
        for (let key in data) {
            deliveryTypes.push({
                deliveryTypeID: data[key].deliveryTypeID,
                decription: data[key].decription,
                deliveryTypeName: data[key].deliveryTypeName,
                priceOfDeliveryType: data[key].priceOfDeliveryType,
            });
        }

        return deliveryTypes;
    } catch (error) {
        console.log(error);
    }
}

export async function getDeliveryTypeByOrderID(orderID: number, token: string) {
    const endpoint = `http://localhost:8080/orders/${orderID}/deliveryType`;
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            throw new Error("fail call api getDeliveryTypeByOrderID");
        }
        const responseData = await response.json();

        return ({
            deliveryTypeID: responseData.deliveryTypeID,
            decription: responseData.decription,
            deliveryTypeName: responseData.deliveryTypeName,
            priceOfDeliveryType: responseData.priceOfDeliveryType,
        })

    } catch (error) {
        console.log(error);
    }
}