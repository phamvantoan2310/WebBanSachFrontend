import React, { useEffect, useState } from "react";
import EvaluateModel from "../../../models/EvaluateModel";
import { getEvaluateByBookID } from "../../../api/evaluateApi";
import UserEvaluate from "./UserEValuate";
import RenderRating from "../../../util/RenderRating";

interface EvaluateInterface {
    bookID: number;
}

const Evaluate: React.FC<EvaluateInterface> = (props) => {

    const bookID: number = props.bookID;

    const [evaluates, setEvaluates] = useState<EvaluateModel[]>([]);
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);

    useEffect(() => {
        getEvaluateByBookID(bookID).then(
            result => {
                setEvaluates(result);
                setdataload(false);
            }
        ).catch(
            Error => {
                seterror(Error);
                setdataload(false);
            }
        )
    }, [])

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


    return (
        <div className="container">
            {
                evaluates.map((danhgia, index) => (
                    <div className="row mt-4 mb-4" key={index}>
                        <div className="col-4">
                            <UserEvaluate key={danhgia.evaluate_id} evaluateID={danhgia.evaluate_id} />
                        </div>

                        <div className="col-8 text-start">
                            <p>Đánh giá: {danhgia.decription} </p>
                            <p>Xếp hạng: {RenderRating(danhgia.point?danhgia.point:0)} </p>
                        </div>
                        <br/>
                    </div>
                ))
            }
        </div>
    );
}

export default Evaluate;