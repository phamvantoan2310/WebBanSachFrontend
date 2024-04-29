import React, { useEffect, useState } from "react";
import RevenueModel from "../../../models/RevenueModel";
import { getRevenueByRevenueDate } from "../../../api/revenueApi";
import Format from "../../../util/ToLocaleString";
import { getOrderByDeliveryOrder } from "../../../api/orderApi";
import OrderModel from "../../../models/OrderModel";
import { error } from "console";
import RequireAdmin from "../../../util/requireAdmin";

const RevenueAdmin: React.FC = () => {
    const token = localStorage.getItem("tokenLogin");

    const [revenue, setRevenue] = useState<RevenueModel>();

    const [revenueDate, setRevenueDate] = useState("");

    const handleSearchRevenue = () => {
        if (token) {
            getRevenueByRevenueDate(token, revenueDate).then(
                result => {
                    setRevenue(result);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }


    return (
        <div className="container mt-5 pt-5">
            <h1 className="text-start">Doanh thu</h1>
            <hr />
            <div className="d-flex mt-5 mb-5">
                <input className="form-control" type="date" style={{ width: "1500px", border: "1px solid violet" }} onChange={(e) => setRevenueDate(e.target.value)}></input>
                <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={handleSearchRevenue}>Tìm kiếm</button>
            </div>
            <hr />

            <div className="container row mt-5" style={{ border: "1px solid blue", borderRadius: "10px",marginLeft:"0px", width:"50%" }}>
                <div className="col-md-8">
                    <h1 className="text-start" style={{color:"gray"}}>Doanh thu: {Format(revenue?.totalRevenue)} đ</h1>
                </div>
                <div className="col-md-4 mt-2">
                </div>
            </div>
        </div>
    );
}

const Revenue = RequireAdmin(RevenueAdmin);
export default Revenue;