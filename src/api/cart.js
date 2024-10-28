const API_BASE_URL = "https://shoecarehub.site/api/user/${userId}/cart";

export async function getCartById(userId) {  
    const url = `https://shoecarehub.site/api/user/${userId}/cart`;  
    
    try {  
        const response = await fetch(url);  
        
        if (!response.ok) {  
            throw new Error(`HTTP error! status: ${response.status}`);  
        }  

        const cartData = await response.json();  
        return cartData;  
    } catch (error) {  
        console.error('Error fetching cart:', error);  
    }  
}  


getCartById(id).then(cart => console.log(cart));
