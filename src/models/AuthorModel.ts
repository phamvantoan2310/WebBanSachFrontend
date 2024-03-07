class AuthorModel{
    author_id: number;
    author_name?: string;
    birthday?:Date;
    decription?: string;

    constructor(author_id: number, author_name?: string, birthday?:Date, decription?: string){
        this.author_id= author_id;
        this.author_name = author_name;
        this.birthday = birthday;
        this.decription = decription;
    }
}

export default AuthorModel;