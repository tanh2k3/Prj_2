import React, { useState, useEffect } from "react";
import axios from "axios";
import { useProduct } from "./ProductContext";

function ProductDetails({ productId, onClose, onSave }) {
    const { products } = useProduct();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        setProduct(products.find(p => p._id === productId));
    }, [products]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleLinkChange = (e, index) => {
        const { value } = e.target;
        const newLinks = [...product.product_link];
        newLinks[index] = value;
        setProduct(prevState => ({
            ...prevState,
            product_link: newLinks
        }));
    };

    const handleColorChange = (e, index) => {
        const { value } = e.target;
        const newColors = [...product.product_color];
        newColors[index] = value;
        setProduct(prevState => ({
            ...prevState,
            product_color: newColors
        }));
    };

    const handleSizeChange = (e, index) => {
        const { value } = e.target;
        const newSizes = [...product.product_size];
        newSizes[index] = value;
        setProduct(prevState => ({
            ...prevState,
            product_size: newSizes
        }));
    };

    const handleProductTypeChange = (e, index) => {
        const { value } = e.target;
        const newProductTypes = [...product.product_type];
        newProductTypes[index].quantity = value;
        setProduct(prevState => ({
            ...prevState,
            product_type: newProductTypes
        }));
    };

    const handleAdd = (arrayName) => {
        setProduct(prevState => ({
            ...prevState,
            [arrayName]: [...prevState[arrayName], '']
        }));
    };

    const handleRemove = (arrayName, index) => {
        const newArray = [...product[arrayName]];
        newArray.splice(index, 1);
        setProduct(prevState => ({
            ...prevState,
            [arrayName]: newArray
        }));
    };

    const handleSave = () => {
        axios.post(`http://localhost:3001/update-product/${productId}`, product)
            .then(response => {
                if (response.data.status === 'success') {
                    onSave();
                    onClose();
                }
            })
            .catch(error => console.error(error));
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="product-details">
            <h2>Chi tiết sản phẩm</h2>
            <label>Tên sản phẩm:
                <input type="text" name="product_name" value={product.product_name} onChange={handleInputChange}/>
            </label>
            <label>Link hình ảnh:
                {product.product_link.map((link, index) => (
                    <div key={index}>
                        <input type="text" value={link} onChange={(e) => handleLinkChange(e, index)}/>
                        <button type="button" onClick={() => handleRemove('product_link', index)}>Xóa</button>
                    </div>
                ))}
                <button type="button" onClick={() => handleAdd('product_link')}>Thêm link</button>
            </label>
            <label>Giá:
                <input type="number" name="product_price" value={product.product_price} onChange={handleInputChange}/>
            </label>
            <label>Màu sắc:
                {product.product_color.map((color, index) => (
                    <div key={index}>
                        <input type="text" value={color} onChange={(e) => handleColorChange(e, index)}/>
                        <button type="button" onClick={() => handleRemove('product_color', index)}>Xóa</button>
                    </div>
                ))}
                <button type="button" onClick={() => handleAdd('product_color')}>Thêm màu</button>
            </label>
            <label>Kích thước:
                {product.product_size.map((size, index) => (
                    <div key={index}>
                        <input type="text" value={size} onChange={(e) => handleSizeChange(e, index)}/>
                        <button type="button" onClick={() => handleRemove('product_size', index)}>Xóa</button>
                    </div>
                ))}
                <button type="button" onClick={() => handleAdd('product_size')}>Thêm kích thước</button>
            </label>
            <label>Loại sản phẩm:
                {product.product_type.map((type, index) => (
                    <div key={index}>
                        <span>{type.color} - {type.size}</span>
                        <input type="number" value={type.quantity} onChange={(e) => handleProductTypeChange(e, index)}/>
                        <button type="button" onClick={() => handleRemove('product_type', index)}>Xóa</button>
                    </div>
                ))}
                <button type="button" onClick={() => handleAdd('product_type')}>Thêm loại</button>
            </label>
            <label>Tổng số lượng:
                <input type="number" name="product_quantity" value={product.product_quantity} onChange={handleInputChange}/>
            </label>
            <label>Mô tả:
                <textarea name="product_description" value={product.product_description} onChange={handleInputChange}/>
            </label>
            <label>Đánh giá:
                <input type="number" name="product_rating" value={product.product_rating} onChange={handleInputChange}/>
            </label>
            <label>Doanh thu:
                <input type="number" name="product_revenue" value={product.product_revenue} onChange={handleInputChange}/>
            </label>
            <label>Số lượng đã bán:
                <input type="number" name="product_sold_quantity" value={product.product_sold_quantity} onChange={handleInputChange}/>
            </label>
            <label>Danh mục:
                <input type="text" name="product_category" value={product.product_category} onChange={handleInputChange}/>
            </label>
            <button onClick={handleSave}>Lưu</button>
            <button onClick={onClose}>Hủy</button>
        </div>
    );
}

export default ProductDetails;
