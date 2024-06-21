import axios from "axios";
import { useState, useEffect } from "react";
import {useUser} from "./UserContext";
import './Admin.css';
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import {useProduct} from "./ProductContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FaPlus } from "react-icons/fa";
import ProductDetails from './ProductDetails';

function AdminProduct()
{
    const {products, setProducts } = useProduct();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [newProduct, setNewProduct] = useState({
        product_name: '',
        product_link: [],
        product_price: 0,
        product_color: [],
        product_size: [],
        product_type: [],
        product_quantity: 0,
        product_description: '',
        product_rating: 0,
        product_revenue: 0,
        product_sold_quantity: 0,
        product_category: ''
    });
    const productsPerPage = 20;
    const sortedProducts = products.sort((a, b) => a.product_category.localeCompare(b.product_category));

    const filteredProducts = sortedProducts.filter(p => 
        p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p._id.includes(searchTerm)
    );

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage-1, 1));
    };
    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(filteredProducts.length / productsPerPage)));
    };

    const handleRemoveProduct = (productid) => {
        axios.post('http://localhost:3001/remove-product', { productid })
            .then(response => {
                if (response.data.status === 'success') {
                    setProducts(products.filter(p => p._id !== productid));
                }
            })
            .catch(error => console.error(error));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddProduct = () => {
        setIsAddingProduct(true);
    };

    const handleAddLink = () => {
        setNewProduct(prevState => ({
            ...prevState,
            product_link: [...prevState.product_link, ""]
        }));
    };

    const handleLinkChange = (e, index) => {
        const { value } = e.target;
        const newLinks = [...newProduct.product_link];
        newLinks[index] = value;
        setNewProduct(prevState => ({
            ...prevState,
            product_link: newLinks
        }));
    };

    const handleAddColor = () => {
        setNewProduct(prevState => ({
            ...prevState,
            product_color: [...prevState.product_color, ""]
        }));
    };

    const handleColorChange = (e, index) => {
        const { value } = e.target;
        const newColors = [...newProduct.product_color];
        newColors[index] = value;
        setNewProduct(prevState => ({
            ...prevState,
            product_color: newColors
        }));
    };

    const handleAddSize = () => {
        setNewProduct(prevState => ({
            ...prevState,
            product_size: [...prevState.product_size, ""]
        }));
    };

    const handleSizeChange = (e, index) => {
        const { value } = e.target;
        const newSizes = [...newProduct.product_size];
        newSizes[index] = value;
        setNewProduct(prevState => ({
            ...prevState,
            product_size: newSizes
        }));
    };

    const generateProductTypes = () => {
        const productTypes = [];
        newProduct.product_color.forEach(color => {
            newProduct.product_size.forEach(size => {
                productTypes.push({ color, size, quantity: 0 });
            });
        });
        setNewProduct(prevState => ({
            ...prevState,
            product_type: productTypes
        }));
    };

    const handleProductTypeChange = (e, index) => {
        const { value } = e.target;
        const newProductTypes = [...newProduct.product_type];
        newProductTypes[index].quantity = value;
        setNewProduct(prevState => ({
            ...prevState,
            product_type: newProductTypes
        }));
    };

    const handleSaveProduct = () => {
        axios.post('http://localhost:3001/add-product', newProduct)
            .then(response => {
                if (response.data.status === 'success') {
                    setProducts([...products, response.data.product]);
                    setIsAddingProduct(false);
                    setNewProduct({
                        product_name: '',
                        product_link: [],
                        product_price: 0,
                        product_color: [],
                        product_size: [],
                        product_type: [],
                        product_quantity: 0,
                        product_description: '',
                        product_rating: 0,
                        product_revenue: 0,
                        product_sold_quantity: 0,
                        product_category: ''
                    });
                }
            })
            .catch(error => console.error(error));
    };

    const handleViewDetails = (productId) => {
        setSelectedProductId(productId);
    };

    const handleCloseDetails = () => {
        setSelectedProductId(null);
    };

    const handleSaveDetails = () => {
        // Reload the products from the server or update the products state
        axios.get('http://localhost:3001/products')
            .then(response => {
                setProducts(response.data.products);
            })
            .catch(error => console.error(error));
    };

    return(
    <>
    {isAddingProduct ? 
        (<div className="add-product-form">
            <h2>Thêm sản phẩm mới</h2>
            <br/>
            <p style={{"fontSize":"20px"}}>Nhập thông tin sản phẩm mới:</p>
            <br/>
          <div className="add-pro">
            <label>Tên: <input type="text" name="product_name" 
                value={newProduct.product_name} onChange={handleInputChange}/></label>
            <label>Link ảnh: {newProduct.product_link.map((link, index) => (
                <input key={index} type="text" name="product_link" value={link} 
                onChange={(e) => handleLinkChange(e, index)}/>))}
                <button onClick={handleAddLink}>Thêm link</button></label>
            <label>Giá: <input type="number" name="product_price" 
                value={newProduct.product_price} onChange={handleInputChange}/></label>
            <label>Màu sắc: {newProduct.product_color.map((color, index) => (
                <input key={index} type="text" name="product_color" value={color} 
                onChange={(e) => handleColorChange(e, index)}/>))}
                <button onClick={handleAddColor}>Thêm màu</button></label>
            <label>Size: {newProduct.product_size.map((size, index) => (
                <input key={index} type="text" name="product_size" value={size} 
                onChange={(e) => handleSizeChange(e, index)}/>))}
                <button onClick={handleAddSize}>Thêm size</button></label>
          <div className="adprbt">
            <button onClick={generateProductTypes}>Phân loại sản phẩm</button>
          </div>
            <label>Số lượng mỗi loại: <div style={{"height":"5px"}}/>{newProduct.product_type.map((type, index) => (
                <div className="typ" key={index}><span>{type.color} - {type.size} : </span>
                <input type="number" name="quantity" value={type.quantity} 
                onChange={(e) => handleProductTypeChange(e, index)}/></div>))}</label>
            <label>Tổng số lượng: <input type="text" name="product_quantity" 
                value={newProduct.product_quantity} onChange={handleInputChange}/></label>
            <label>Mô tả: <textarea name="product_description" 
                value={newProduct.product_description} onChange={handleInputChange}/></label>
            <label>Danh mục: <input type="text" name="product_category" 
                value={newProduct.product_category} onChange={handleInputChange}/>
                <br/><span style={{"fontSize":"15px", "color":"grey"}}>(Danh mục gồm: ao-khoac, ao-polo, ao-thun, ao-so-mi, quan-jeans, quan-short, quan-au, giay-tay, giay-the-thao)</span></label>
          <div className="adprbt">
            <button onClick={handleSaveProduct}>Tạo</button>
            <button onClick={() => setIsAddingProduct(false)}>Hủy</button>
          </div>
          </div>  
        </div>) 
    : 
        (selectedProductId ? 
            <ProductDetails productId={selectedProductId} onClose={handleCloseDetails} onSave={handleSaveDetails}/> 
        :
        <>
                <h1>Danh sách sản phẩm</h1><br/>
                <div className="sead">
                    <div className="search-container">
                        <input type="text" placeholder="Search" className="tim-kiem" onChange={handleSearchChange} />
                        <div className="search-icon"><FontAwesomeIcon icon={faSearch}/></div>
                    </div>
                    <button onClick={handleAddProduct}><FaPlus /> Thêm sản phẩm mới</button>
                </div>
                <table>
                <thead>
                    <tr>
                    <th>STT</th>
                    <th>Hình ảnh</th>
                    <th>Mã sản phẩm</th>
                    <th>Tên sản phẩm</th>
                    <th>Category</th>
                    <th>Giá</th>
                    <th>Chỉnh sửa</th>
                    <th>Xóa</th>
                    </tr>
                </thead>
                <tbody>
                {currentProducts.map((p, index) => (
                    <tr key={p._id}>
                    <td className="stt">{indexOfFirstProduct+index+1}</td>
                    <td><img className="table-img" src={p.product_link}/></td>
                    <td>{p._id}</td>
                    <td className="productname">{p.product_name}</td>
                    <td>{p.product_category}</td>
                    <td>{p.product_price}</td>
                    <td className="ttct"><div onClick={() => handleViewDetails(p._id)}>Chi tiết</div></td>
                    <td className="ttct"><div onClick={() => handleRemoveProduct(p._id)}>Xóa</div></td>
                    </tr>
                ))}
                </tbody>
                </table>
                <div className="pagination">
                    <button className="arrow" onClick={handlePrevPage} disabled={currentPage === 1}>
                    <IoMdArrowDropleft style={{"marginBottom":"-3px"}}/></button>
                    <span> {currentPage} </span>
                    <button className="arrow" onClick={handleNextPage} disabled={currentPage === Math.ceil(
                    products.length/productsPerPage)}><IoMdArrowDropright style={{"marginBottom":"-3px"}}/></button>
                </div>
        </>)
    }
    </>)
}

export default AdminProduct