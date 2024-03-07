import React from "react";

interface paginationInterface {
    currentPage: number;
    totalPages: number;
    paginationMethod: any;
}

const Pagination: React.FC<paginationInterface> = (props) => {
    const paginations: number[] = [];

    if (props.currentPage === 1) {                   //kh trang hiện tại bằng 1, push trang 2, 3
        paginations.push(props.currentPage);
        if (props.totalPages >= props.currentPage + 1) {
            paginations.push(props.currentPage + 1);
        }
        if (props.totalPages >= props.currentPage + 2) {
            paginations.push(props.currentPage + 2);
        }
    } else if (props.currentPage > 1) {           //trang hiện tại lớn hơn 1 thì push hai trang phía trước và hai trang phía sau
        if (props.currentPage > 2) {
            paginations.push(props.currentPage - 2);
        }
        if (props.currentPage > 1) {
            paginations.push(props.currentPage - 1);
        }
        paginations.push(props.currentPage);
        if (props.totalPages >= props.currentPage + 1) {
            paginations.push(props.currentPage + 1);
        }
        if (props.totalPages >= props.currentPage + 2) {
            paginations.push(props.currentPage + 2);
        }
    }
    return (
        <div style={{ marginTop: "30px", paddingLeft:"500px"}}>
            <nav aria-label="...">
                <ul className="pagination">
                    <li className="page-item" onClick={() => props.paginationMethod(1)}>
                        <button className="page-link" >
                            Trang Đầu
                        </button>
                    </li>
                    {
                        paginations.map(page => (
                            <li className="page-item" key={page} onClick={() => props.paginationMethod(page)}>
                                <button className={"page-link " + (props.currentPage === page ? "active" : "")}>
                                    {page}
                                </button>
                            </li>
                        ))
                    }
                    <li className="page-item" onClick={() => props.paginationMethod(props.totalPages)}>
                        <button className="page-link" >
                            Trang Cuối
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Pagination;