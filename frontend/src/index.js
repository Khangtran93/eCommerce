import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route
} from 'react-router-dom' 
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import {Provider} from 'react-redux'
import store from './store.js'
import './index.css';
import App from './App';
import "bootstrap"
import HomeScreen from './Screens/HomeScreen';
import ProductScreen from './Screens/ProductScreen';
import CartScreen from './Screens/CartScreen.jsx';
import LoginScreen from './Screens/LoginScreen.jsx';
import RegisterScreen from './Screens/RegisterScreen.jsx'
import ShippingScreen from './Screens/ShippingScreen.jsx';
import PaymentScreen from './Screens/PaymentScreen.jsx';
import PlaceOrderScreen from './Screens/PlaceOrderScreen.jsx';
import OrderScreen from './Screens/OrderScreen.jsx';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import ProfileScreen from './Screens/ProfileScreen.jsx';
import OrderListScreen from './Screens/admin/OrderListScreen.jsx';
import UserListScreen from './Screens/admin/UserListScreen.jsx';
import ProductListScreen from './Screens/admin/ProductListScreen.jsx';
import ProductEditScreen from './Screens/admin/ProductEditScreen.jsx';
import UserEditScreen from './Screens/admin/UserEditScreen.jsx';
import UserScreen from './Screens/admin/UserScreen.jsx';
import {HelmetProvider} from 'react-helmet-async'

const router = createBrowserRouter (
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route index={true} path='/' element={<HomeScreen/>}/>
      <Route path='/search/:keyword' element={<HomeScreen/>}/>
      <Route path='/page/:pageNumber' element={<HomeScreen/>}/>
      <Route path='/search/:keyword/page/:pageNumber' element={<HomeScreen/>}/>
      <Route path='/product/:id' element={<ProductScreen/>}/>
      <Route path='/cart' element={<CartScreen/>}/>
      <Route path='/login' element={<LoginScreen/>}/>
      <Route path='/register' element={<RegisterScreen/>}/>
      <Route path='' element={<PrivateRoute/>}>
          <Route path='/shipping' element={<ShippingScreen/>}/>
          <Route path='/payment' element={<PaymentScreen/>}/>
          <Route path='/placeorder' element={<PlaceOrderScreen/>}/>
          <Route path='/orders/:id' element={<OrderScreen/>}/>
          <Route path='/profile' element={<ProfileScreen/>}/>

      </Route>

      <Route path='' element={<AdminRoute/>}>
        <Route path='/admin/orderlist' element={<OrderListScreen/>}/>
        <Route path='/admin/userlist' element={<UserListScreen/>}/>
        <Route path='/admin/productlist' element={<ProductListScreen/>}/>
        <Route path='/admin/productlist/:pageNumber' element={<ProductListScreen/>}/>
        <Route path='/admin/product/:id/edit' element={<ProductEditScreen/>}/>
        <Route path='/admin/user/:id/edit' element={<UserEditScreen/>}/>
        <Route path='/admin/user/:id' element={<UserScreen/>}/>
      </Route>
    </Route>
  )
)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PayPalScriptProvider>
          <RouterProvider router={router}/>
        </PayPalScriptProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);


