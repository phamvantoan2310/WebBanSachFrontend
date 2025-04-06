class BookModel{
    book_id : number;
    book_name?:string;  // ?: có thể null
    description?:string;
    price?:number;
    listed_price?:number;
    number_of_book?:number;
    point?: number;
    author_id?:number;
    quantity_sold?: number;
    publisher?: string;
    publication_year?: Date;
    language?: string;
    content?:string;


    constructor(book_id : number,book_name?:string,description?:string,price?:number,listed_price?:number,number_of_book?:number,point?:number,author_id?:number, quantity_sold?: number, publisher?: string, publication_year?: Date, language?: string, content?:string){
        this.book_id = book_id;
        this.book_name = book_name;
        this.description =description;
        this.price = price;
        this.listed_price = listed_price;
        this.number_of_book = number_of_book;
        this.author_id = author_id;
        this.point = point;
        this.quantity_sold = quantity_sold;
        this.publisher = publisher;
        this.publication_year = publication_year;
        this.language = language;
        this.content = content;
    }
}

export default BookModel;