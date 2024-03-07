class UserModel{
    user_id: number;
    user_name?: string;
    password?: string;
    address?: string;
    birthday?: Date;
    email?: string;
    phone_number?: string;
    sex?: boolean;

    constructor(user_id: number, user_name?: string, password?: string, address?: string, birthday?: Date, email?: string, phone_number?: string, sex?: boolean){
        this.user_id = user_id;
        this.user_name = user_name;
        this.password = password;
        this.address =address;
        this.birthday = birthday;
        this.email = email;
        this.phone_number = phone_number;
        this.sex = sex;
    }
}
export default UserModel;