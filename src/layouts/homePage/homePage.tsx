import React from "react";
import Banner from "./component/banner";
import Carousel from "./component/carousel";
import ListBook from "../product/listBook";
import { useParams } from "react-router-dom";

interface homePageInterface{
    bookName: string;
}

const HomePage: React.FC<homePageInterface> = ({bookName}) => {
    const {categoryID} = useParams();
    let maTheLoai = 0;

    try{
        maTheLoai = parseInt(categoryID+'');
    } catch(error){
        console.log(error);
        maTheLoai = 0;
    }

    if(Number.isNaN(maTheLoai)){
        maTheLoai = 0;
    }

    return (
        <div>
            <Banner />
            <Carousel />
            <ListBook bookName={bookName} categoryID={maTheLoai} />
        </div>
    );
}

export default HomePage;