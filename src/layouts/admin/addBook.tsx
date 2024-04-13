import React, { FormEvent, useEffect, useState } from "react"
import RequireAdmin from "../../util/requireAdmin";
import RequireAdminAndStaff from "../../util/requireAdminAndStaff";
import { getAllCategory } from "../../api/categoryApi";
import CategoryModel from "../../models/CategoryModel";
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
        point: 0,
    })
    // const [dataImages, setDataImages] = useState<File[]>([]);

    const [categorys, setCategorys] = useState<CategoryModel[] | undefined>();
    const [categoryID, setCategoryID] = useState(0);
    const [dataload, setdataload] = useState<boolean>(true);
    const [error, seterror] = useState(null);

    useEffect(()=>{
        getAllCategory().then(
            result=>{
                setCategorys(result);
                setdataload(false);
            }
        ).catch(
            error=>{
                seterror(error);
                setdataload(false);
            }
        )
    },[]);

    const [images, setImages] = useState<image[] | null>(null);
    //set image list để gửi đi
    const setListImage = async(files: File[]) =>{
        const imageList : image [] = [];
        for(let i = 0; i < files.length; i++){
            const fileToBase64 = files[i]? await getBase64(files[i]):null;
            const image: image = {
                imageID: 0,
                imageName: book.bookName,
                imageLink: '',
                data: fileToBase64+'',
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

    const handleChangeCategory = () =>{
        if(categorys){
            const category = document.getElementById("category") as HTMLSelectElement | null;
            if(category && category.value){
                setCategoryID(parseInt(category.value))
            }
        }
    }
    

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        const token = localStorage.getItem('tokenLogin');
        const endpoint: string = "http://localhost:8080/admin/addbook";

        const addBookResponse = {
            book: book,
            images: images,
            categoryID: categoryID
        }
        console.log(addBookResponse);

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
                        point: 0,
                    })
                } else {
                    alert("gặp lỗi trong quá trình thêm sách");
                }
            }
        )
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
        <div className='container row d-flex align-items-center justify-content-center pt-5 mt-5'>
            <div className=''>
                <h1>THÊM SÁCH</h1>
                <form onSubmit={handleSubmit} className='form'>
                    <input
                        type='hidden'
                        id='maSach'
                        value={book.bookID}
                    />

                    <label htmlFor='tenSach'>Tên sách</label>
                    <input
                        className='form-control'
                        type='text'
                        value={book.bookName}
                        onChange={(e) => setBook({ ...book, bookName: e.target.value })}
                        required
                    />

                    <label htmlFor='tenSach'>Thể loại</label>
                    <select className="form-select" id="category" aria-label="Default select example" style={{ color: "orange" }} onChange={handleChangeCategory}>
                        <option value="9">Kéo xuống</option>
                        {categorys?.map((category) => (<option value={category.categoryID}>{category.categoryName}</option>))}
                    </select>

                    <label htmlFor='giaBan'>Giá bán</label>
                    <input
                        className='form-control'
                        type='number'
                        value={book.price}
                        onChange={(e) => setBook({ ...book, price: parseFloat(e.target.value) })}
                        required
                    />

                    <label htmlFor='giaNiemYet'>Giá niêm yết</label>
                    <input
                        className='form-control'
                        type='number'
                        value={book.listedPrice}
                        onChange={(e) => setBook({ ...book, listedPrice: parseFloat(e.target.value) })}
                        required
                    />

                    <label htmlFor='soLuong'>soLuong</label>
                    <input
                        className='form-control'
                        type='number'
                        value={book.numberOfBooks}
                        onChange={(e) => setBook({ ...book, numberOfBooks: parseInt(e.target.value) })}
                        required
                    />

                    <label htmlFor='mota'>Mô tả </label>
                    <input
                        className='form-control'
                        type='text'
                        value={book.decription}
                        onChange={(e) => setBook({ ...book, decription: e.target.value })}
                        required
                    />

                    <label htmlFor='diemDanhGia'>Điểm đánh giá</label>
                    <input
                        className='form-control'
                        type='number'
                        value={book.point}
                        onChange={(e) => setBook({ ...book, point: parseFloat(e.target.value) })}
                        required
                    />
                    <div className="mb-3">
                        <label htmlFor="image" className="form-label">Image</label>
                        <input
                            type="file"
                            multiple
                            id="image"
                            className="form-control"
                            accept="images/*"
                            onChange={handleImageChange}
                        />
                    </div>

                    <button type='submit' className='btn btn-success mt-2'>Lưu</button>
                </form>
            </div>
        </div>
    );
}

const AddBook_AdminStaff = RequireAdminAndStaff(AddBook);

export default AddBook_AdminStaff;