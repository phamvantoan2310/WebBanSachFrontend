class ImageModel{
    image_id: number;
    data?: string;
    image_link?: string;
    image_name?: string;

    constructor(image_id: number,data: string,image_link: string,image_name: string,){
        this.image_id=image_id;
        this.data=data;
        this.image_link=image_link;
        this.image_name=image_name;
    }
}

export default ImageModel;