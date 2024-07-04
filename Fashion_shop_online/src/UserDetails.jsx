import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useProduct } from './ProductContext';
import { useNavigate } from 'react-router-dom';
import ProductDetails from './ProductDetails';
import './Admin.css';
import { TbArrowBackUp } from "react-icons/tb";

function UserDetail(props) 
{
    const user = props.user;
    const {products} = useProduct();
    const navigate = useNavigate();
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await axios.get(`http://localhost:3001/orders/${user._id}`);
            if (response.status === 200) setOrders(response.data);
            else alert('Internal server error');
        }
        fetchOrders();
    },[]);

    useEffect(() => {
        const fetchFavoriteProducts = async () => {
            const response = await axios.get(`http://localhost:3001/favorites?userId=${user._id}`);
            if (response.status === 200) setFavoriteProducts(response.data.favorites);
            else alert('Internal server error');
        }
        fetchFavoriteProducts();
    }, []);

    useEffect(() => {
        console.log(orders);
    }, [orders]);

    const handleCloseFP = () => {
        setSelectedProductId(null);
    };

    return (<>
        {selectedProductId ? <ProductDetails productId={selectedProductId} onClose={handleCloseFP}/> 
        :
        <div id="user-detail-container">
            <div id="user-detail-content">
                <div className='adusdehd'>
                    <h2>Thông tin chi tiết khách hàng</h2>
                    <button onClick={props.onClose}><TbArrowBackUp /></button>
                </div>
                <h3 className='adush3'>Thông tin cá nhân</h3>
                <div id="user-information">
                    <div>
                        <p>Họ và tên: {user.name}</p>
                        <p>Email: {user.email}</p>
                        <p>Số điện thoại: {user.sdt}</p>
                    </div>
                </div>
                <h3 className='adush3'>Đơn hàng</h3>
                <div id="orders">
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Số lượng sản phẩm</th>
                                <th>Tổng giá trị</th>
                                <th>Trạng thái</th>
                                <th>Phương thức thanh toán</th>
                                <th>Ngày đặt</th>
                                <th>Ngày giao</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={index}>
                                    <td className="stt">{index+1}</td>
                                    <td style={{width: "120px"}} className="stt">{order.order_quantity}</td>
                                    <td>{order.order_price}</td>
                                    <td>{order.order_status}</td>
                                    <td className="stt" style={{width: "120px"}}>{order.order_pttt}</td>
                                    <td>{order.order_date1}</td>
                                    <td>{order.order_date2}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <h3 className='adush3'>Sản phẩm yêu thích</h3>
                <div id="favorite-products">
                    <ul>
                        {favoriteProducts.map((favorite, index) => (
                            <div key={index} className="cardspp">
                                <img className="cardspp-image" src={favorite.fp_id_sp.product_link}
                                onClick={()=>setSelectedProductId(favorite.fp_id_sp._id)}/>
                                <p className="cardspp-title">{favorite.fp_id_sp.product_name}</p>
                                <p className="cardspp-price">{favorite.fp_id_sp.product_price}₫</p>
                            </div>
                        ))}
                    </ul>
                </div>
            </div>
        </div>}</>
    )
}

export default UserDetail