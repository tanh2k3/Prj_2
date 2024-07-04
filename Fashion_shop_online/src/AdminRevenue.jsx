import axios from "axios";
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useProduct } from "./ProductContext";
import './Admin.css';

function AdminRevenue() 
{

    const {products} = useProduct();
    const [products_sold, setProducts_sold] = useState(products.sort((a, b) => b.product_sold_quantity - a.product_sold_quantity).slice(0,5));
    const [products_revenue, setProducts_revenue] = useState(products.sort((a, b) => b.product_revenue - a.product_revenue).slice(0,5));
    const [revenue, setRevenue] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [averageIncome, setAverageIncome] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    
    useEffect(() => {
        axios.get('http://localhost:3001/api/revenue')
            .then((response) => {
                setRevenue(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
        axios.get('http://localhost:3001/api/users/number')
            .then((response) => {
                setTotalUsers(response.data);
            })
            .catch((err) => {
                console.log(err);
            })
    },[])
    
    const [options, setOptions] = useState({
    chart: {
        type: 'column'
    },
    title: {
        text: 'Doanh thu theo tháng'
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
        min: 0,
        title: {
        text: 'Doanh thu (000 VND)'
        }
    },
    series: []
    });

    useEffect(() => {
        let data = [];
        revenue.forEach((item) => {
            data.push({
                name: item.year,
                data: item.revenue
            });
        });
        console.log(data);
        setOptions({...options, series: data})
    }, [revenue]);

    useEffect(() => {
        let total = 0;
        let count = 0;
        revenue.forEach((item) => {
            item.revenue.forEach((month) => {
                total += month;
                if (month > 0) count++;
            });
        });
        setTotalIncome(total);
        setAverageIncome(Math.floor(total/count));
    }, [revenue]);

    useEffect(() => {
        setProducts_sold(products.sort((a, b) => b.product_sold_quantity - a.product_sold_quantity).slice(0,5));
        setProducts_revenue(products.sort((a, b) => b.product_revenue - a.product_revenue).slice(0,5));
    }, [products]);

    return ( 
        <>
            <HighchartsReact highcharts={Highcharts} options={options} />
            <div>
                <p>Tổng doanh thu: {totalIncome}</p>
                <p>Doanh thu trung bình mỗi tháng: {averageIncome}</p>
                <p>Số lượng khách hàng: {totalUsers}</p><br/>
            </div>
            <div>
                <h2>Top 5 sản phẩm bán chạy nhất</h2><br/>
                <div style={{display: "flex"}}>
                    {products_sold.map((product, index) => (
                        <div key={index} className="cardspp">
                            <img className="cardspp-image" src={product.product_link[0]} />
                            <p className="cardspp-title">{product.product_name}</p>
                            <p className="cardspp-price">{product.product_price}đ</p>
                            <p className="cardspp-price">Đã bán: {product.product_sold_quantity}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div><br/>
            <h2>Top 5 sản phẩm có doanh thu cao nhất</h2><br/>
                <div style={{display: "flex"}}>
                    {products_revenue.map((product, index) => (
                        <div key={index} className="cardspp">
                            <img className="cardspp-image" src={product.product_link[0]} />
                            <p className="cardspp-title">{product.product_name}</p>
                            <p className="cardspp-price">{product.product_price}VND</p>
                            <p className="cardspp-price">Doanh thu: {product.product_sold_quantity*product.product_price}đ</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default AdminRevenue