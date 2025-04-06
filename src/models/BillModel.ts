class BillModel {
    billID: number;
    totalPrice: number;
    creationDate: string;
    suppliers: string;
    suppliersAddress: string;
    suppliersPhoneNumber: string;
    customer: string;
    customerAddress: string;
    customerPhoneNumber: string;
    suppliersTax: string;
    customerTax: string;

    constructor(billID: number, totalPrice: number, creationDate: string, suppliers: string, suppliersAddress: string, suppliersPhoneNumber: string, customer: string, customerAddress: string, customerPhoneNumber: string, suppliersTax: string, customerTax: string) {
        this.billID = billID;
        this.totalPrice = totalPrice;
        this.creationDate = creationDate;
        this.suppliers = suppliers;
        this.suppliersAddress = suppliersAddress;
        this.suppliersPhoneNumber = suppliersPhoneNumber;
        this.customer = customer;
        this.customerAddress = customerAddress;
        this.customerPhoneNumber = customerPhoneNumber;
        this.suppliersTax = suppliersTax;
        this.customerTax = customerTax;
    }
}
export default BillModel;