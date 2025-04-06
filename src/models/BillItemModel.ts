class BillItemModel{
    billItemID: number;
    numberOfBillItem: number;
    price: number;

    constructor(billItemID: number, numberOfBillItem: number, price: number){
        this.billItemID = billItemID;
        this.numberOfBillItem = numberOfBillItem;
        this.price = price;
    }
}

export default BillItemModel;