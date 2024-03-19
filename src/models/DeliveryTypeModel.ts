class DeliveryTypeModel{
    deliveryTypeID: number;
    decription: string;
    deliveryTypeName: string;
    priceOfDeliveryType: number;

    constructor (deliveryTypeID: number, decription: string, deliveryTypeName: string, priceOfDeliveryType: number){
        this.deliveryTypeID = deliveryTypeID;
        this.decription = decription;
        this.deliveryTypeName = deliveryTypeName;
        this.priceOfDeliveryType = priceOfDeliveryType;
    }
}

export default DeliveryTypeModel;