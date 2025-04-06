import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BillModel from "../../../models/BillModel";
import BillItemModel from "../../../models/BillItemModel";
import { getAllBillItemByBillID, getBillByBillID } from "../../../api/billApi";
import { AuditOutlined, HomeOutlined, PhoneOutlined } from "@ant-design/icons";
import BookInBillDetail from "./bookInBillDetail";

const BillDetail: React.FC = () => {
    const token = localStorage.getItem("tokenLogin");
    const { billID } = useParams();
    let billIDOk = 0;
    try {
        billIDOk = parseInt(billID + '');
        if (isNaN(billIDOk)) {
            billIDOk = 0;
        }
    } catch (error) {
        console.log(error);
        billIDOk = 0;
    }

    const [bill, setBill] = useState<BillModel | null>();
    const [billItems, setBillItems] = useState<BillItemModel[] | undefined>([]);
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);

    useEffect(() => {
        if (token) {
            getBillByBillID(token, billIDOk).then(
                result => {
                    setBill(result);
                    setdataload(false);
                }
            ).catch(
                error => {
                    seterror(error);
                }
            )
        }
    }, [billIDOk])

    useEffect(() => {
        if (token) {
            getAllBillItemByBillID(token, billIDOk).then(
                result => {
                    setBillItems(result);
                }
            ).catch(
                error => {
                    seterror(error);
                }
            )
        }
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
        <div className="container row" style={{ marginLeft: "80px" }}>
            <h1 className="text-start mt-5 pt-5">Quản lý hóa đơn</h1>
            <hr className="mb-5" />
            <div className="col-md-5">
                <h3 className="text-start" style={{ color: " #060270" }}>Mã hóa đơn: {bill?.billID}</h3>
                <h5 className="text-start mt-4" style={{ color: "GrayText" }}>Ngày lập: {bill?.creationDate}</h5>
                <div className="row mt-4">
                    <div className="col-md-6 text-start">
                        <h6 className="d-flex">Khách hàng: <p style={{ marginLeft: "10px" }}>{bill?.customer}</p></h6>
                        <p><PhoneOutlined style={{ color: "green" }} />: {bill?.customerPhoneNumber}</p>
                        <p><HomeOutlined style={{ color: "red" }} /> {bill?.customerAddress}</p>
                        <p><AuditOutlined /> {bill?.customerTax}</p>

                    </div>
                    <div className="col-md-6 text-start">
                        <h6 className="d-flex">Nhà cung cấp: <p style={{ marginLeft: "10px" }}>{bill?.suppliers}</p></h6>
                        <p><PhoneOutlined style={{ color: "green" }} />: {bill?.suppliersPhoneNumber}</p>
                        <p><HomeOutlined style={{ color: "red" }} /> {bill?.suppliersAddress}</p>
                        <p><AuditOutlined /> {bill?.suppliersTax}</p>
                    </div>
                </div>
            </div>
            <div className="col-md-7 overflow-auto" style={{ backgroundColor: " #E2EAF4", borderLeft: "1px solid #060270", height: "350px" }}>
                {billItems?.map((billItem) => (
                    <BookInBillDetail billItem={billItem} />
                ))}
            </div>
        </div>
    )
}

export default BillDetail;