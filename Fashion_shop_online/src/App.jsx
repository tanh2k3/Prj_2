import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import LoginPage from './LoginPage.jsx'
import RegisterPage from './RegisterPage.jsx'
import { CartProvider } from './CartContext.jsx'
import ScrollToTop from "./ScrollToTop";
import Guest from './Guest.jsx'
import { UserProvider } from './UserContext.jsx'
import ConfirmAccount from './ConfirmAccount.jsx'
import { useEffect } from 'react';
import PaymentPage from './PaymentPage.jsx'
import Admin from './Admin.jsx';
import { ProductProvider } from './ProductContext.jsx'

function App() 
{
    return(
      <ProductProvider>
      <UserProvider>
      <CartProvider>
      <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/*" element={<Guest/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/verify" element={<ConfirmAccount isresetpass={false}/>}/>
        <Route path="/forgot-password" element={<ConfirmAccount isresetpass={true}/>}/>
        <Route path="/payment" element={<PaymentPage/>}/>
        <Route path='/admin' element={<Admin/>}/>
      </Routes>
      </BrowserRouter>
      </CartProvider>
      </UserProvider>
      </ProductProvider>
    );
}

export default App
