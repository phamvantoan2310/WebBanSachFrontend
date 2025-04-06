import React, { useEffect, useState } from "react";
import ImageModel from "../../../models/ImageModel";
import { getImagesByBookId } from "../../../api/imageApi";

interface ImageBookDetailInterface {
    bookID: number;
}

const ImageBookDetail: React.FC<ImageBookDetailInterface> = (props) => {
    const bookID: number = props.bookID;

    const [selectedImage, setSelectedImage] = useState<ImageModel | null>(null);
    const [imagelist, setImageList] = useState<ImageModel[]>([]);
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);

    const chooseImage = (image: ImageModel) => {
        setSelectedImage(image);
    }

    useEffect(() => {
        getImagesByBookId(bookID).then(
            listImage => {
                setImageList(listImage);
                setdataload(false);
                if (listImage.length > 0) {
                    setSelectedImage(listImage[0]);
                }
            }
        ).catch(
            error => {
                seterror(error);
                setdataload(false);
            }
        )
    }, [bookID])

    if (dataload) {
        return (
            <div>
                <h1>Đang tải dữ liệu</h1>
            </div>
        );
    }


    if (error) {
        return (
            <div>
                <h1>Gặp lỗi: {error}</h1>
            </div>
        );
    }

    let images: ImageModel[] = [];
    
    return (
        <div className="row card-body" style={{backgroundColor:" white",border:"1px solid #d6c2c2", borderRadius:"5px", padding:"10px"}}>
            <div>
                {(selectedImage) && <img src={"data:image/png;base64,"+selectedImage.data} style={{height:"500px", marginBottom:"10px", width:'300px'}}/>}
            </div>
            <div className="row mt-2">
                {
                    imagelist.map((hinhAnh, index) => (
                        <div className={"col-2"} key={index}>
                            <img onClick={() => chooseImage(hinhAnh)} src={"data:image/png;base64,"+hinhAnh.data} style={{ width: '50px' }} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ImageBookDetail;