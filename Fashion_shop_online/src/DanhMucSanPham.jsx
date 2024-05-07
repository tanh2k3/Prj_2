import Card from './Card.jsx'
import pic1 from './assets/Nakroth Thứ Nguyên Vệ Thần.jpg'
import pic2 from './assets/Nakroth Thứ Nguyên Vệ Thần.jpg'
import pic3 from './assets/Nakroth Thứ Nguyên Vệ Thần.jpg'
import pic4 from './assets/Nakroth Thứ Nguyên Vệ Thần.jpg'
import pic5 from './assets/Nakroth Thứ Nguyên Vệ Thần.jpg'
import pic6 from './assets/Nakroth Thứ Nguyên Vệ Thần.jpg'
import pic7 from './assets/Nakroth Thứ Nguyên Vệ Thần.jpg'
import pic8 from './assets/Nakroth Thứ Nguyên Vệ Thần.jpg'
import pic9 from './assets/Nakroth Thứ Nguyên Vệ Thần.jpg'

function DanhMucSanPham()
{
    return(
        <>
            <h1 className="dmsp">Danh mục sản phẩm</h1>
            <div className="card-zone">
            <Card pic={pic1} title="Áo khoác" className="card1"/>
            <Card pic={pic2} title="Áo sơ mi"/>
            <Card pic={pic3} title="Áo thun"/>
            <Card pic={pic4} title="Áo Polo"/>
            <Card pic={pic5} title="Quần Short"/>
            <Card pic={pic6} title="Quần Jeans"/>
            <Card pic={pic7} title="Quần Âu"/>
            <Card pic={pic8} title="Giày Tây"/>
            <Card pic={pic9} title="Giày thể thao"/>
            </div>
        </>
    );
}

export default DanhMucSanPham