import { jwtDecode } from "jwt-decode";
import UserModel from "../models/UserModel";
import { my_request } from "./request";

async function getUser(endpoint: string): Promise<UserModel[]> {
    const result: UserModel[] = [];

    const response = await my_request(endpoint); //gọi endpoint lấy kết quả dạng json 

    const responseData = response._embedded.users; //lấy danh sách từ kết quả vừa lấy

    for (const key in responseData) {                //nhập user vào dãy
        result.push({
            user_id: responseData[key].userID,
            password: responseData[key].password,
            user_name: responseData[key].userName,
            birthday: responseData[key].birthday,
            email: responseData[key].email,
            address: responseData[key].address,
            phone_number: responseData[key].phoneNumber,
            sex: responseData[key].sex
        });
    }

    return result;
}

export async function getAUserByEvaluateID(evaluateID: number): Promise<UserModel | null> {
    const endpoint: string = `http://localhost:8080/evaluates/${evaluateID}/user`;
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error("fail call API getAUser");
        }
        const responseData = await response.json(); //gọi endpoint lấy kết quả dạng json 

        if (responseData) {
            return {
                user_id: responseData.userID,
                password: responseData.password,
                user_name: responseData.userName,
                birthday: responseData.birthday,
                email: responseData.email,
                address: responseData.address,
                phone_number: responseData.phoneNumber,
                sex: responseData.sex,
                avatar: responseData.avatar,
            }
        } else {
            throw new Error("Author andefined");
        }
    } catch (error) {
        console.error("ERROR: " + error);
        return null;
    }
}

export async function existByUserName(username: string) {
    const endpoint = `http://localhost:8080/users/search/existsByUserName?userName=${username}`;
    try {
        const response = await fetch(endpoint);
        const result = response.json();
        return result;
    } catch (error) {
        console.log("error: " + error);
    }
}

export async function existByEmail(email: string) {
    const endpoint = `http://localhost:8080/users/search/existsByEmail?email=${email}`;
    try {
        const response = await fetch(endpoint);
        const result = await response.json();
        return result;
    } catch (error) {
        console.log("error: " + error);
    }
}

export async function getAUser(token: string): Promise<UserModel | null> {
    const userdata = jwtDecode(token);
    const userID = userdata.jti;

    const endpoint: string = `http://localhost:8080/users/${userID}`;
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error("fail call API getAUser");
        }
        const responseData = await response.json(); //gọi endpoint lấy kết quả dạng json 

        if (responseData) {
            return {
                user_id: responseData.userID,
                password: responseData.password,
                user_name: responseData.userName,
                birthday: responseData.birthday,
                email: responseData.email,
                address: responseData.address,
                phone_number: responseData.phoneNumber,
                sex: responseData.sex,
                avatar: responseData.avatar,
            }
        } else {
            throw new Error("Author andefined");
        }
    } catch (error) {
        console.error("ERROR: " + error);
        return null;
    }
}

