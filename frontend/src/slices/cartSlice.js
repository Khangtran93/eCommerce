import { createSlice } from '@reduxjs/toolkit'
import { updateCart } from '../utils/cartUtils';

//set initialState to be whatever in the localStorage.getItem('cart). if true, parse, if not, set initialState to be empty
const initialState = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : {cartItems: [], shippingAddress: {}, paymentMethod: 'Paypal'};

//create cartSlice
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    //reducer function addToCart with state and action as parameters
    reducers: {
        addToCart: (state, action) => {
            //store the item being added to the cartItems
            const item = action.payload;
            //check if that item exists in the cartItems
            const existItem = state.cartItems.find((x) => x._id === item._id)
            //if true, 
            if (existItem) {
                state.cartItems = state.cartItems.map((x) => 
                    x._id === existItem._id ? {...x, qty : x.qty + item.qty }: x)
                
            }
            else {
                state.cartItems = [...state.cartItems, item];
            }

            return updateCart(state);

           
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
            return updateCart(state);
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            return updateCart(state);
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            return updateCart(state);
        },
        clearCartItems: (state, action) => {
            state.cartItems = [];
            // state.shippingAddress = {};
            return updateCart(state);
        }
    }
})

export const {addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCartItems} = cartSlice.actions; 

export default cartSlice.reducer;