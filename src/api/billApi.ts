import { error } from "console";
import BillModel from "../models/BillModel";
import BookModel from "../models/BookModel";
import BillItemModel from "../models/BillItemModel";

interface BillItem {
    bookID: number;
    numberOfBooks: number;
    importPrice: number;
}

export async function createBill(totalPrice: number, creationDate: string, suppliers: string, suppliersAddress: string, suppliersPhoneNumber: string, suppliersTax: string, BillItems: BillItem[], token: string) {
    const endpoint: string = "http://localhost:8080/admin/createbill";

    const bill: BillModel = {
        billID: 0,
        creationDate: creationDate,
        totalPrice: totalPrice,
        suppliers: suppliers,
        suppliersAddress: suppliersAddress,
        suppliersPhoneNumber: suppliersPhoneNumber,
        suppliersTax: suppliersTax,
        customer: "BookShops",
        customerAddress: "19, ngõ 280, Đường Cổ Nhuế, Bắc Từ Liêm, Hà Nội",
        customerPhoneNumber: "0332908324",
        customerTax: "MST231003",
    }

    const createBillResponse = {
        bill: bill,
        billItemResponses: BillItems
    }

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(createBillResponse)
    });

    return response;
}

export async function getAllBills(token: string) {
    const endpoint = `http://localhost:8080/bills`;
    const bills: BillModel[] = [];
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
        const data = responseData._embedded.bills;
        for (const bill of data) {
            bills.push({
                billID: bill.billID,
                creationDate: bill.creationDate,
                totalPrice: bill.totalPrice,
                customer: bill.customer,
                customerAddress: bill.customerAddress,
                customerPhoneNumber: bill.customerPhoneNumber,
                customerTax: bill.customerTax,
                suppliers: bill.suppliers,
                suppliersAddress: bill.suppliersAddress,
                suppliersPhoneNumber: bill.suppliersPhoneNumber,
                suppliersTax: bill.suppliersTax,
            });
        }
        return bills;
    } catch (error) {
        console.log(error);
    }
}

export async function getBillByBillID(token: string, billID: number) {
    const endpoint = `http://localhost:8080/bills/search/findByBillID?billID=${billID}`;
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("fail call api getBillByBillID");
        }
        const responseData = await response.json();
        return {
            billID: responseData.billID,
            creationDate: responseData.creationDate,
            totalPrice: responseData.totalPrice,
            customer: responseData.customer,
            customerAddress: responseData.customerAddress,
            customerPhoneNumber: responseData.customerPhoneNumber,
            customerTax: responseData.customerTax,
            suppliers: responseData.suppliers,
            suppliersAddress: responseData.suppliersAddress,
            suppliersPhoneNumber: responseData.suppliersPhoneNumber,
            suppliersTax: responseData.suppliersTax,
        }
    } catch (error) {
        console.log(error);
    }
}

export async function deleteBill(billID: number, token: string) {
    try {
        const endpoint = `http://localhost:8080/admin/deletebill`;
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(billID)
        });
        if (!response.ok) {
            throw new Error("fail call api deleteBill");
        }
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function getAllBillItemByBillID(token: string, billID: number) {
    const endpoint = `http://localhost:8080/bills/${billID}/billItemList`;
    const billItems: BillItemModel[] = [];
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("fail call api getAllBillItemByBillID");
        }
        const responseData = await response.json();
        const data = responseData._embedded.billItems;
        for (const billItem of data) {
            billItems.push({
                billItemID: billItem.billItemID,
                numberOfBillItem: billItem.numberOfBillItem,
                price: billItem.price,
            });
        }
        return billItems;
    } catch (error) {
        console.log(error);
    }
}