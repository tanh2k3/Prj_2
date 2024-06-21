import Bar from './Bar'
import Footer from './Footer'
import CardGH from './CardGH'
import { useCart } from './CartContext';
import { useProduct } from './ProductContext';
import { Link } from 'react-router-dom';

function GioHang()
{
    const { cart } = useCart();
    const calculateTotal = () => {
        return cart.reduce((total, item) => 
        total + (item.product_price * item.quantity), 0);
    };
    const calculateTt = () => {
        return cart.reduce((tt, item) => 
        tt + item.quantity, 0);
    };
    const { products } = useProduct();
    return(
        <div>
            <div style={{"height" : "10px"}}></div>
            <h1 style={{fontFamily : 'Arial', marginLeft : '50px'}}>Giỏ hàng của bạn</h1>
            <h3 style={{fontFamily : 'Arial', marginLeft : '50px', padding : '10px'}}>TỔNG CỘNG: {calculateTotal()}₫</h3>
            <div className='giohang'>
            <div className="cardgh-zone">
            {cart.length > 0 ? (
                <div className="cart-main">
                    {cart.map((product, index) => (
                        <CardGH key={index} product={product} />
                    ))}
                </div>
            ) : (
                <p>Giỏ hàng của bạn đang trống.</p>
            )}
            </div>
            <div className='gh-form'>
                <form>
                    <h2>Thông tin đặt hàng</h2>
                    <div>  
                        <input className='gh-form-input' type='text' placeholder='Họ và tên'/>
                    </div>
                    <div> 
                        <input className='gh-form-input' type='text' placeholder='Số điện thoại'/>
                    </div>
                    <div>
                        <input className='gh-form-input' type='text' placeholder='Địa chỉ'/>
                    </div>
                <div className='gh-form-h'>Tổng tiền: {calculateTotal()}₫ ({calculateTt()} sản phẩm)</div>
                <div className='gh-form-h'>Phương thức thanh toán:</div>
                <div className='gh-form-label'>
                <label>
                    <input name='pttt' value="MOMO" type="radio"/> MOMO
                </label>
                <label>
                    <input name='pttt' value="COD" type="radio"/> Thanh toán khi giao hàng
                </label>
                </div>
                <div className='gh-form-h'>Áp dụng Voucher 
                    <input type='text' placeholder='Mã Voucher'/>
                </div>
                <div className='gh-form-button'><button type='submit'>Tiếp tục</button></div>
                </form>
            </div>
            </div>
            <Link to="/payment">Thanh toán</Link>
        </div>
    )
}

export default GioHang