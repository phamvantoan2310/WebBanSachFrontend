import EvaluateModel from "../models/EvaluateModel";
import { my_request } from "./request";

async function getEvaluate(endpoint: string): Promise<EvaluateModel[]> {
    const result: EvaluateModel[] = [];

    const response = await my_request(endpoint); //gọi endpoint lấy kết quả dạng json 

    const responseData = response._embedded.evaluates; //lấy danh sách từ kết quả vừa lấy

    for (const key in responseData) {                //nhập sách vào dãy
        result.push({
            evaluate_id: responseData[key].evaluateID,
            decription: responseData[key].decription,
            point: responseData[key].point
        });
    }

    return result;
} 

export async function getEvaluateByBookID(book_id:number) {
    const endpoint: string = `http://localhost:8080/books/${book_id}/evaluateList`

    return getEvaluate(endpoint);
}