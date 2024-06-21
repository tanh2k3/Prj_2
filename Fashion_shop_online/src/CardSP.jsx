import { FaCartPlus } from "react-icons/fa6";
import { useCart } from "./CartContext";

function CardSP(props) 
{
    const {cart,addToCart} = useCart();
    const showcart = () => {console.log(cart);};
    return (
        <div className="cardsp">
            <img className="cardsp-image" src={props.pic} alt={props.title}/>
            <p className="cardsp-title">{props.title}</p>
            <p className="cardsp-price">{props.price}₫</p>
            <button className="cardsp-button" onClick={()=>{addToCart(props);}}><FaCartPlus className="cart-icon"/></button>
        </div>
    );
}

export default CardSP;