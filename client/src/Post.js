import {formatISO9075} from "date-fns";
import Rating from '@mui/material/Rating';
import {Link} from "react-router-dom";

export default function Post({_id,title,summary,cover,reviews,createdAt,author}) {
 let totalRating= reviews.reduce((total,curr)=>total+curr.rating,0)/reviews.length
  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={'http://localhost:4000/'+cover} alt=""/>
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
        <h2>{title}</h2>
        </Link>
        <Rating
          readOnly
          value={totalRating}
          precision={0.5}
        />
        <p className="info">
          <a className="author">{author.username}</a>
          <time>{formatISO9075(new Date(createdAt))}</time>
      
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}