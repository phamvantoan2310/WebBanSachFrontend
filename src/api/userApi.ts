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
                account_status: responseData.accountStatus,
            }
        } else {
            throw new Error("user undefined");
        }
    } catch (error) {
        console.error("ERROR: " + error);
        return null;
    }
}

export async function getUserByReportID(token: string, reportID: number) {
    const endpoint = `http://localhost:8080/reports/${reportID}/user`;
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("fail call api getUserByReportID");
        }
        const responseData = await response.json();

        if (responseData) {
            return ({
                user_id: responseData.userID,
                password: responseData.password,
                user_name: responseData.userName,
                birthday: responseData.birthday,
                email: responseData.email,
                address: responseData.address,
                phone_number: responseData.phoneNumber,
                sex: responseData.sex,
                avatar: responseData.avatar,
            });
        } else {
            throw new Error("user undefined");
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getUserByRoleID(token: string, roleID: number) {
    const endpoint = `http://localhost:8080/users/search/findByRoleList_RoleID?roleID=${roleID}&size=12&page=0`;
    const users: UserModel[] = [];
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("fail call api getUserByRoleID");
        }
        const responseData = await response.json();
        const data = responseData._embedded.users;

        for (const user of data) {
            users.push({
                user_id: user.userID,
                password: user.password,
                user_name: user.userName,
                birthday: user.birthday,
                email: user.email,
                address: user.address,
                phone_number: user.phoneNumber,
                sex: user.sex,
                avatar: user.avatar,
            });
        }
        return users;
    } catch (error) {
        console.log(error);
    }
}

export async function getUserByUserID(token: string, userID: number): Promise<UserModel | null> {
    const endpoint: string = `http://localhost:8080/users/${userID}`;
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("fail call API getUserByUserID");
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
            throw new Error("user andefined");
        }
    } catch (error) {
        console.error("ERROR: " + error);
        return null;
    }
}

export async function staffUpdateUser(token: string, userID: number, userName: string, password: string, email: string, phoneNumber: string, sex: boolean, address: string, avatar: string) {
    const endpoint = "http://localhost:8080/staff/updateuser";
    try {
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                userID: userID,
                userName: userName,
                password: password,
                email: email,
                phoneNumber: phoneNumber,
                sex: sex,
                address: address,
                avatar: avatar,
            })
        });

        if (!response.ok) {
            throw new Error("fail call api staffUpdateUser");
        }

        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function getUserByUserNameContainingAndRoleID(token: string, userName: string, roleID: number) {
    const endpoint = `http://localhost:8080/users/search/findByUserNameContainingAndRoleList_RoleID?userName=${userName}&roleID=${roleID}`;
    const users: UserModel[] = [];
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("fail call api getUserByUserNameContaining");
        }
        const responseData = await response.json();
        const data = responseData._embedded.users;
        for (const userData of data) {
            users.push({
                user_id: userData.userID,
                password: userData.password,
                user_name: userData.userName,
                birthday: userData.birthday,
                email: userData.email,
                address: userData.address,
                phone_number: userData.phoneNumber,
                sex: userData.sex,
                avatar: userData.avatar,
            });
        }

        return users;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteUser(token: string, userID: number) {
    const endpoint = "http://localhost:8080/staff/deleteuser";
    try {
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userID)
        });

        if (!response.ok) {
            throw new Error("fail call api deleteUser");
        }
        return response;
    } catch (error) {
        console.log(error);
    }
}
export async function adminUpdateStaff(token: string, userID: number, userName: string, email: string, phoneNumber: string, address: string, avatar: string) {
    const endpoint = "http://localhost:8080/admin/updatestaff";
    try {
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                userID: userID,
                userName: userName,
                password: "",
                email: email,
                phoneNumber: phoneNumber,
                sex: null,
                address: address,
                avatar: avatar,
            })
        });
        if (!response.ok) {
            throw new Error("fail call api adminUpdateStaff");
        }
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function findStaffContainingStaffName(token: string, staffName: string) {
    const endpoint = `http://localhost:8080/users/search/findByUserNameContainingAndRoleList_RoleID?userName=${staffName}&roleID=2`;
    const staffs: UserModel[] = [];
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("fail call api findStaffContainingStaffName");
        }
        const responseData = await response.json();

        const data = responseData._embedded.users;

        for (const staff of data) {
            staffs.push({
                user_id: staff.userID,
                password: staff.password,
                user_name: staff.userName,
                birthday: staff.birthday,
                email: staff.email,
                address: staff.address,
                phone_number: staff.phoneNumber,
                sex: staff.sex,
                avatar: staff.avatar,
            });
        }
        return staffs;
    } catch (error) {
        console.log(error);
    }
}

export async function createUser(token: string, userName: string, password: string, phoneNumber: string, email: string, address: string, avatar: string, sex: boolean) {
    const endpoint = "http://localhost:8080/account/register";
    try {
        const user = {
            userID: 0,
            userName: userName,
            password: password,
            email: email,
            phoneNumber: phoneNumber,
            sex: sex,
            address: address,
            avatar: avatar,
        };

        const userResponse = {
            user: user,
            role: 2
        }
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userResponse)
        });

        if (!response.ok) {
            throw new Error("fail call api createUser");
        }

        return response;
    } catch (error) {
        console.log(error);
    }

}


