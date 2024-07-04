import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CardSP from './CardSP';
import './Profile.css';
import { useUser } from './UserContext';
import { MdDriveFileRenameOutline } from "react-icons/md";
import { FaEye } from "react-icons/fa";

const Profile = () => {
    const [activeTab, setActiveTab] = useState('personalInfo');
    const { user, setUser } = useUser();
    return (
        <div className="profile-container">
            <div className="sidebar">
                <button onClick={() => setActiveTab('personalInfo')}>Thông tin cá nhân</button>
                <button onClick={() => setActiveTab('orders')}>Đơn hàng</button>
                <button onClick={() => setActiveTab('favoriteProducts')}>Sản phẩm yêu thích</button>
            </div>
            <div className="content">
                {activeTab === 'personalInfo' && <PersonalInfo user={user} setUser={setUser} />}
                {activeTab === 'orders' && <Orders />}
                {activeTab === 'favoriteProducts' && <FavoriteProducts />}
            </div>
        </div>
    );
};

const PersonalInfo = ({ user, setUser }) => {
    const [name, setName] = useState(user.name);
    const [phone, setPhone] = useState(user.sdt);
    const [password, setPassword] = useState('');
    const [ht, setHt] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [error, setError] = useState('');
    const handleUpdate = async (field, value) => {
        if (!window.confirm(`Bạn chắc chắn muốn đổi ${field === 'name' ? 'tên' : field === 'phone' ? 'số điện thoại' : 'mật khẩu'} chứ ?`)) 
        {return;}
        try {
            const response = await axios.post(`http://localhost:3001/update-${field}`, { email: user.email, [field]: value });
            if (response.data.status === 'success') {
                setUser(response.data.user);
                setIsEditingName(false);
                setIsEditingPhone(false);
                setIsEditingPassword(false);
                setError('');
            } else {setError(response.data.message);}
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            setError(`Error updating ${field}`);
        }
    };
    return (
        <div>
            <h1>Thông tin cá nhân</h1>
            <div className="info-item">
                <span>Họ và tên: </span>
                {isEditingName ? 
                (<>
                    <input type="text" value={name} 
                    onChange={(e) => setName(e.target.value)}/>
                    <button className='content-button2' onClick={() => handleUpdate('name', name)}>Lưu</button>
                    <button className='content-button2' onClick={() => setIsEditingName(false)}>Hủy</button>
                </>)           : 
                (<>
                    <span>{name}</span>
                    <button className='content-button' onClick={() => setIsEditingName(true)}><MdDriveFileRenameOutline style={{"marginBottom":"-4px"}} /></button>
                </>)}
            </div>
            <div className="info-item">
                <span>Số điện thoại: </span>
                {isEditingPhone ? 
                (<>
                    <input type="text" value={phone}
                    onChange={(e) => setPhone(e.target.value)}/>
                    <button className='content-button2' onClick={() => handleUpdate('phone', phone)}>Lưu</button>
                    <button className='content-button2' onClick={() => setIsEditingPhone(false)}>Hủy</button>
                </>)            : 
                (<>
                    <span>{phone}</span>
                    <button className='content-button' onClick={() => setIsEditingPhone(true)}><MdDriveFileRenameOutline style={{"marginBottom":"-4px"}} /></button>
                </>)}
            </div>
            <div className="info-item">
                <span>Email: </span>
                <span>{user.email}</span>
            </div>
            <div className="info-item">
                <span>Mật khẩu: </span>
                {isEditingPassword ? 
                (<>
                    <input type="text" value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
                    <button className='content-button2' onClick={() => handleUpdate('password', password)}>Lưu</button>
                    <button className='content-button2' onClick={() => setIsEditingPassword(false)}>Hủy</button>
                </>)               : 
                (<>
                    {ht ? 
                    <>
                    <span>{user.password}</span>
                    <button className='content-button' onClick={() => setIsEditingPassword(true)}><MdDriveFileRenameOutline style={{"marginBottom":"-4px"}} /></button>
                    <button className='content-button22' onClick={() => setHt(false)}><FaEye /></button>
                    </> : 
                    <>
                    <span>********</span>
                    <button className='content-button' onClick={() => setIsEditingPassword(true)}><MdDriveFileRenameOutline style={{"marginBottom":"-4px"}} /></button>
                    <button className='content-button22' onClick={() => setHt(true)}><FaEye /></button>
                    </>}
                </>)}
            </div>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const {user} = useUser();
    useEffect(() => {
        const fetchOrders = async () => {
            const response = await axios.get(`http://localhost:3001/orders/${user._id}`);
            if (response.status === 200) setOrders(response.data);
            else alert('Internal server error');
        }
        fetchOrders();
    },[]);

    return (
        <div>
            <h1>Đơn hàng</h1>
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
                                    <td className="stt">{order.order_quantity}</td>
                                    <td>{order.order_price}</td>
                                    <td>{order.order_status}</td>
                                    <td>{order.order_pttt}</td>
                                    <td>{order.order_date1}</td>
                                    <td>{order.order_date2}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
        </div>
    );
};

const FavoriteProducts = () => {
    const [favorites, setFavorites] = useState([]);
    const {user} = useUser();
    const userId = user._id;
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:3001/favorites', { params: { userId } })
            .then(response => {
                if (response.data.status === 'success') {
                    setFavorites(response.data.favorites);
                }
            })
            .catch(error => console.error(error));
    }, [userId]);

    const handleRemoveFavorite = (productId) => {
        axios.post('http://localhost:3001/remove-favorite', { userId, productId })
            .then(response => {
                if (response.data.status === 'success') {
                    setFavorites(favorites.filter(fav => fav.fp_id_sp !== productId));
                }
            })
            .catch(error => console.error(error));
    };

    if (favorites.length === 0) {
        return <h2>Không có sản phẩm yêu thích nào</h2>;
    }
    console.log(favorites);

    const handleCardClick = (productId) => {
        navigate(`/productfilter/:category/${productId}`);
    };
    
    return (
        <div>
            <h1>Sản phẩm yêu thích</h1>
            <div className="favorites-list">
                {favorites.map(favorite => (
                    <div key={favorite._id} className="cardsppp">
                        <img className="cardsppp-image" src={favorite.fp_id_sp.product_link}
                        onClick={() => navigate(`/productfilter/:category/${favorite.fp_id_sp._id}`)}/>
                        <p className="cardsppp-title">{favorite.fp_id_sp.product_name}</p>
                        <p className="cardsppp-price">{favorite.fp_id_sp.product_price}₫</p>
                        <button className="cardsppp-button" onClick={() => 
                        handleRemoveFavorite(favorite.fp_id_sp)}>Xóa</button>
                </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;