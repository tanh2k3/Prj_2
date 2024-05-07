import './LoginPage.css';
import { FaUser, FaLock } from "react-icons/fa";
import {Link} from 'react-router-dom';

function LoginPage()
{
  return(
    <div className="lgp">
    <div className="wrapper">
      <form action="">
        <h1>Đăng nhập</h1>
        <div className="input-box">
          <input type="text" placeholder="User name" required/>
          <FaUser className="icon"/>
        </div>
        <div className="input-box">
          <input type="password" placeholder="Password" required/>
          <FaLock className="icon" />
        </div>
        <button type="submit">Login</button>
        <div className="register-link">
          <p>Chưa có tài khoản ? <Link to="/register" className="a">Đăng ký</Link></p>
        </div>
      </form>
    </div>
    </div>
  );
}

export default LoginPage