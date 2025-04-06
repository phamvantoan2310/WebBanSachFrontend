import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import BookModel from "../../../models/BookModel";
import { getABook } from "../../../api/bookApi";
import { createBill, deleteBill, getAllBills } from "../../../api/billApi";
import BillModel from "../../../models/BillModel";
import { Link, useNavigate } from "react-router-dom";
import Format from "../../../util/ToLocaleString";
import BillItemModel from "../../../models/BillItemModel";
import RequireAdmin from "../../../util/requireAdmin";

interface JwtPayload {
    isUser: boolean;
    isStaff: boolean;
    isAdmin: boolean;
}

interface BillItem {
    bookID: number;
    numberOfBooks: number;
    importPrice: number;
}

const BillAdmin: React.FC = () => {
    const token = localStorage.getItem("tokenLogin");
    const navigate = useNavigate();

    const [bills, setBills] = useState<BillModel[] | undefined>([]);
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);

    const [adminCondition, setAdminCondition] = useState<boolean>(false);
    const [createBillCondition, setCreateBillCondition] = useState<boolean>(false);
    const [addBookCondition, setAddBookCondition] = useState<boolean>(false);

    const [totalPrice, setTotalPrice] = useState<number>();
    const [creationDate, setCreationDate] = useState<string>();
    const [suppliers, setSuppliers] = useState<string>();
    const [suppliersAddress, setSuppliersAddress] = useState<string>();
    const [suppliersPhoneNumber, setSuppliersPhoneNumber] = useState<string>();
    const [suppliersTax, setSuppliersTax] = useState<string>();

    const [bookID, setBookID] = useState<number>();
    const [book, setBook] = useState<BookModel | null>();
    const [importPrice, setImportPrice] = useState<number>(0);

    const [numberOfBooks, setNumberOfBook] = useState<number>(0);
    const [books, setBooks] = useState<BookModel[]>([]);
    const [billItemsWantToAdd, setBillItemsWantToAdd] = useState<BillItem[]>([]);

    useEffect(() => {
        if (token) {
            const decodeToken = jwtDecode(token) as JwtPayload;
            const isAdmin = decodeToken.isAdmin;
            setAdminCondition(isAdmin);
        }
    }, [])

    useEffect(() => {
        if (token) {
            getAllBills(token).then(
                result => {
                    setBills(result);
                    setdataload(false);
                }
            ).catch(
                error => {
                    seterror(error);
                    console.log(error);
                }
            )
        }
    }, [token])

    useEffect(() => {
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        setCreationDate(formattedDate);
    }, []);

    const handleSearch = () => {
        if (bookID) {
            getABook(bookID).then(
                result => {
                    setBook(result);
                    setAddBookCondition(true);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            )
        }
    }

    const handleAddBook = () => {
        if (book?.book_id && numberOfBooks && importPrice) {
            const bookID = book.book_id;
            const newBillItem: BillItem = { bookID, numberOfBooks, importPrice };
            setBooks([...books, book]);
            setBillItemsWantToAdd([...billItemsWantToAdd, newBillItem]);
        } else {
            alert("chưa nhập đủ thông tin sách");
        }
    }

    useEffect(() => {
        let Price: number = 0;
        billItemsWantToAdd.forEach(billItem => {
            Price += billItem.importPrice * billItem.numberOfBooks;
        });
        setTotalPrice(Price);
    }, [billItemsWantToAdd])


    const handleRemoveBook = (bookID: number) => {
        setBillItemsWantToAdd((billItems) => billItems.filter(item => item.bookID !== bookID));
        setBooks((books) => books.filter(item => item.book_id !== bookID));
    };



    const handleCreateBill = () => {
        if (token && totalPrice && creationDate && suppliers && suppliersAddress && suppliersPhoneNumber && suppliersTax) {
            createBill(totalPrice, creationDate, suppliers, suppliersAddress, suppliersPhoneNumber, suppliersTax, billItemsWantToAdd, token).then(
                response => {
                    if (response.ok) {
                        alert("tạo hóa đơn thành công");
                        navigate(0);
                    }
                }
            ).then(
                error => {
                    console.log(error);
                }
            )
        } else {
            alert("chưa nhập đủ thông tin")
        }
    }

    const handleDeleteBill = (billID: number) => {
        const confirmDeleteBill = window.confirm("Xác nhận xóa hóa đơn?");
        if (confirmDeleteBill) {
            if (token && billID) {
                deleteBill(billID, token).then(
                    result => {
                        alert("Xóa hóa đơn thành công");
                        navigate(0);
                    }
                ).catch(
                    error => {
                        alert("xóa hóa đơn thất bại");
                        console.log(error);
                    }
                )
            }
        }
    }

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
        <div className="container mt-5 pt-5">
            <div className="row">
                <div className="col-md-6">
                    <h1 className="text-start mt-5">Hóa đơn nhập hàng</h1>
                </div>
                <div className="col-md-6">
                    {adminCondition && <button className="btn btn-primary" style={{ marginTop: "70px", marginLeft: "500px" }} onClick={() => setCreateBillCondition(true)}>Tạo hóa đơn</button>}
                </div>
            </div>
            <hr />
            <div className="row">
                {bills && bills.map(bill =>
                (
                    <div className="container mt-5 row col-md-5" style={{ backgroundColor: "lightgray", border: "1px solid #44D62C", borderRadius: "10px", width: "600px", marginRight: "25px", marginLeft: "25px" }}>
                        <Link to={`/admin/billdetail/${bill.billID}`} className="text-end">
                            <i className="fa fa-edit" style={{ color: "red", marginRight: "-20px" }} aria-hidden="true"></i>
                        </Link>
                        <div className="col-md-6">
                            <h3 className="text-start" style={{ color: "gray" }}>Mã hóa đơn: {bill.billID}</h3>
                            <h6 className="text-start d-flex mt-2">Ngày tạo:<p style={{ color: "blueviolet", marginLeft: "10px" }}>{bill.creationDate}</p></h6>
                            <h6 className="text-start d-flex">Khách hàng:<p style={{ color: "blueviolet", marginLeft: "10px" }}>{bill.customer}</p></h6>
                            <h5 className="text-start mt-3 d-flex">Tổng giá trị:<p style={{ color: "red", marginLeft: "10px" }}>{Format(bill.totalPrice)} đ</p></h5>
                        </div>
                        <div className="col-md-6">
                            <h5 className="text-start d-flex mt-1">Nhà cung cấp:<p style={{ color: "blueviolet", marginLeft: "10px" }}>{bill.suppliers}</p></h5>
                            <h6 className="text-start d-flex mt-1">Số điện thoại:<p style={{ color: "blueviolet", marginLeft: "10px" }}>{bill.suppliersPhoneNumber}</p></h6>
                            <h6 className="text-start d-flex mt-1">Địa chỉ:<p style={{ color: "blueviolet", marginLeft: "10px" }}>{bill.suppliersAddress}</p></h6>
                            <h6 className="text-start d-flex mt-1">Mã số thuế:<p style={{ color: "blueviolet", marginLeft: "10px" }}>{bill.suppliersTax}</p></h6>
                        </div>
                        <div className="text-end mb-3">
                            {adminCondition && <button className="btn btn-danger w-25" onClick={() => handleDeleteBill(bill.billID)}>Xóa hóa đơn</button>}
                        </div>
                    </div>
                ))}
            </div>

            {createBillCondition && <div className="container fixed-top p-4 shadow-lg bg-white rounded" style={{ marginTop: "100px", maxWidth: "900px" }}>
                <button className="btn btn-danger position-absolute top-0 end-0 m-3" onClick={() => (setCreateBillCondition(false), setAddBookCondition(false))}>X</button>
                <h3 className="text-center text-primary">Tạo hóa đơn</h3>

                <div className="row">
                    {/* Thông tin hóa đơn */}
                    <div className="col-md-7 p-4 bg-light border border-primary rounded">
                        <h5 className="text-start">Ngày tạo hóa đơn</h5>
                        <input className="form-control mb-3" type="date" value={creationDate} readOnly />

                        <h5 className="text-start text-danger">Tổng giá trị hóa đơn</h5>
                        <input className="form-control mb-3" type="number" placeholder="Tổng giá trị hóa đơn" value={totalPrice} onChange={(e) => setTotalPrice(Number(e.target.value))} />

                        <hr />
                        <h5 className="text-start text-primary">Nhà cung cấp</h5>
                        <div className="row">
                            <div className="col-md-6">
                                <label className="form-label">Tên</label>
                                <input className="form-control" type="text" placeholder="Tên nhà cung cấp" value={suppliers} onChange={(e) => setSuppliers(e.target.value)} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Số điện thoại</label>
                                <input className="form-control" type="number" placeholder="Số điện thoại" value={suppliersPhoneNumber} onChange={(e) => setSuppliersPhoneNumber(e.target.value)} />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-6">
                                <label className="form-label">Địa chỉ</label>
                                <input className="form-control" type="text" placeholder="Địa chỉ nhà cung cấp" value={suppliersAddress} onChange={(e) => setSuppliersAddress(e.target.value)} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Mã số thuế</label>
                                <input className="form-control" type="text" placeholder="Mã số thuế" value={suppliersTax} onChange={(e) => setSuppliersTax(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Thông tin sách */}
                    <div className="col-md-5 p-4 bg-light border border-primary rounded">
                        <div className="input-group mb-3">
                            <input className="form-control" type="number" placeholder="Nhập mã sách" value={bookID} onChange={(e) => setBookID(Number(e.target.value))} />
                            <button className="btn btn-success" onClick={handleSearch}>Tìm</button>
                        </div>
                        <div className="border rounded mt-3 p-2 bg-white overflow-auto" style={{ height: "350px" }}>
                            {books.map(book => (
                                <div className="d-flex justify-content-between align-items-center border-bottom p-2">
                                    <span className="text-primary">ID: {book.book_id}</span>
                                    <span>{book.book_name}</span>
                                    <button className="btn btn-sm" style={{ color: "red" }} onClick={() => handleRemoveBook(book.book_id)}>X</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <button className="btn btn-primary w-100 mt-4" onClick={handleCreateBill}>Tạo hóa đơn</button>
            </div>}

            {addBookCondition && <div className="container fixed-top p-4 shadow-lg bg-white rounded" style={{ marginTop: "200px", maxWidth: "700px" }}>
                <button className="btn btn-danger position-absolute top-0 end-0 m-3" onClick={() => setAddBookCondition(false)}>X</button>
                <h3 className="text-center text-success">{book?.book_name}</h3>
                <h5 className="text-start">Mã sách: {book?.book_id}</h5>
                <p className="text-start">Số lượng:</p>
                <input className="form-control" placeholder="Số lượng" type="number" value={numberOfBooks} onChange={(e) => setNumberOfBook(Number(e.target.value))}></input>
                <p className="text-start mt-3">Giá nhập:</p>
                <input className="form-control" placeholder="Giá nhập" type="number" value={importPrice} onChange={(e) => setImportPrice(Number(e.target.value))}></input>


                <button className="btn btn-success w-25 mt-4" onClick={() => (handleAddBook(), setAddBookCondition(false))}>Thêm</button>
            </div>}
        </div>
    );
}

const Bill = RequireAdmin(BillAdmin);
export default Bill;
