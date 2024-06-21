import { useState } from "react";
import AdminUser from './AdminUser.jsx';
import AdminProduct from "./AdminProduct.jsx";
import './Admin.css'
import { HiShoppingBag } from "react-icons/hi2";
import { AiFillProduct } from "react-icons/ai";
import { FaUserFriends } from "react-icons/fa";
import { IoTicket } from "react-icons/io5";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { TbLogout } from "react-icons/tb";

function Admin()
{
    const [activeTab, setActiveTab] = useState('product');
    return (
        <div className="Admin-container">
            <div className="Admin-sidebar">
                <div>
                <button onClick={() => setActiveTab('revenue')}><FaMoneyBillTrendUp style={{"marginBottom":"-2px"}}/> Doanh thu</button>
                <button onClick={() => setActiveTab('order')}><HiShoppingBag style={{"marginBottom":"-2px"}}/> Đơn hàng</button>
                <button onClick={() => setActiveTab('product')}><AiFillProduct style={{"marginBottom":"-3px"}}/> Sản phẩm</button>
                <button onClick={() => setActiveTab('user')}><FaUserFriends style={{"marginBottom":"-3px"}}/> Khách hàng</button>
                <button onClick={() => setActiveTab('voucher')}><IoTicket style={{"marginBottom":"-2px"}}/> Voucher</button>
                </div>
                <button><TbLogout style={{"fontSize":"30px","marginBottom":"-6px"}}/> Đăng xuất</button>
            </div>
            <div className="Admin-content">
                {activeTab === 'user' && <AdminUser/>}
                {activeTab === 'product' && <AdminProduct/>}
            </div>
        </div>
    );
};

export default Admin