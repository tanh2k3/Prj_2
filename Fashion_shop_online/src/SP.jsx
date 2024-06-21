import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './SP.css'
import Counter from './Counter';
import { useProduct } from './ProductContext.jsx'
import { FaHeart } from "react-icons/fa6";
import {CartProvider, useCart} from './CartContext.jsx';
import axios from 'axios';
import {useUser} from './UserContext.jsx';

function SP() 
{
    const {user} = useUser();
    const navigate = useNavigate();
    const {products} = useProduct();
    const { addToCart, removeFromCart } = useCart();
    const { id } = useParams();
    const location = useLocation();
    const [prod, setProd] = useState(null);
    const [link, setLink] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [originalProduct, setOriginalProduct] = useState(null);
    const [availableSizes, setAvailableSizes] = useState([]);
    const [maxQuantity, setMaxQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const userId = user._id;
    
    useEffect(() => {
        const foundProduct = products.find(p => p._id === id);
        if (foundProduct) {
            setProd(foundProduct);
            setLink(foundProduct.product_link[0]);
            setSelectedColor(foundProduct.product_color[0]);
            setSelectedSize(foundProduct.product_size[0]);
            setAvailableSizes(getAvailableSizes(foundProduct.product_type, foundProduct.product_color[0]));
            checkFavoriteStatus(foundProduct._id);
        }
    }, [id, products]);

    const checkFavoriteStatus = (productId) => {
        axios.get('http://localhost:3001/favorites', { params: { userId } })
            .then(response => {
                if (response.data.status === 'success') {
                    const favoriteProductIds = response.data.favorites.map(f => f.fp_id_sp);
                    setIsFavorite(favoriteProductIds.includes(productId));
                }
            })
            .catch(error => console.error(error));
    };

    const toggleFavorite = () => {
        if (isFavorite) {
            axios.post('http://localhost:3001/remove-favorite', { userId, productId: prod._id })
                .then(response => {
                    if (response.data.status === 'success') {
                        setIsFavorite(false);
                    }
                })
                .catch(error => console.error(error));
        } else {
            axios.post('http://localhost:3001/add-favorite', { userId, productId: prod._id })
                .then(response => {
                    if (response.data.status === 'success') {
                        setIsFavorite(true);
                    }
                })
                .catch(error => console.error(error));
        }
    };

    useEffect(() => {
        if (location.state?.editProduct) {
            const editProduct = location.state.editProduct;
            setSelectedColor(editProduct.selectedColor);
            setSelectedSize(editProduct.selectedSize);
            setQuantity(editProduct.quantity);
            setIsEditing(true);
            setOriginalProduct(editProduct);
        }
    }, [location.state]);

    useEffect(() => {
        if (prod) {
            const availableSizes = getAvailableSizes(prod.product_type, selectedColor);
            setAvailableSizes(availableSizes);
            if (!availableSizes.includes(selectedSize)) {
                setSelectedSize(availableSizes[0]);
            }
            const maxQty = getMaxQuantity(prod.product_type, selectedColor, selectedSize);
            setMaxQuantity(maxQty);
            if (quantity > maxQty) {
                setQuantity(maxQty);
            }
            axios.get('http://localhost:3001/favorites', { params: { userId } })
                .then(response => {
                    if (response.data.status === 'success') {
                        const isFav = response.data.favorites.some(fav => fav.fp_id_sp._id === prod._id);
                        setIsFavorite(isFav);
                    }
                })
                .catch(error => console.error('API Error:', error));
        }
    }, [selectedColor, selectedSize, prod, userId]);

    const getAvailableSizes = (productTypes, color) => {
        return productTypes
            .filter(type => type.color === color && type.quantity > 0)
            .map(type => type.size);
    };

    const getMaxQuantity = (productTypes, color, size) => {
        const productType = productTypes.find(type => type.color === color && type.size === size);
        return productType ? productType.quantity : 1;
    };

    if (!prod) {return <h2>Không tìm thấy sản phẩm!</h2>;}

    const handleAddToCart = () => {
        const productToAdd = {
            ...prod,
            selectedColor,
            selectedSize,
            quantity
        };
        if(selectedColor!==null && selectedSize !==null && quantity >=1)
        {if (isEditing) {
            removeFromCart(originalProduct); 
            addToCart(productToAdd); 
        } else {
            addToCart(productToAdd);
        }}
        else
        { 
            if(selectedColor===null || selectedSize ===null || quantity <1)
            {alert("Hãy chọn size/số lượng sản phẩm.");}}
    };

    const formatDescription = (description) => {
        return description.split('\n').map((str, index) => (
            <p key={index}>{str}</p>
        ));
    };
    return (
        <div>
            <div className="SP-main">
                <img src={link}/>
                <div className="SP-in4">
                    <h1>{prod.product_name}</h1>
                    <div className='msp'>Mã sản phẩm: {prod._id}</div>
                    <br/>
                    <div style={{"display":"flex"}}>
                        <p>Giá: </p>
                        <div className='gia'>{prod.product_price}₫</div>
                    </div>
                    <p>Màu sắc: {prod.product_color.map((product_color, index) => 
                        (<button className={selectedColor===product_color ? 'SP-button-colored' : 'SP-button-color'} key={index}
                        onClick={() => setSelectedColor(product_color)}>
                        {product_color}</button>))}
                    </p>
                    <p>Size: {prod.product_size.map((product_size, index) => 
                        (<button className={selectedSize===product_size ? 'SP-button-colored' : 'SP-button-color'} key={index}
                        onClick={() => setSelectedSize(product_size)} disabled={!availableSizes.includes(product_size)}>
                        {product_size}</button>))}
                    </p>
                    <div className='SP-counter'>
                        <p>Số lượng: </p>
                        <Counter quantity={quantity} setQuantity={setQuantity} maxQuantity={maxQuantity}/>
                    </div>
                    <button className={isFavorite ? 'SP-button-loved' : 'SP-button-love'} onClick={toggleFavorite}><FaHeart /></button>
                    <br/>
                    <button className='SP-button' type="button" onClick={handleAddToCart}>
                        {isEditing ? 'Cập nhật giỏ hàng' : 'Thêm vào giỏ hàng'}
                    </button>
                    <button className='SP-button' type="submit">Mua ngay</button>
                </div>
            </div>
            <div className='img-bar'>
                {prod.product_link.map((pro, index) => 
                (<img key={index} className='img-item' src={pro} 
                onClick={()=>{setLink(pro);}}/>))}
            </div>
            <div className="SP-mota">
                <h2>Mô tả sản phẩm</h2>
                {formatDescription(prod.product_description)}
            </div>
            <div className="SP-danhgia">
                <h2>Đánh giá của khách hàng</h2>
            </div>
            <div className="SP-splq">
                <h2>Các sản phẩm bạn có thể quan tâm</h2>
            </div>
        </div>
    );
}

export default SP;