import avt from './avt.jpg'
import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Bar()
{
  const [hienThiOptions1, setHienThiOptions1] = useState(false);
  const hienThiCacOption1 = () => {setHienThiOptions1(true);};
  const anCacOption1 = () => {
    setTimeout(() => {
      setHienThiOptions1(null);}, 2000);};

  const [hienThiOptions2, setHienThiOptions2] = useState(false);
  const hienThiCacOption2 = () => {setHienThiOptions2(true);};
  const anCacOption2 = () => {
    setTimeout(() => {
      setHienThiOptions2(null);}, 2000);};

  const [hienThiOptions3, setHienThiOptions3] = useState(false);
  const hienThiCacOption3 = () => {setHienThiOptions3(true);};
  const anCacOption3 = () => {
    setTimeout(() => {
      setHienThiOptions3(null);}, 2000);};

  return(
    <>
      <div className="navbar">
        <img src={avt} className="logo"/>
        <div className="buttons">
          <div onMouseEnter={hienThiCacOption1} onMouseLeave={anCacOption1}
          className="nav-button">Áo</div>
            {hienThiOptions1 && (
              <div className="Options1">
                <p className="Option">Áo khoác</p>
                <p className="Option">Áo sơ mi</p>
                <p className="Option">Áo thun</p>
                <p className="Option">Áo Polo</p>
              </div>
            )}
          <div onMouseEnter={hienThiCacOption2} onMouseLeave={anCacOption2}
          className="nav-button" >Quần</div>
          {hienThiOptions2 && (
              <div className="Options2">
                <p className="Option">Quần Short</p>
                <p className="Option">Quần Jeans</p>
                <p className="Option">Quần Âu</p>
              </div>
            )}
          <div onMouseEnter={hienThiCacOption3} onMouseLeave={anCacOption3}
          className="nav-button">Giày</div>
          {hienThiOptions3 && (
              <div className="Options3">
                <p className="Option">Giày Tây</p>
                <p className="Option">Giày thể thao</p>
              </div>
            )}
        </div>
        <div className="search-container">
          <input type="text" placeholder="Search" className="tim-kiem"/>
          <div className="search-icon">
            <FontAwesomeIcon icon={faSearch}/>
          </div>
        </div>
        <div className="extra-buttons">
          <Link style={{textDecoration : 'none'}} 
          to="/login" className="nav2">Đăng nhập</Link>
          <Link style={{textDecoration : 'none'}} 
          to="/register" className="nav2">Đăng ký</Link>
        </div>
      </div>
    </>
  );
}

export default Bar