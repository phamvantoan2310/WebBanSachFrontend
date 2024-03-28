class OrderItemModel{
    orderItemID: number;
    numberOfOrderItem: number;
    price: number;

    constructor(orderItemID: number, numberOfOrderItem: number, price: number){
        this.orderItemID = orderItemID;
        this.numberOfOrderItem = numberOfOrderItem;
        this.price = price;
    }
}

export default OrderItemModel;