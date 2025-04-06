import React, { useEffect, useState } from "react";
import { getRevenueByRevenueDate } from "../../../api/revenueApi";
import Format from "../../../util/ToLocaleString";
import RequireAdmin from "../../../util/requireAdmin";
import OrderModel from "../../../models/OrderModel";
import OrderItemModel from "../../../models/OrderItemModel";
import { getOrderItem } from "../../../api/orderApi";
import BookModel from "../../../models/BookModel";
import { getBookByOrderItemID } from "../../../api/bookApi";
import { Link, useNavigate } from "react-router-dom";

const RevenueAdmin: React.FC = () => {
    const token = localStorage.getItem("tokenLogin");
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState("");
    const [orders, setOrders] = useState<OrderModel[] | undefined>()

    const [revenue, setRevenue] = useState<number>(0);
    const [sales, setSales] = useState<number>(0);

    const [orderItems, setOrderItems] = useState<OrderItemModel[] | undefined>([]);
    const [soldBooks, setSoldBook] = useState<Map<number, { book: BookModel; totalSold: number; price: number }>>()

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token || !selectedDate?.trim()) {
                setOrders([]);
                return;
            }

            try {
                const result = await getRevenueByRevenueDate(token, selectedDate);
                console.log("API Response:", result);

                if (result && result.length > 0) {
                    setOrders([...result]); // Luôn tạo một mảng mới để kích hoạt re-render
                } else {
                    setOrders([]);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
                setOrders([]);
            }
        };

        fetchOrders(); // Gọi hàm async bên trong useEffect

    }, [selectedDate, token]); // Thêm token vào dependency để đảm bảo dữ liệu luôn được cập nhật đúng

    useEffect(() => {
        const getRevenue = () => {
            let revenue: number = 0;
            orders?.forEach(order => {
                revenue += order.totalPrice;
            })
            setRevenue(revenue);
        }

        const getSales = async () => {
            let sales: number = 0;
            if (token && orders) {
                try {
                    const allOrderItems = await Promise.all(
                        orders.map(order => getOrderItem(order.orderID, token))
                    );

                    // Hợp nhất tất cả orderItems từ các đơn hàng
                    const mergedOrderItems = allOrderItems.flat().filter((item): item is OrderItemModel => item !== undefined);
                    setOrderItems(mergedOrderItems);

                    // Tính tổng số lượng từ orderItems
                    mergedOrderItems.forEach(orderItem => {
                        if (orderItem) {
                            sales += orderItem.numberOfOrderItem;
                        }
                    });

                    setSales(sales);
                } catch (error) {
                    console.error("Lỗi khi lấy orderItems:", error);
                }
            }
        };

        getRevenue();
        getSales();
    }, [orders])


    useEffect(() => {  //lấy danh sách các cuốn sách đã được mua và số lượng đã bán
        const getAllBooks = async () => {
            const bookMap = new Map<number, { book: BookModel; totalSold: number; price: number }>();

            if (token && orderItems) {
                try {
                    for (const orderItem of orderItems) {
                        const book: BookModel | null = await getBookByOrderItemID(orderItem.orderItemID, token);
                        if (book != null) {
                            if (bookMap.has(book.book_id)) {
                                // Nếu sách đã tồn tại, cộng dồn số lượng
                                const existing = bookMap.get(book.book_id)!;
                                existing.totalSold += orderItem.numberOfOrderItem;
                                existing.price += orderItem.price;
                            } else {
                                // Nếu chưa có, thêm vào Map
                                bookMap.set(book.book_id, { book, totalSold: orderItem.numberOfOrderItem, price: orderItem.price });
                            }
                        }
                    }
                    console.log("Danh sách sách đã bán: ", Array.from(bookMap.values()))
                    setSoldBook(bookMap);
                } catch (error) {
                    console.error("Lỗi khi lấy thông tin sách: ", error);
                }
            }
        };
        getAllBooks();
    }, [token, orderItems]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = new Date(e.target.value);
        const today = new Date();

        // Đặt thời gian về 00:00:00 để so sánh chính xác
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            alert("Không thể chọn ngày trong tương lai!");
            e.target.value = ""; // Reset input nếu chọn sai
            return;
        }

        // Định dạng lại ngày (YYYY-MM-DD)
        const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
        setSelectedDate(formattedDate);
    };

    return (
        <div className="container mt-5 pt-5">
            <h1 className="text-start">Doanh thu theo ngày</h1>
            <hr />
            <div className="d-flex mt-5 mb-5" style={{ marginLeft: "800px" }}>
                <input className="form-control" type="date" style={{ width: "500px", border: "1px solid violet" }} onChange={handleDateChange}
                ></input>
            </div>
            <hr />

            <div className="row">
                <div className="container col-md-6" >
                    <div >
                        <h3 className="text-start" style={{ color: "gray", marginLeft: "20px" }}>Doanh thu theo ngày: {Format(revenue)} đ</h3>
                    </div>
                    <div className="mt-5" >
                        <h3 className="text-start" style={{ color: "gray", marginLeft: "20px" }}>Doanh số theo ngày: {sales}</h3>
                    </div>
                </div>
                <div className="col-md-6 container" style={{ border: "1px solid blue", borderRadius: "10px", height: "500px" }}>
                    <div className="overflow-auto" style={{ maxHeight: "490px", maxWidth: "750px" }}>
                        {Array.from(soldBooks?.values() || []).length == 0 && <h4>Không tìm thấy dữ liệu!</h4>}
                        {/* chuyển value của map thành Array */}
                        {Array.from(soldBooks?.values() || []).map((soldBook, index) => (
                            <div key={index} className="container row mt-3" style={{ backgroundColor: "white", border: "1px solid #8D6F64", borderRadius: "10px", width: "660px" }}>
                                <div className="col-md-5">
                                    <p>Mã sách: {soldBook.book.book_id}</p>
                                    <Link to={`/staff/changebookinformation/${soldBook.book.book_id}`} style={{ textDecoration: "none" }}>
                                        <p>Tên sách: {soldBook.book.book_name}</p>
                                    </Link>
                                </div>
                                <div className="col-md-4">
                                    <p style={{ color: " #660033" }}>Số lượng đã bán: {soldBook.totalSold}</p>
                                    <p style={{ color: " #009900" }}>Số lượng trong kho: {soldBook.book.number_of_book}</p>
                                </div>
                                <div className="col-md-3">
                                    <p style={{ color: " #660033" }}>Doanh thu: {Format(soldBook.price)}đ</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const Revenue = RequireAdmin(RevenueAdmin);
export default Revenue;