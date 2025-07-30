import { createContext, useState } from "react";

const CountContext = createContext();

const CountProvider = ({ children }) => {

    const [cartItem, setCartItem] = useState(JSON.parse(localStorage.getItem("cartItems")) || []);
    
    
    console.log(cartItem);

    const totalPrice = cartItem.reduce((total, item)=>{
        return total + (item.price * item.quantity);
    },0);
    const handleAddToCart = (product) => {
        // const newProducts = [...countItem];
        // newProducts.push(product);
        // setCountItem(newProducts);

        const existingProductIndex = cartItem.findIndex((prd) => prd.id === product.id);
        console.log("existingProductIndex", existingProductIndex);

        let existingProductItems = [...cartItem];
        if (existingProductIndex !== -1) {
            existingProductItems[existingProductIndex].quantity++;
            setCartItem(existingProductItems);
            

        } else {
            const newProduct = { ...product, quantity: 1 }
            existingProductItems.push(newProduct);
            setCartItem(existingProductItems);
        }
        localStorage.setItem("cartItems",JSON.stringify(existingProductItems));


    }
    const quantityIncrement = (prodcutId)=>{
        const productIndex = cartItem.findIndex((pr) => pr.id === prodcutId);
        const newProduct = [...cartItem];
        newProduct[productIndex].quantity++;
        setCartItem(newProduct);
        localStorage.setItem("cartItems", JSON.stringify(newProduct))
    }

    const quantityDecrement = (prodcutId)=>{
        const productIndex = cartItem.findIndex((it)=> it.id === prodcutId);
        
        if(cartItem[productIndex].quantity > 1){
            const newProduct = [...cartItem];
            newProduct[productIndex].quantity--;
            console.log("minus",newProduct);
            
            setCartItem(newProduct);
            localStorage.setItem("cartItems", JSON.stringify(newProduct));
        }
        
        
    }

    const removeCartItem = (productId)=>{
        const itemIndex = cartItem.findIndex((itm) => itm.id === productId);
        console.log("removeid", itemIndex);
        if(itemIndex !== -1){
            const newCartItems = [...cartItem]
            newCartItems.splice(itemIndex, 1);
            console.log("updatedCartItems",newCartItems);
            
            setCartItem(newCartItems);
            localStorage.setItem("cartItems",JSON.stringify(newCartItems));
        }

    }
    

    return (
        <CountContext.Provider value={{ cartItem, handleAddToCart ,removeCartItem,quantityDecrement,quantityIncrement,totalPrice}}>
            {children}
        </CountContext.Provider>
    )
}

export { CountContext, CountProvider };