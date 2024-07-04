import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

function Chat() 
{
    const handleClick = () => {
        window.open('https://www.facebook.com/dhbkhanoi', '_blank');
    };

    return(
        <div className="chat-bubble" onClick={handleClick}>
            <IoChatbubbleEllipsesOutline className="chat-icon"/>
        </div>
    )
}

export default Chat