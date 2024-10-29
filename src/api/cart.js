import { axiosInstances } from "../utils/axios";

export async function getCartById(userId) {  
    
    try {  
        const response = await axiosInstances.login.get(`/user/${userId}/cart`);  
        
        if (!response.ok) {  
            throw new Error(`HTTP error! status: ${response.status}`);  
        }  

        const cartData = await response.json();  
        return cartData;  
    } catch (error) {  
        console.error('Error fetching cart:', error);  
    }  
}  

export async function getCartItemsByCartId(cartId) {
  
    try {
        const response = await axiosInstances.login.get(`/cartitems/cart/${cartId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const cartItemsData = await response.json();
        return cartItemsData;
    } catch (error) {
        console.error('Error fetching cart items:', error);
    }
}

getCartById(id).then(cart => console.log(cart));

getCartItemsByCartId(cartId).then(cartItems => console.log(cartItems));

