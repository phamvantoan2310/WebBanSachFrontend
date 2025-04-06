import React from "react";

function Footer(){
    return(
        <div className="container">
            <footer className="py-5">
                <div className="row">
                    <div className="col-6 col-md-3 mb-3">
                        <ul className="nav flex-column ">
                            <li className="nav-item mb-2"><a href="/" className="nav-link p-0">Trang chủ</a></li>
                            <li className="nav-item mb-2"><a href="/about" className="nav-link p-0 text-body-secondary">Chúng tôi</a></li>
                            <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-body-secondary">Sản phẩm</a></li>
                            <li className="nav-item mb-2"><a href="https://github.com/phamvantoan2310" className="nav-link p-0 text-body-secondary">Kết nối với chúng tôi</a></li>
                            <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-body-secondary">Bản quyền</a></li>
                        </ul>
                    </div>

                    <div className="col-6 col-md-1 mb-3">
                        
                    </div>

                    <div className="col-6 col-md-2 mb-3">
                        
                    </div>

                    <div className="col-md-5 offset-md-1 mb-3">
                        <form>
                            <h5>Subscribe to our newsletter</h5>
                            <p>Monthly digest of what's new and exciting from us.</p>
                            <div className="d-flex flex-column flex-sm-row w-100 gap-2">
                                <label  className="visually-hidden">Email address</label>
                                <input id="newsletter1" type="text" className="form-control" placeholder="Email address"/>
                                    <button className="btn btn-primary" type="button">Subscribe</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
                    <p style={{marginLeft:"500px"}}>&copy; 2025 Company, Inc. All rights reserved.</p>
                    <ul className="list-unstyled d-flex">
                        <li className="ms-3"><a className="link-body-emphasis" href="#"> <i className="fas fa-tweeter"></i></a></li>
                        <li className="ms-3"><a className="link-body-emphasis" href="#"> <i className="fas fa-instagram"></i></a></li>
                        <li className="ms-3"><a className="link-body-emphasis" href="#"> <i className="fas fa-facebook"></i></a></li>
                    </ul>
                </div>
            </footer>
        </div>
    );
}
export default Footer;