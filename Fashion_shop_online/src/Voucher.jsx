import { useState, useEffect } from "react";
import axios from 'axios';

function Voucher()
{
    const [vouchers, setVouchers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/vouchers')
            .then(response => {
                if (response.data.status === 'success') {
                    setVouchers(response.data.vouchers);
                }
            })
            .catch(error => console.error(error));
    }, []);

    return(
        <div className="voucher">
            <h1>Voucher</h1>
            <div className="cardvouzone">
            {vouchers.filter(v=>v.voucher_quantity>0).map(vou => (
                <div key={vou._id} className="cardspp" style={{width: "350px"}}>
                    <div className="cardvoutextt">
                        <p>Mã: {vou._id}</p>
                        <p>Điều kiện áp dụng: Đơn từ {vou.voucher_condition}đ trở lên</p>
                        <p>Giảm: {vou.voucher_value}₫ trên tổng giá trị đơn hàng</p>
                        <p>Số lượng còn lại: {vou.voucher_quantity}</p>
                    </div>
                </div>
                ))}
            </div>
        </div>
    )
}

export default Voucher