import Card from './Card.jsx'
import {Link} from 'react-router-dom'
import pic1 from './assets/pic1.png'
import pic2 from './assets/pic2.png'
import pic3 from './assets/pic3.jpg'
import pic4 from './assets/pic4.png'
import pic5 from './assets/pic5.png'
import pic6 from './assets/pic6.png'
import pic7 from './assets/pic7.png'
import pic8 from './assets/pic8.jpg'
import pic9 from './assets/pic9.jpg'

function DanhMucSanPham()
{
    return(
        <>
            <h1 className="dmsp">Danh mục sản phẩm</h1>
            <div className="card-zone">
            <Link to="/productfilter/ao-khoac"><Card pic={pic1} title="Áo khoác"/></Link>
            <Link to="/productfilter/ao-so-mi"><Card pic={pic2} title="Áo sơ mi"/></Link>
            <Link to="/productfilter/ao-thun"><Card pic={pic3} title="Áo thun"/></Link>
            <Link to="/productfilter/ao-polo"><Card pic={pic4} title="Áo Polo"/></Link>
            <Link to="/productfilter/quan-short"><Card pic={pic5} title="Quần Short"/></Link>
            <Link to="/productfilter/quan-jeans"><Card pic={pic6} title="Quần Jeans"/></Link>
            <Link to="/productfilter/quan-au"><Card pic={pic7} title="Quần Âu"/></Link>
            <Link to="/productfilter/giay-tay"><Card pic={pic8} title="Giày Tây"/></Link>
            <Link to="/productfilter/giay-the-thao"><Card pic={pic9} title="Giày thể thao"/></Link>
            </div>
        </>
    );
}

export default DanhMucSanPham