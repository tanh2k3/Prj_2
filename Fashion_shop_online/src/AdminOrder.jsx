import { useState, useEffect } from "react";
import axios from "axios";
import { useProduct } from "./ProductContext";
import './Admin.css';
import { TbArrowBackUp } from "react-icons/tb";

function AdminOrder()
{
    const [dh, setDh] = useState(null);
    const {products} = useProduct();
    const [ldh, setLdh] = useState("cxn");
    const [ord, setOrd] = useState(null);
    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState(null);
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:3001/orders');
                if (response.data.status === 'success') {
                    setOrders(response.data.od);
                } else {
                    console.error('Failed to fetch products:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchOrders();
    },[]);

    const handleViewO = (orderid) => {
        const od = orders.find(o=>o._id===orderid)
        setDh(orderid);
        setOrd(od);
        setStatus(od.order_status);
    }

    useEffect(()=>{
        console.log(dh)
    },[dh]);

    const handleChangeStatus = async (newStatus) => {
        try {
            const response = await axios.put(`http://localhost:3001/orders/${ord._id}/status`, { status: newStatus });
            if (response.data.status === 'success') {
                // Cập nhật trạng thái đơn hàng trong state
                setOrders(orders.map(o => o._id === ord._id ? { ...o, order_status: newStatus } : o));
                setOrd({ ...ord, order_status: newStatus });
                alert('Cập nhật trạng thái thành công');
            } else {
                alert('Cập nhật trạng thái thất bại');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Đã có lỗi xảy ra khi cập nhật trạng thái.');
        }
    };
    

    return(
        <>{dh ? 
            (<div className="adorxtt">
            <div className="adorttdh">
                <h1>Thông tin đơn hàng</h1>
                <button onClick={()=>{setDh(null); setOrd(null);}}><TbArrowBackUp /></button>
            </div>
            <div className="ps">
                <p>Mã đơn hàng: {ord._id}</p>
                <p>Mã khách hàng: {ord.order_kh.id_kh}</p>
                <p>Tổng số lượng sản phẩm: {ord.order_quantity}</p>
                <p>Tổng giá trị đơn hàng: {ord.order_price}đ</p>
                <p>Mã Voucher: {ord.order_voucher}</p>
                <p>Phương thức thanh toán: {ord.order_pttt}</p>
                <div style={{display: "flex"}}>
                    <p>Trạng thái: </p>
                    <div style={{fontWeight: "bold", marginLeft: "5px"}}>{ord.order_status}</div>
                </div>
                {status==="Đang chờ xác nhận" && 
                    <div className="cnbton">
                        <button onClick={()=>handleChangeStatus("Đang chờ vận chuyển")}>Xác nhận</button>
                        <button onClick={()=>handleChangeStatus("Đơn hủy")}>Hủy đơn</button>
                </div>}
                {status==="Đang chờ vận chuyển" && 
                    <div className="cnbton">
                        <button onClick={()=>handleChangeStatus("Đang vận chuyển")}>Cập nhật</button>
                </div>}
                {status==="Đang vận chuyển" && 
                    <div className="cnbton">
                        <button onClick={()=>handleChangeStatus("Hoàn tất")}>Cập nhật</button>
                        <button onClick={()=>handleChangeStatus("Đơn hoàn")}>Đơn hoàn</button>
                </div>}
                <p>Ngày đặt: {ord.order_date1}</p>
                <p>Ngày giao: {ord.order_date2}</p><br/>
            </div>
            <h2>Thông tin người nhận</h2>
            <div className="adorttnn">
                <p>Họ và tên: {ord.order_kh.name_kh}</p>
                <p>Số điện thoại: {ord.order_kh.sdt_kh}</p>
                <p>Địa chỉ: {ord.order_kh.address}</p>
            </div>
            <h2>Thông tin sản phẩm</h2>
            <div>
                {ord.order_product.map((sp, index) => {
                    const p = products.find(p=>p._id===sp.id_product);
                    return(
                    <div className="cardgh" key={index}>
                        <img src={p.product_link}/>
                        <div className="cardghh-text">
                            <p style={{"height" : "40px"}}>{p.product_name}</p>
                            <p>Màu: {sp.color_product}</p>
                            <p>Size: {sp.size_product}</p>
                            <p>Số lượng: {sp.quantity_product}</p>
                            <p>Giá: {p.product_price}₫</p>
                          <div className="cardghprice">
                            <div className="cargh-pr">Tổng: </div>
                            <div className="cardgh-price">{p.product_price * sp.quantity_product}₫</div>
                          </div>
                        </div>
                    </div>)})}
            </div>
            </div>) 
            :
            (<>
            <div className="adorderbut">
                <button className="dhbutton" onClick={()=>setLdh("cxn")}>Chờ xác nhận</button>
                <button className="dhbutton" onClick={()=>setLdh("cvc")}>Chờ vận chuyển</button>
                <button className="dhbutton" onClick={()=>setLdh("dvc")}>Đang vận chuyển</button>
                <button className="dhbutton" onClick={()=>setLdh("ht")}>Hoàn tất</button>
                <button className="dhbutton" onClick={()=>setLdh("dh")}>Đơn hoàn</button>
                <button className="dhbutton" onClick={()=>setLdh("dhh")}>Đơn hủy</button>
            </div>
            <h1 style={{textAlign : "center"}}>Danh sách đơn hàng</h1>
            { ldh==="cxn" &&
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã đơn</th>
                        <th>Tên người nhận</th>
                        <th>SĐT người nhận</th>
                        <th>Tổng đơn</th>
                        <th>Phương thức thanh toán</th>
                        <th>Ngày đặt</th>
                    </tr>
                </thead>
                <tbody>
                {orders.filter(od=>od.order_status==="Đang chờ xác nhận").map((o, index) => 
                    <tr key={index}>
                        <td className="stt">{index+1}</td>
                        <td className="adormadh" onClick={()=>handleViewO(o._id)}>{o._id}</td>
                        <td>{o.order_kh.name_kh}</td>
                        <td className="stt">{o.order_kh.sdt_kh}</td>
                        <td>{o.order_price}</td>
                        <td className="stt" style={{width: "120px"}}>{o.order_pttt}</td>
                        <td>{o.order_date1}</td>
                   </tr>)}
                </tbody>
            </table>}

            { ldh==="cvc" &&
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã đơn</th>
                        <th>Tên người nhận</th>
                        <th>SĐT người nhận</th>
                        <th>Tổng đơn</th>
                        <th>Phương thức thanh toán</th>
                        <th>Ngày đặt</th>
                    </tr>
                </thead>
                <tbody>
                {orders.filter(od=>od.order_status==="Đang chờ vận chuyển").map((o, index) => 
                    <tr key={index}>
                        <td className="stt">{index+1}</td>
                        <td className="adormadh" onClick={()=>handleViewO(o._id)}>{o._id}</td>
                        <td>{o.order_kh.name_kh}</td>
                        <td className="stt">{o.order_kh.sdt_kh}</td>
                        <td>{o.order_price}</td>
                        <td className="stt" style={{width: "120px"}}>{o.order_pttt}</td>
                        <td>{o.order_date1}</td>
                   </tr>)}
                </tbody>
            </table>}

            { ldh==="dvc" &&
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã đơn</th>
                        <th>Tên người nhận</th>
                        <th>SĐT người nhận</th>
                        <th>Tổng đơn</th>
                        <th>Phương thức thanh toán</th>
                        <th>Ngày đặt</th>
                    </tr>
                </thead>
                <tbody>
                {orders.filter(od=>od.order_status==="Đang vận chuyển").map((o, index) => 
                    <tr key={index}>
                        <td className="stt">{index+1}</td>
                        <td className="adormadh" onClick={()=>handleViewO(o._id)}>{o._id}</td>
                        <td>{o.order_kh.name_kh}</td>
                        <td className="stt">{o.order_kh.sdt_kh}</td>
                        <td>{o.order_price}</td>
                        <td className="stt" style={{width: "120px"}}>{o.order_pttt}</td>
                        <td>{o.order_date1}</td>
                   </tr>)}
                </tbody>
            </table>}

            { ldh==="ht" &&
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã đơn</th>
                        <th>Tên người nhận</th>
                        <th>SĐT người nhận</th>
                        <th>Tổng đơn</th>
                        <th>Phương thức thanh toán</th>
                        <th>Ngày đặt</th>
                    </tr>
                </thead>
                <tbody>
                {orders.filter(od=>od.order_status==="Hoàn tất").map((o, index) => 
                    <tr key={index}>
                        <td className="stt">{index+1}</td>
                        <td className="adormadh" onClick={()=>handleViewO(o._id)}>{o._id}</td>
                        <td>{o.order_kh.name_kh}</td>
                        <td className="stt">{o.order_kh.sdt_kh}</td>
                        <td>{o.order_price}</td>
                        <td className="stt" style={{width: "120px"}}>{o.order_pttt}</td>
                        <td>{o.order_date1}</td>
                   </tr>)}
                </tbody>
            </table>}

            { ldh==="dh" &&
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã đơn</th>
                        <th>Tên người nhận</th>
                        <th>SĐT người nhận</th>
                        <th>Tổng đơn</th>
                        <th>Phương thức thanh toán</th>
                        <th>Ngày đặt</th>
                    </tr>
                </thead>
                <tbody>
                {orders.filter(od=>od.order_status==="Đơn hoàn").map((o, index) => 
                    <tr key={index}>
                        <td className="stt">{index+1}</td>
                        <td className="adormadh" onClick={()=>handleViewO(o._id)}>{o._id}</td>
                        <td>{o.order_kh.name_kh}</td>
                        <td className="stt">{o.order_kh.sdt_kh}</td>
                        <td>{o.order_price}</td>
                        <td className="stt" style={{width: "120px"}}>{o.order_pttt}</td>
                        <td>{o.order_date1}</td>
                   </tr>)}
                </tbody>
            </table>}

            { ldh==="dhh" &&
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã đơn</th>
                        <th>Tên người nhận</th>
                        <th>SĐT người nhận</th>
                        <th>Tổng đơn</th>
                        <th>Phương thức thanh toán</th>
                        <th>Ngày đặt</th>
                    </tr>
                </thead>
                <tbody>
                {orders.filter(od=>od.order_status==="Đơn hủy").map((o, index) => 
                    <tr key={index}>
                        <td className="stt">{index+1}</td>
                        <td className="adormadh" onClick={()=>handleViewO(o._id)}>{o._id}</td>
                        <td>{o.order_kh.name_kh}</td>
                        <td className="stt">{o.order_kh.sdt_kh}</td>
                        <td>{o.order_price}</td>
                        <td className="stt" style={{width: "120px"}}>{o.order_pttt}</td>
                        <td>{o.order_date1}</td>
                   </tr>)}
                </tbody>
            </table>}
            </>)
        }</>
    )
}

export default AdminOrder