import React, {useState} from 'react';
import './SP.css'

function Counter({ quantity, setQuantity, maxQuantity  }) 
{
    const increment = () => {
        if (quantity < maxQuantity) setQuantity(quantity + 1);
    };

    const decrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };
    return( <div className="SP-counter"> 
                <button className="SP-counter-button" onClick={decrement}>-</button>
                <p className="SP-number">{quantity}</p>
                <button className="SP-counter-button" onClick={increment}>+</button>
            </div>);
}

export default Counter