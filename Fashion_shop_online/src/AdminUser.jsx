import axios from "axios";
import { useState, useEffect } from "react";
import {useUser} from "./UserContext";
import './Admin.css';
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import UserDetails from "./UserDetails";

function AdminUser()
{
    const {user} = useUser();
    const [accs, setAccs] = useState([]);
    const [kh, setKh] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const customersPerPage = 20;
    const fetchAccounts = async () => {
        try {
            const response = await axios.get('http://localhost:3001/accs');
            if (response.data.status === 'success') {
                const sortedAccs = response.data.accs.sort((a, b) => a.name.localeCompare(b.name));
                setAccs(sortedAccs);
            } else {
                console.error('Failed to fetch accounts:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };
    useEffect(() => {
        fetchAccounts();
    }, []);
    const accos = accs.filter(a => a.email!=="trantuananh.bo2093@gmail.com");
    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = accos.slice(indexOfFirstCustomer, indexOfLastCustomer);
    // Chuyển đến trang trước
    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage-1, 1));
    };

    // Chuyển đến trang sau
    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(accos.length / customersPerPage)));
    };

    const onClose =()=>{
        setKh(null);
    }
    return(
        <>
        {kh ? <UserDetails user={kh} onClose={onClose}/> : 
        <>
            <h1>Danh sách khách hàng</h1>
            <table>
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Mã khách hàng</th>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Chi tiết</th>
                </tr>
            </thead>
            <tbody>
                {currentCustomers.map((customer, index) => (
                    <tr key={customer._id}>
                        <td className="stt">{indexOfFirstCustomer+index+1}</td>
                        <td>{customer._id}</td>
                        <td>{customer.name}</td>
                        <td>{customer.email}</td>
                        <td>{customer.sdt}</td>
                        <td className="ttct"><div onClick={()=>setKh(customer)}>Thông tin chi tiết</div></td>
                    </tr>
                ))}
            </tbody>
            </table>
            <div className="pagination">
                <button className="arrow" onClick={handlePrevPage} disabled={currentPage === 1}>
                <IoMdArrowDropleft style={{"marginBottom":"-3px"}}/></button>
                <span> {currentPage} </span>
                <button className="arrow" onClick={handleNextPage} disabled={currentPage === Math.ceil(
                accos.length/customersPerPage)}><IoMdArrowDropright style={{"marginBottom":"-3px"}}/></button>
            </div>
        </>
        }
        </>
    )
}

export default AdminUser