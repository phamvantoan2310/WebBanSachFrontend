import React from "react";
import Banner from "./component/banner";
import Carousel from "./component/carousel";
import ListBook from "../product/listBook";

interface homePageInterface{
    bookName: string;
}

const HomePage: React.FC<homePageInterface> = ({bookName}) => {
    return (
        <div>
            <Banner />
            <Carousel />
            <ListBook bookName={bookName} />
        </div>
    );
}

export default HomePage;