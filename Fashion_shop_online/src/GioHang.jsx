import { useState } from 'react';
import CardGH from './CardGH'
import { useCart } from './CartContext';
import { useProduct } from './ProductContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from './UserContext';

function GioHang() {
    const { cart, clearCart } = useCart();
    const { products } = useProduct();
    const { user } = useUser();
    const navigate = useNavigate();
    const [voucherCode, setVoucherCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [voucherMessage, setVoucherMessage] = useState('');
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        phone: '',
        address: '',
        paymentMethod: ''
    });

    console.log(cart);

    const calculateTotal = () => {
        return cart.reduce((total, item) =>
            total + (item.product_price * item.quantity), 0);
    };
    const calculateTt = () => {
        return cart.reduce((tt, item) =>
            tt + item.quantity, 0);
    };
    const calculateTotal2 = () => {
        return calculateTotal() - discount;
    };

    const handleVoucherChange = (e) => {
        setVoucherCode(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleApplyVoucher = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:3001/vouchers/${voucherCode}`);
            const voucher = response.data;
            const totalAmount = calculateTotal();

            if (totalAmount >= voucher.voucher_condition && voucher.voucher_quantity > 0) {
                setDiscount(voucher.voucher_value);
                setVoucherMessage(`Áp dụng voucher thành công! Giảm ${voucher.voucher_value}₫`);
            } else {
                setDiscount(0);
                setVoucherMessage(`Đơn hàng chưa đủ điều kiện để áp dụng voucher này.`);
            }
        } catch (error) {
            setDiscount(0);
            setVoucherMessage('Voucher không hợp lệ.');
            console.error(error);
        }
    };

    const handleOrder = async (e) => {
        e.preventDefault();
        const order = {
            order_kh: {
                id_kh: user._id,
                name_kh: customerInfo.name,
                sdt_kh: customerInfo.phone,
                address: customerInfo.address
            },
            order_price: calculateTotal2(),
            order_quantity: calculateTt(),
            order_product: cart.map(item => ({
                id_product: item._id,
                color_product: item.selectedColor,
                size_product: item.selectedSize,
                quantity_product: item.quantity
            })),
            order_status: 'Đang chờ xác nhận',
            order_voucher: voucherCode || null,
            order_pttt: customerInfo.paymentMethod,
            order_date1: new Date(),
            order_date2: null
        };

        try {
            await axios.post('http://localhost:3001/orders', order);

            if (voucherCode) {
                await axios.put(`http://localhost:3001/vouchers/use/${voucherCode}`);
            }

            clearCart();
            alert('Bạn đã đặt hàng thành công!');
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Đã có lỗi xảy ra khi đặt hàng.');
        }
    };

    const handlePayment = () => {
        navigate('/payment', { state: { customerInfo, voucherCode, discount } });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || !customerInfo.paymentMethod) {
            alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        if (customerInfo.paymentMethod === 'COD') {
            handleOrder(e);
        } else if (customerInfo.paymentMethod === 'BANKING') {
            handlePayment();
        }
    };

    return (
        <div>
            <div style={{ "height": "10px" }}></div>
            <h1 style={{ fontFamily: 'Arial', marginLeft: '50px' }}>Giỏ hàng của bạn</h1>
            <h3 style={{ fontFamily: 'Arial', marginLeft: '50px', padding: '10px' }}>TỔNG CỘNG: {calculateTotal()}₫</h3>
            <div className='giohang'>
                <div className="cardgh-zone">
                    {cart.length > 0 ? (
                        <div className="cart-main">
                            {cart.map((product, index) => (
                                <CardGH key={index} product={product} />
                            ))}
                        </div>
                    ) : (
                        <p style={{fontFamily:"Arial", marginLeft:"50px"}}>Giỏ hàng của bạn đang trống.</p>
                    )}
                </div>
                <div className='gh-form'>
                    <form onSubmit={handleSubmit}>
                        <h2>Thông tin đặt hàng</h2>
                        <div>
                            <input className='gh-form-input' name='name' type='text' placeholder='Họ và tên' value={customerInfo.name} onChange={handleInputChange} />
                        </div>
                        <div>
                            <input className='gh-form-input' name='phone' type='text' placeholder='Số điện thoại' value={customerInfo.phone} onChange={handleInputChange} />
                        </div>
                        <div>
                            <input className='gh-form-input' name='address' type='text' placeholder='Địa chỉ' value={customerInfo.address} onChange={handleInputChange} />
                        </div>
                        <div className='gh-form-h'>Tổng giá trị: {calculateTotal()}₫ ({calculateTt()} sản phẩm)</div>
                        <div className='gh-form-h'>Phương thức thanh toán:</div>
                        <div className='gh-form-label'>
                            <label>
                                <input name='paymentMethod' value="BANKING" type="radio" onChange={handleInputChange} /> BANKING
                            </label>
                            <label>
                                <input name='paymentMethod' value="COD" type="radio" onChange={handleInputChange} /> Thanh toán khi giao hàng
                            </label>
                        </div>
                        <div className='gh-form-h'>Áp dụng Voucher
                            <input type='text' placeholder='Mã Voucher' value={voucherCode} onChange={handleVoucherChange} />
                            <button onClick={handleApplyVoucher}>Áp dụng</button>
                        </div>
                        {voucherMessage && <div>{voucherMessage}</div>}
                        <div>Thanh toán: {calculateTotal2()}₫</div>
                        <div className='gh-form-button'><button type='submit'>Tiếp tục</button></div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default GioHang;
