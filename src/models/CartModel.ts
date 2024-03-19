class CartModel {
    cartID: number;
    deliveryAddress?: string;

    constructor(cartID: number, deliveryAddress: string, totalPrice: number) {
        this.cartID = cartID;
        this.deliveryAddress = deliveryAddress;
    }
}

export default CartModel;