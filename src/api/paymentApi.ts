import PaymentModel from "../models/PaymentModel";

export async function getPayment(token : string) {
    try {
        const payments : PaymentModel[] = [];
        const endpoint = "http://localhost:8080/payments";
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
        });
        if(!response.ok){
            throw new Error("fail call api getPayment");
        }
        const responseData = await response.json();
        const data = responseData._embedded.payments;
        for(let key in data){
            payments.push({
                paymentID: data[key].paymentID,
                paymentName: data[key].paymentName,
                decription: data[key].decription,
                priceOfPayment: data[key].priceOfPayment,
            });
        }
        return payments;
    } catch (error) {
        console.log(error);
    }
}

export async function getPaymentByOrderID(token : string, orderID: number) {
    try {
        const endpoint = `http://localhost:8080/orders/${orderID}/payment`;
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
        });
        if(!response.ok){
            throw new Error("fail call api getPaymentByOrderID");
        }
        const responseData = await response.json();

        return ({
            paymentID: responseData.paymentID,
                paymentName: responseData.paymentName,
                decription: responseData.decription,
                priceOfPayment: responseData.priceOfPayment,
        })
    } catch (error) {
        console.log(error);
    }
}