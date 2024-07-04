import React, { useState, useEffect } from "react";
import axios from "axios";
import { useProduct } from "./ProductContext";
import "./Admin.css"

function ProductDetails({ productId, onClose, onSave }) {
    const { products } = useProduct();
    const [product, setProduct] = useState(null);
    //const [imageLinks, setImageLinks] = useState([]);

    useEffect(() => {
        setProduct(products.find(p => p._id === productId));
    }, [products, productId]);

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
        //const newImageLinks = [...imageLinks];
        //newImageLinks[index] = value;
        //setImageLinks(newImageLinks);
    };

    const handleColorChange = (e, index) => {
        const { value } = e.target;
        const newColors = [...product.product_color];
        newColors[index] = value;
        setProduct(prevState => ({
            ...prevState,
            product_color: newColors
        }));
        updateProductTypes(newColors, product.product_size);
    };

    const handleSizeChange = (e, index) => {
        const { value } = e.target;
        const newSizes = [...product.product_size];
        newSizes[index] = value;
        setProduct(prevState => ({
            ...prevState,
            product_size: newSizes
        }));
        updateProductTypes(product.product_color, newSizes);
    };

    const updateProductTypes = (colors, sizes) => {
        const newProductTypes = [];
        colors.forEach(color => {
            sizes.forEach(size => {
                const existingType = product.product_type.find(type => type.color === color && type.size === size);
                if (!existingType) {
                    newProductTypes.push({
                        color,
                        size,
                        quantity: 0 
                    });
                }
            });
        });
        setProduct(prevState => ({
            ...prevState,
            product_type: newProductTypes
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
            <h2>Thông tin chi tiết sản phẩm</h2><br/>
            <label className="demuc">Tên sản phẩm: 
                <input style={{width:"70%", marginLeft:"5px"}} type="text" name="product_name" value={product.product_name} onChange={handleInputChange}/>
            </label>
            <label className="demuc">Link hình ảnh:
                {product.product_link.map((link, index) => (
                    <div className="linkanhx" key={index}>
                        <input type="text" value={link} onChange={(e) => handleLinkChange(e, index)}/>
                        <div>
                        {link && <img src={link} style={{ maxWidth: '100px', maxHeight: 'auto' }} />}
                        <button type="button" onClick={() => handleRemove('product_link', index)}>Xóa</button>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={() => handleAdd('product_link')}>Thêm link</button>
            </label>
            <label className="demuc">Giá:
                <input style={{marginLeft:"5px"}} type="number" name="product_price" value={product.product_price} onChange={handleInputChange}/>
            </label>
            <label className="demuc">Màu sắc:
                {product.product_color.map((color, index) => (
                    <div key={index}>
                        <input style={{marginRight:"5px", marginBottom: "5px"}} type="text" value={color} onChange={(e) => handleColorChange(e, index)}/>
                        <button type="button" onClick={() => handleRemove('product_color', index)}>Xóa</button>
                    </div>
                ))}
                <button type="button" onClick={() => handleAdd('product_color')}>Thêm màu</button>
            </label>
            <label className="demuc">Kích thước:
                {product.product_size.map((size, index) => (
                    <div key={index}>
                        <input style={{marginRight:"5px", marginBottom: "5px"}} type="text" value={size} onChange={(e) => handleSizeChange(e, index)}/>
                        <button type="button" onClick={() => handleRemove('product_size', index)}>Xóa</button>
                    </div>
                ))}
                <button type="button" onClick={() => handleAdd('product_size')}>Thêm kích thước</button>
            </label>
            <label className="demuc">Phân loại sản phẩm:
                {product.product_type.map((type, index) => (
                    <div className="plspct" key={index}>
                        <span>{type.color} - {type.size}</span>
                        <input style={{marginRight:"5px", marginLeft: "5px"}} type="number" value={type.quantity} onChange={(e) => handleProductTypeChange(e, index)}/>
                        <button type="button" onClick={() => handleRemove('product_type', index)}>Xóa</button>
                    </div>
                ))}
                <button style={{marginTop:"5px"}} type="button" onClick={() => handleAdd('product_type')}>Thêm loại</button>
            </label>
            <label className="demuc">Tổng số lượng:
                <input style={{marginLeft: "5px"}} type="number" name="product_quantity" value={product.product_quantity} onChange={handleInputChange}/>
            </label>
            <label className="demuc">Mô tả:
                <textarea style={{marginLeft: "5px"}} name="product_description" value={product.product_description} onChange={handleInputChange}/>
            </label>
            <label className="demuc">Đánh giá:
                <input style={{marginLeft: "5px"}} type="number" name="product_rating" value={product.product_rating} onChange={handleInputChange}/>
            </label>
            <label className="demuc">Doanh thu:
                <input style={{marginLeft: "5px"}} type="number" name="product_revenue" value={product.product_revenue} onChange={handleInputChange}/>
            </label>
            <label className="demuc">Số lượng đã bán:
                <input style={{marginLeft: "5px"}} type="number" name="product_sold_quantity" value={product.product_sold_quantity} onChange={handleInputChange}/>
            </label>
            <label className="demuc">Danh mục:
                <input style={{marginLeft: "5px"}} type="text" name="product_category" value={product.product_category} onChange={handleInputChange}/>
            </label>
            <div className="demuc">
                <button className="nutcuoi" onClick={handleSave}>Lưu</button>
                <button className="nutcuoi" style={{marginLeft: "5px"}} onClick={onClose}>Hủy</button>
            </div>
        </div>
    );
}

export default ProductDetails;