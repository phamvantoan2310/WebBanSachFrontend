class OrderModel{
    orderID: number;
    deliveryAddress: string;
    deliveryDate: string;
    orderDate: string;
    orderStatus: string;
    totalPrice: number;

    constructor(orderID: number, deliveryAddress: string, deliveryDate: string, orderDate: string, orderStatus: string, totalPrice: number){
        this.orderID = orderID;
        this.deliveryAddress = deliveryAddress;
        this.deliveryDate = deliveryDate;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.totalPrice = totalPrice;
    }
}
export default OrderModel;