class PaymentModel{
    paymentID: number;
    decription: string;
    paymentName: string;
    priceOfPayment: number;

    constructor(paymentID: number, decription: string, paymentName: string, priceOfPayment: number){
        this.paymentID = paymentID;
        this.decription = decription;
        this.paymentName = paymentName;
        this.priceOfPayment = priceOfPayment;
    }
}

export default PaymentModel;