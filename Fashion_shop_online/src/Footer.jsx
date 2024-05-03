function Footer()
{
    return(
        <footer>
            <p>____________________________________________________________________________________________________________________________________________________________</p>
            <div className="footer">
            <div className="footer-left">
                <h1 className="footer-h1">TuBo Club</h1>
                <p className="footer-chu">TuBo Club là thương hiệu thời trang nam mang đến phong cách độc đáo và tự tin cho người đàn ông hiện đại, với những thiết kế sáng tạo và chất lượng cao.</p>
            </div>
            <div className="footer-right">
                <p className="footer-text1">Facebook: TuBo Club</p>
                <p className="footer-text2">Instagram: @tubo.club</p>
                <p className="footer-text">Tiktok: @tubo.club</p>
            </div>
            </div>
            <p className="footer-nam">&copy; {new Date().getFullYear()} TuBo Club</p>
        </footer>
    );
}

export default Footer