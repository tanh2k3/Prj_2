import { useCart } from "./CartContext"
import {Link, useNavigate } from 'react-router-dom';
import { useState } from "react";

function CardGH({ product })
{
    const { removeFromCart, updateCart } = useCart();
    const navigate = useNavigate();
    const handleRemove = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?')) 
        {removeFromCart(product);}
    };
    const handleEdit = () => {
        navigate(`/productfilter/:category/${product._id}`, { state: { editProduct: product, isEditing: true } });
    };
    const handlelick = () => {
        navigate(`/productfilter/:category/${product._id}`);
    }
    return(
        <div className="cardgh">
            <img onClick={handlelick} src={product.product_link}/>
            <div className="cardgh-text">
                <p style={{"height" : "40px"}}>{product.product_name}</p>
                <p>Màu: {product.selectedColor}</p>
                <p>Size: {product.selectedSize}</p>
                <p>Số lượng: {product.quantity}</p>
                <p>Giá: {product.product_price}₫</p>
                <div className="cardghprice">
                    <div className="cargh-pr">Tổng: </div>
                    <div className="cardgh-price">{product.product_price * product.quantity}₫</div>
                </div>
            </div>
            <div className='cardgh-button'>
                <button onClick={handleEdit}>Sửa</button>
                <button onClick={handleRemove}>Xóa</button>
            </div>
        </div>
    )
}

export default CardGH