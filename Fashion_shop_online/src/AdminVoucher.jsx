import { useState, useEffect } from "react";
import axios from 'axios';
import './Admin.css';

function AdminVoucher()
{
    const [vouchers, setVouchers] = useState([]);
    const [addvou, setAddvou] = useState(false);
    const [newVoucher, setNewVoucher] = useState({
        voucher_condition: '',
        voucher_value: '',
        voucher_quantity: ''
    });

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = () => {
        axios.get('http://localhost:3001/vouchers')
            .then(response => {
                if (response.data.status === 'success') {
                    setVouchers(response.data.vouchers);
                }
            })
            .catch(error => console.error(error));
    };

    const handleDelete = (voucherId) => {
        axios.delete(`http://localhost:3001/vouchers/${voucherId}`)
            .then(response => {
                if (response.data.status === 'success') {
                    fetchVouchers();
                }
            })
            .catch(error => console.error(error));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewVoucher(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddVoucher = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/vouchers', newVoucher)
            .then(response => {
                if (response.data.status === 'success') {
                    fetchVouchers();
                    setNewVoucher({
                        voucher_condition: '',
                        voucher_value: '',
                        voucher_quantity: ''
                    });
                }
            })
            .catch(error => console.error(error));
        setAddvou(false);
    };

    return(
        <>
            <h1>Danh sách Voucher</h1><br/>
            <button className="advoubt" onClick={()=>setAddvou(true)}>Thêm Voucher mới</button>
            {addvou ? (<form className="advoufo" onSubmit={handleAddVoucher}>
                <div className="advoufoi">
                    <label>Điều kiện áp dụng:</label>
                    <input type="text" name="voucher_condition"
                        value={newVoucher.voucher_condition} onChange={handleInputChange}/>
                </div>
                <div className="advoufoi">
                    <label>Số tiền giảm giá:</label>
                    <input type="text" name="voucher_value"
                        value={newVoucher.voucher_value} onChange={handleInputChange}/>
                </div>
                <div className="advoufoi">
                    <label>Số lượng:</label>
                    <input type="text" name="voucher_quantity"
                        value={newVoucher.voucher_quantity} onChange={handleInputChange}/>
                </div>
                <button type="submit">Thêm Voucher</button>
                <button onClick={()=>setAddvou(false)}>Hủy</button>
            </form>) : <></>}
            <h2 style={{marginTop: "20px"}}>Voucher khả dụng</h2>
            <div className="cardvouzone">
            {vouchers.filter(v => v.voucher_quantity > 0).map(vou => (
                <div key={vou._id} className="cardpp">
                    <div className="cardvoutext">
                        <p>Mã: {vou._id}</p>
                        <p>Điều kiện áp dụng: {vou.voucher_condition}</p>
                        <p>Giảm: {vou.voucher_value}₫</p>
                        <p>Số lượng còn lại: {vou.voucher_quantity}</p>
                    </div>
                    <button onClick={() => handleDelete(vou._id)}>Xóa</button>
                </div>
            ))}
            </div>
            <h2>Voucher đã hết</h2>
            <div className="cardvouzone">
            {vouchers.filter(v => v.voucher_quantity == 0).map(vou => (
                <div key={vou._id} className="cardpp">
                    <div className="cardvoutext">
                        <p>Mã: {vou._id}</p>
                        <p>Điều kiện áp dụng: {vou.voucher_condition}</p>
                        <p>Giảm: {vou.voucher_value}₫</p>
                        <p>Số lượng còn lại: {vou.voucher_quantity}</p>
                    </div>
                    <button onClick={() => handleDelete(vou._id)}>Xóa</button>
                </div>
            ))}
            </div>
        </>
    )
}

export default AdminVoucher