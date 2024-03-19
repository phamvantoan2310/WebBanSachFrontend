class CartItemModel{
    cartItemID: number;
    numberOfCartItem: number;
    price: number;

    constructor(cartItemID: number, numberOfCartItem: number, price: number){
        this.cartItemID = cartItemID;
        this.numberOfCartItem = numberOfCartItem;
        this.price = price;
    }
}

export default CartItemModel;