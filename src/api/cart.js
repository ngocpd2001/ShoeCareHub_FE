import { axiosInstances } from "../utils/axios";

export async function getCartById(userId) {  
    try {  
        const response = await axiosInstances.login.get(`/user/${userId}/cart`);  
        return response.data;  
    } catch (error) {  
        console.error('Error fetching cart:', error.response ? error.response.data : error.message);  
        throw error;  
    }  
}  

export async function getCartItemsByCartId(cartId) {
    try {
        const response = await axiosInstances.login.get(`/cartitems/cart/${cartId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cart items:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Đảm bảo rằng bạn định nghĩa id và cartId trước khi sử dụng
const id = "someUserId"; // Thay thế bằng giá trị thực tế
const cartId = "someCartId"; // Thay thế bằng giá trị thực tế

getCartById(id).then(cart => console.log(cart)).catch(error => console.error('Error in getCartById:', error));

getCartItemsByCartId(cartId).then(cartItems => console.log(cartItems)).catch(error => console.error('Error in getCartItemsByCartId:', error));

