import React, { FormEvent, useEffect, useState } from "react"
import RequireAdmin from "../../util/requireAdmin";
import RequireAdminAndStaff from "../../util/requireAdminAndStaff";
import { getAllCategory } from "../../api/categoryApi";
import CategoryModel from "../../models/CategoryModel";
import { getAllAuthor } from "../../api/authorApi";
import AuthorModel from "../../models/AuthorModel";
import { existByBookName } from "../../api/bookApi";
interface image {
    imageID: number;
    imageName: string;
    imageLink: string;
    data: string;
}

const AddBook: React.FC = (props) => {

    const [book, setBook] = useState({
        bookID: 0,
        bookName: '',
        price: 0,
        listedPrice: 0,
        decription: '',
        numberOfBooks: 0,
        point: 5,
        publisher: '',
        publicationYear: '',
        language: 'Tiếng Việt',
        content: '',

    })
    // const [dataImages, setDataImages] = useState<File[]>([]);

    const [categorys, setCategorys] = useState<CategoryModel[] | undefined>();
    const [authors, setAuthors] = useState<AuthorModel[] | undefined>();
    const [categoryID, setCategoryID] = useState(0);
    const [authorID, setAuthorID] = useState(0);
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);

    useEffect(() => {
        getAllCategory().then(
            result => {
                setCategorys(result);
                setdataload(false);
            }
        ).catch(
            error => {
                seterror(error);
                setdataload(false);
            }
        )
    }, []);

    useEffect(() => {
        getAllAuthor().then(
            result => {
                setAuthors(result);
            }
        ).catch(
            error => {
                seterror(error);
            }
        )
    }, []);

    const [images, setImages] = useState<image[] | null>(null);
    //set image list để gửi đi
    const setListImage = async (files: File[]) => {
        const imageList: image[] = [];
        for (let i = 0; i < files.length; i++) {
            const fileToBase64 = files[i] ? await getBase64(files[i]) : null;
            const image: image = {
                imageID: 0,
                imageName: book.bookName,
                imageLink: '',
                data: fileToBase64 + '',
            };
            imageList.push(image);
        }
        setImages(imageList);
    }

    const getBase64 = (file: File): Promise<string | null> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result ? (reader.result as string).split(',')[1] : null);
            }
            reader.onerror = (error) => reject(error);
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const dataLists: File[] = [];
            for (let i = 0; i < e.target.files.length; i++) {
                dataLists.push(e.target.files[i]);
            }
            // setDataImages(imageLists);
            setListImage(dataLists);
        }
    }

    const handleChangeCategory = () => {
        if (categorys) {
            const category = document.getElementById("category") as HTMLSelectElement | null;
            if (category && category.value) {
                setCategoryID(parseInt(category.value))
            }
        }
    }

    const handleChangeAuthor = () => {
        if (authors) {
            const author = document.getElementById("author") as HTMLSelectElement | null;
            if (author && author.value) {
                setAuthorID(parseInt(author.value))
            }
        }
    }


    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const token = localStorage.getItem('tokenLogin');
        const endpoint: string = "http://localhost:8080/admin/addbook";

        const addBookResponse = {
            book: book,
            images: images,
            categoryID: categoryID,
            authorID: authorID
        }

        const alreadyBook = await existByBookName(book.bookName);
        if (alreadyBook == false) {
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(addBookResponse)
            }).then(
                response => {
                    if (response.ok) {
                        alert("Thêm sách thành công");
                        setBook({
                            bookID: 0,
                            bookName: '',
                            price: 0,
                            listedPrice: 0,
                            decription: '',
                            numberOfBooks: 0,
                            point: 5,
                            publisher: '',
                            publicationYear: '',
                            language: 'Tiếng Việt',
                            content: '',
                        })
                    } else {
                        alert("gặp lỗi trong quá trình thêm sách");
                    }
                }
            )
        } else {
            alert("Tên sách đã tồn tại");
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
        <div className="container pt-5 mt-5">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <h1 className="text-center mb-4" style={{ color: " #8080ff" }}>THÊM SÁCH</h1>
                    <form onSubmit={handleSubmit} className="p-4 rounded shadow-sm" style={{ backgroundColor: " #99ccff" }}>
                        <input
                            type="hidden"
                            id="maSach"
                            value={book.bookID}
                        />

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="tenSach" className="form-label">Tên sách</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={book.bookName}
                                    onChange={(e) => setBook({ ...book, bookName: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="category" className="form-label">Thể loại</label>
                                <select
                                    className="form-select"
                                    id="category"
                                    style={{ color: "orange" }}
                                    onChange={handleChangeCategory}
                                    required
                                >
                                    <option value="9">Chọn thể loại</option>
                                    {categorys?.map((category) => (
                                        <option key={category.categoryID} value={category.categoryID}>
                                            {category.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="giaBan" className="form-label">Giá bán</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    value={book.price}
                                    onChange={(e) => setBook({ ...book, price: parseFloat(e.target.value) })}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="giaNiemYet" className="form-label">Giá niêm yết</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    value={book.listedPrice}
                                    onChange={(e) => setBook({ ...book, listedPrice: parseFloat(e.target.value) })}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="soLuong" className="form-label">Số lượng</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    value={book.numberOfBooks}
                                    onChange={(e) => setBook({ ...book, numberOfBooks: parseInt(e.target.value) })}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="author" className="form-label">Tác giả</label>
                                <select
                                    className="form-select"
                                    id="author"
                                    style={{ color: "orange" }}
                                    onChange={handleChangeAuthor}
                                    required
                                >
                                    <option value="9">Chọn tác giả</option>
                                    {authors?.map((author) => (
                                        <option key={author.author_id} value={author.author_id}>
                                            {author.author_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="nhaXuatBan" className="form-label">Nhà xuất bản</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={book.publisher}
                                    onChange={(e) => setBook({ ...book, publisher: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="namXuatBan" className="form-label">Năm xuất bản</label>
                                <input
                                    className="form-control"
                                    type="date"
                                    onChange={(e) => {
                                        const date = new Date(e.target.value);
                                        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                                        setBook({ ...book, publicationYear: formattedDate });
                                    }}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="mota" className="form-label">Mô tả</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    value={book.decription}
                                    onChange={(e) => setBook({ ...book, decription: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="ngonNgu" className="form-label">Ngôn ngữ</label>
                                <select
                                    className="form-select"
                                    id="ngonNgu"
                                    style={{ color: "orange" }}
                                    onChange={(e) => setBook({ ...book, language: e.target.value })}
                                    required
                                >
                                    <option key={1} value={"Tiếng Việt"}>Tiếng Việt</option>
                                    <option key={2} value={"Tiếng Anh"}>Tiếng Anh</option>
                                    <option key={3} value={"Ngôn ngữ khác"}>Ngôn ngữ khác</option>
                                </select>
                            </div>

                            <div className="col-md-12 mb-3">
                                <label htmlFor="noidung" className="form-label">Nội dung</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    value={book.content}
                                    onChange={(e) => setBook({ ...book, content: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            <div className="col-md-12 mb-4">
                                <label htmlFor="image" className="form-label">Hình ảnh</label>
                                <input
                                    type="file"
                                    multiple
                                    id="image"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>

                        <div className="text-center">
                            <button type="submit" className="btn btn-success">Lưu</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

const AddBook_AdminStaff = RequireAdminAndStaff(AddBook);

export default AddBook_AdminStaff;