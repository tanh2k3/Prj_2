import Bar from './Bar.jsx'
import AnhBia from './AnhBia.jsx'
import DanhMucSanPham from './DanhMucSanPham.jsx'
import Footer from './Footer.jsx'
import {Link} from 'react-router-dom'
import { Routes, Route} from 'react-router-dom'
import SP from './SP.jsx'
import ProductFilter from './ProductFilter.jsx'
import { useEffect, useState } from 'react'
import GioHang from './GioHang.jsx';
import Profile from './Profile.jsx';

function Guest()
{
    return(
        <>
            <Bar/>
            <div style={{"height" : "64px"}}></div>
            <Routes>
                <Route path='/' element={<>
                    <AnhBia/>
                    <DanhMucSanPham/>
                </>}/>
                <Route path="/productfilter/:category/:id" element={<SP/>}/>
                <Route path="/productfilter/:category?" element={<ProductFilter/>}/>
                <Route path="/giohang" element={<GioHang/>}/>
                <Route path="/profile" element={<Profile/>}/>
            </Routes>
            <div style={{"height" : "50px"}}></div>
            <Footer/>
        </>
    );
}

export default Guest