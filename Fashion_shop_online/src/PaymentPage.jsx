import React, { useState, useEffect } from 'react';
import QrCode from 'qrcode.react';
import { useCart } from './CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useUser } from './UserContext';

function PaymentPage() {
    const { cart, clearCart } = useCart();
    const navigate = useNavigate();
    const { user } = useUser();
    const location = useLocation();
    const [customerInfo, setCustomerInfo] = useState(location.state?.customerInfo || {});
    const [voucherCode, setVoucherCode] = useState(location.state?.voucherCode || '');
    const [discount, setDiscount] = useState(location.state?.discount || 0);

    useEffect(() => {
        if (!location.state) {
            navigate('/giohang'); // Redirect to cart if no state is found
        }
    }, [location, navigate]);

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.product_price * item.quantity), 0);
    };

    const calculateTotal2 = () => {
        return calculateTotal() - discount;
    };

    const calculateTt = () => {
        return cart.reduce((tt, item) => tt + item.quantity, 0);
    };

    const handleCompletePayment = async (e) => {
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

    const handleBack = () => {
        navigate('/giohang', { state: { customerInfo, voucherCode, discount } });
    };

    function crc16_ccitt(data) {
        // Tham số CRC-16-CCITT
        const polynomial = 0x1021;
        let crc = 0xFFFF;
    
        // Chuyển đổi chuỗi đầu vào thành bytes
        const bytesData = new TextEncoder().encode(data);
    
        // Xử lý từng byte
        for (let byte of bytesData) {
            crc ^= byte << 8;
            for (let i = 0; i < 8; i++) {
                if (crc & 0x8000) {
                    crc = (crc << 1) ^ polynomial;
                } else {
                    crc <<= 1;
                }
                crc &= 0xFFFF; // Đảm bảo CRC vẫn là giá trị 16-bit
            }
        }
    
        // Trả về CRC dưới dạng chuỗi thập lục phân
        return crc.toString(16).toUpperCase().padStart(4, '0');
    }
    let money = calculateTotal();
    let message = "Thanh toan hoa don TuBo Club " + user.email;
    let money_string = money.toString();
    // Input string
    let input_data = '00020101021138620010A00000072701320006970454011899MM24169M631118280208QRIBFTTA5303704540'+money_string.length+money_string+'5802VN62'+(23+message.length)+'0515MOMOW2W6311182808'+message.length.toString().padStart(2, '0')+message+'80038546304';
    
    // Calculate CRC
    const crc_result = crc16_ccitt(input_data);
    input_data += crc_result;

    return (
        <div className='paymentpage'>
            <h1>Thanh Toán</h1>
            <div className='pmqrcode'>
                {//<QrCode value={`2|99|0989045854|||0|0|${calculateTotal()}|Thanh toan hoa don TuBo Club|transfer_myqr|63111828`} />}
                }
                <QrCode value={input_data}/>
            </div><br />
            <p>Vui lòng quét mã QR trên bằng ứng dụng MOMO hoặc app ngân hàng để thanh toán</p><br />
            <p>Sau khi thanh toán, click "Tiếp tục"</p><br />
            <button onClick={handleCompletePayment}>Tiếp tục</button><br />
            <button onClick={handleBack}>Quay lại</button>
        </div>
    );
}

export default PaymentPage;
