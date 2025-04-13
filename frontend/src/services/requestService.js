import { ERROR } from "../constants/error";

const makeRequest = async (url, method, body, token) => {
    const headers = { "Content-Type": "application/json" };
    const options = { method, headers };
    
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (body) options.body = JSON.stringify(body);

    try {
        const response = await fetch(url, options);        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return { success: true, data };
    } catch (error) {
        console.log(error.message);
        return { success: false, message: error.message || ERROR.SERVICE_CONNECTION_FAILED };
    }
};

export default makeRequest;
