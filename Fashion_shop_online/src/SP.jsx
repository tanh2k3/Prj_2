import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import './SP.css'
import Counter from './Counter';
import { useProduct } from './ProductContext.jsx'
import { FaHeart } from "react-icons/fa6";
import {CartProvider, useCart} from './CartContext.jsx';
import axios from 'axios';
import {useUser} from './UserContext.jsx';
import CardSP from './CardSP.jsx';
import { MdAccountCircle } from "react-icons/md";

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
    const userId = user?._id;

    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hasPurchased, setHasPurchased] = useState(false); // To check if the user has purchased the product
    
    useEffect(() => {
        const fetchProductData = async () => {
            const foundProduct = products.find(p => p._id === id);
            if (foundProduct) {
                setProd(foundProduct);
                setLink(foundProduct.product_link[0]);
                setSelectedColor(foundProduct.product_color[0]);
                setSelectedSize(foundProduct.product_size[0]);
                setAvailableSizes(getAvailableSizes(foundProduct.product_type, foundProduct.product_color[0]));
                checkFavoriteStatus(foundProduct._id);
                setReviews(foundProduct.reviews || []);
    
                // Check if user has purchased the product
                try {
                    const orderResponse = await axios.get('http://localhost:3001/ordersid', { params: { userId } });
                    console.log('Order Response:', orderResponse.data);
                    if (orderResponse.data.status === 'success') {
                        const hasPurchased = orderResponse.data.orders.some(order => 
                            order.order_product.some(p => p.id_product === id)
                        );
                        setHasPurchased(hasPurchased);
                    } else {
                        console.error('Failed to fetch orders:', orderResponse.data.message);
                    }
                } catch (error) {
                    console.error('Error fetching orders:', error);
                }
            }
        };
        fetchProductData();
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
            /*...prod,
            selectedColor,
            selectedSize,
            quantity*/ 
            _id: prod._id,
            product_link: prod.product_link,
            product_name: prod.product_name,
            selectedColor: selectedColor,
            selectedSize: selectedSize,
            quantity: quantity,
            product_price: prod.product_price 
        };
        console.log(selectedColor);
        if(selectedColor!==null && selectedSize !==null && quantity >=1) {
            if (isEditing) {
                removeFromCart(originalProduct); 
                addToCart(productToAdd); 
            } else { addToCart(productToAdd); }
        }
        else {  if(selectedColor===null || selectedSize ===null || quantity <1)
                {alert("Hãy chọn size/số lượng sản phẩm.");}}
    };

    const formatDescription = (description) => {
        return description.split('\n').map((str, index) => (
            <p key={index}>{str}</p>
        ));
    };

    const handleSubmitReview = async () => {
        if (rating === 0 || comment.trim() === '') {
            alert('Please provide a rating and a comment.');
            return;
        }
    
        try {
            const response = await axios.post(`http://localhost:3001/products/${id}/review`, {
                userId,
                rating,
                comment
            });
            if (response.data.status === 'success') {
                setReviews([...reviews, { userId, rating, comment, date: new Date() }]);
                setRating(0);
                setComment('');
            } else {
                alert('Failed to submit review. Please try again later.');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('An error occurred while submitting your review.');
        }
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
                        <p style={{fontSize:"18px"}}>(Còn {prod.product_quantity} sản phẩm)</p>
                    </div>
                    <p>Rating: {prod.product_rating} / 5 ({reviews.length} đánh giá)</p>
                    <p>Đã bán: {prod.product_sold_quantity}</p>
                    <button className={isFavorite ? 'SP-button-loved' : 'SP-button-love'} onClick={toggleFavorite}>
                        <FaHeart/>
                    </button><br/>
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
                <h2>Đánh giá của khách hàng</h2><br/>
                {reviews.map((review, index) => (
                    <div key={index} className="review">
                        <div>
                            <MdAccountCircle style={{marginBottom:"-2px"}}/> 
                            <span> {review.userId}</span>
                        </div>
                        <p>Rating: {review.rating}/5</p>
                        <p>{review.comment}</p>
                    </div>
                ))}
                {hasPurchased && (
                <div className="review-form">
                    <h3>Viết đánh giá của bạn</h3>
                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                        <option value="0">Chọn số sao</option>
                        <option value="1">1 Sao</option>
                        <option value="2">2 Sao</option>
                        <option value="3">3 Sao</option>
                        <option value="4">4 Sao</option>
                        <option value="5">5 Sao</option>
                    </select>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Viết đánh giá của bạn ở đây..." />
                    <button onClick={handleSubmitReview}>Gửi đánh giá</button>
                </div>
                )}
            </div>
            <div className="SP-splq">
                <h2>Các sản phẩm tương tự</h2><br/>
                {products.filter(pr => pr.product_category===prod.product_category && pr._id !== prod._id).map((proo, index) => (
                    <Link to={`/productfilter/:category/${proo._id}`} key={index}>
                        <CardSP title={proo.product_name} pic={proo.product_link} price={proo.product_price}/>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default SP;