class BookModel{
    book_id : number;
    book_name?:string;  // ?: có thể null
    description?:string;
    price?:number;
    listed_price?:number;
    number_of_book?:number;
    author_id?:number;

    constructor(book_id : number,book_name?:string,description?:string,price?:number,listed_price?:number,number_of_book?:number,author_id?:number,){
        this.book_id = book_id;
        this.book_name = book_name;
        this.description =description;
        this.price = price;
        this.listed_price = listed_price;
        this.number_of_book = number_of_book;
        this.author_id = author_id;
    }
}

export default BookModel;