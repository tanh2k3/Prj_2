import {Link, useParams, useLocation } from 'react-router-dom';
import CardSP from './CardSP.jsx';
import React, { useState, useEffect } from 'react';
import { useProduct } from './ProductContext.jsx';

function ProductFilter()
{
    const {products} = useProduct();
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const {category} = useParams();
    const location = useLocation();
    const handleMinPriceChange = (e) => setMinPrice(e.target.value);
    const handleMaxPriceChange = (e) => setMaxPrice(e.target.value);
    const [filteredProduct, setFilteredProduct] = useState(products);
    const handleFilter = () => {
        if(minPrice>maxPrice) alert("Khoảng giá trị không hợp lệ. Vui lòng nhập lại.");
        else {
            const fp = filteredProduct.filter((pro) => 
            pro.product_price>=minPrice && pro.product_price<=maxPrice);
            setFilteredProduct(fp);
        }
    }
    useEffect(() => 
    {
        let searchParams = new URLSearchParams(location.search);
        let searchTerm = searchParams.get('search') || '';
        let filtered = products;
        if (category) {filtered = filtered.filter((product) => product.product_category === category);}
        if (searchTerm) {
            filtered = filtered.filter((product) => 
            product.product_name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        setFilteredProduct(filtered);
    }, [category, products, location.search] );
    return(
        <>
        <div className="trang-sp">
            <div className="trang-sp-left">
                <br/>
                <h2>Danh mục sản phẩm</h2>
                <br/>
                <Link to="/productfilter/ao-khoac" style={{textDecoration : 'none'}}><p>Áo khoác</p></Link>
                <Link to="/productfilter/ao-so-mi" style={{textDecoration : 'none'}}><p>Áo sơ mi</p></Link>
                <Link to="/productfilter/ao-thun" style={{textDecoration : 'none'}}><p>Áo thun</p></Link>
                <Link to="/productfilter/ao-polo" style={{textDecoration : 'none'}}><p>Áo Polo</p></Link>
                <Link to="/productfilter/quan-short" style={{textDecoration : 'none'}}><p>Quần Short</p></Link>
                <Link to="/productfilter/quan-jeans" style={{textDecoration : 'none'}}><p>Quần Jeans</p></Link>
                <Link to="/productfilter/quan-au" style={{textDecoration : 'none'}}><p>Quần Âu</p></Link>
                <Link to="/productfilter/giay-tay" style={{textDecoration : 'none'}}><p>Giày Tây</p></Link>
                <Link to="/productfilter/giay-the-thao" style={{textDecoration : 'none'}}><p>Giày thể thao</p></Link>
                <div>
                    <br/>
                    <h2>Khoảng giá</h2>
                    <div>
                        <div className="kg">Từ: </div>
                        <input className='kg-input' type="number" value={minPrice} 
                        onChange={handleMinPriceChange}/>
                        <div className="kg">Đến: </div>
                        <input className='kg-input' type="number" value={maxPrice} 
                        onChange={handleMaxPriceChange}/>
                        <br/>
                        <button className="kg-button" 
                        onClick={handleFilter}>Lọc</button>
                    </div>
                </div>
            </div>
            <div className="trang-sp-right">
                <br/>
                <h2>Danh sách sản phẩm</h2>
                <div>
                {filteredProduct.map((pro) => (<Link to={`/productfilter/:category/${pro._id}`} 
                key={pro._id}><CardSP key={pro._id} title={pro.product_name} 
                pic={pro.product_link} price={pro.product_price}/></Link>))}
                </div>
            </div>
        </div>
        </>
    )
}

export default ProductFilter