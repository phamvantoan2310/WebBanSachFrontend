import { log } from "console"
import DeliveryTypeModel from "../models/DeliveryTypeModel";

export async function getDeliveryType(token: string) {
    try {
        const deliveryTypes : DeliveryTypeModel[] = [];
        const endpoint = "http://localhost:8080/delivery-types";
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
        });

        if(!response.ok){
            throw new Error("fail call api getDeliveryType");
        }
        const responseData = await response.json();
        const data = responseData._embedded.deliveryTypes;
        for(let key in data){
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