import './RegisterPage.css';
import { FaUser, FaLock } from "react-icons/fa";
import {Link} from 'react-router-dom';

function RegisterPage()
{
  return(
    <div className="rgtp">
    <div className="wrapper2">
      <form action="">
        <h1>Đăng ký</h1>
        <div className="input-box2">
          <input type="text" placeholder="User name" required/>
          <FaUser className="icon"/>
        </div>
        <div className="input-box2">
          <input type="text" placeholder="Họ" required/>
        </div>
        <div className="input-box2">
          <input type="text" placeholder="Tên" required/>
        </div>
        <div className="input-box2">
          <input type="text" placeholder="Email" required/>
        </div>
        <div className="input-box2">
          <input type="date" placeholder="Ngày sinh" required/>
        </div>
        <div className="input-box2">
          <input type="password" placeholder="Password" required/>
          <FaLock className="icon" />
        </div>
        <button type="submit">Submit</button>
        <div className="register-link">
          <p>Đã có tài khoản ? <Link to="/login" className="a">Đăng nhập</Link></p>
        </div>
      </form>
    </div>
    </div>
  );
}

export default RegisterPage