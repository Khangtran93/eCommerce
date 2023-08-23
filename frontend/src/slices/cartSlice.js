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
            //store the item being added to the cartItems. action.payload will be whatever the user pass in in the frontend component
            //here it is the entire object, but in the dec. and incr. reducers, it will be just the item id.
            const item = action.payload;
            console.log("item in addtocart reducer ", item);
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

        incrementItem: (state,action) => {
            //retrieve the id that users pass in
            const item = action.payload;
            //find item with that id
            const existItem = state.cartItems.find((x) => x._id === item)
            //if exist, increment its quantity
            if (existItem) {
                state.cartItems = state.cartItems.map((x) => 
                    x._id === existItem._id ? {...x, qty : x.qty + 1 }: x)
            }
            return updateCart(state);
        },

        decrementItem: (state,action) => {
            const item= action.payload;
            const existItem = state.cartItems.find((x) => x._id === item)
            if (existItem) {
                state.cartItems = state.cartItems.map((x) => 
                    x._id === existItem._id ? {...x, qty : x.qty - 1 }: x)
            }
            return updateCart(state);
        },
        
        clearCartItems: (state, action) => {
            state.cartItems = [];
            return updateCart(state);
        }
    }
})

export const {addToCart, removeFromCart, incrementItem, decrementItem, saveShippingAddress, savePaymentMethod, clearCartItems} = cartSlice.actions; 

export default cartSlice.reducer;