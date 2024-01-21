export async function my_request(endpoint:string) {
    const response = await fetch(endpoint);

    if(!response.ok){
        throw new Error(`Không thể truy cập đường dẫn`); //lỗi thì trả về lỗi
    }

    return response.json(); //không lỗi thì trả về dạng json
}
