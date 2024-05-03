function Card(props)
{
    return(
        <div className="card">
            <img className="card-image" src={props.pic} alt={props.title}/>
            <h2 className="card-title">{props.title}</h2>
        </div>
    );
}

export default Card