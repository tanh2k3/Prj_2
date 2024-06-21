import React from 'react';
import QrCode from 'qrcode.react';

function PaymentPage()
{
    const money = 5000;
    const message = "Thanh toan hoa don TuBo Club";
    return (
        <div>
            <h1>Thanh Toán Momo</h1>
            <QrCode value={`2|99|0989045854|||0|0|${money}|${message}|transfer_myqr|63111828`}/>
        </div>
    );
};

export default PaymentPage;
