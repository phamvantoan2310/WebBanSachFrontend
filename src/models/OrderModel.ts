class OrderModel{
    orderID: number;
    deliveryAddress: string;
    deliveryDate: string;
    orderDate: string;
    orderStatus: string;
    totalPrice: number;
    deliveryPhoneNumber: string;
    deliveryUserName:string;

    constructor(orderID: number, deliveryAddress: string, deliveryDate: string, orderDate: string, orderStatus: string, totalPrice: number, deliveryPhoneNUmber: string, deliveryUserName:string){
        this.orderID = orderID;
        this.deliveryAddress = deliveryAddress;
        this.deliveryDate = deliveryDate;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.totalPrice = totalPrice;
        this.deliveryPhoneNumber = deliveryPhoneNUmber;
        this.deliveryUserName = deliveryUserName;
    }
}
export default OrderModel;