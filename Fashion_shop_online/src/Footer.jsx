import { FaCircle } from "react-icons/fa";

function Footer()
{
    return(
        <footer className="fter">
            <hr/>
            <div className="footer">
              <h1>TuBo Club</h1>
              <br/>
              <p className="footer-chu">TuBo Club là thương hiệu thời trang nam mang đến phong cách độc đáo và tự tin cho người đàn ông hiện đại</p>
              <p className="footer-chu">với những thiết kế sáng tạo và chất lượng cao.</p>
              <br/>
              <p className="footer-mxh">Facebook: TuBo Club <FaCircle style={{fontSize : '5px'}} /> Instagram: @tubo.club <FaCircle style={{fontSize : '5px'}}/> Tiktok: @tubo.club</p>
              <br/>
            </div>
            <p className="footer-nam">&copy; {new Date().getFullYear()} TuBo Club</p>
        </footer>
    );
}

export default Footer