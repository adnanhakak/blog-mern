import { useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import { Link } from 'react-router-dom';
import MuiAlert from '@mui/material/Alert';
import React from "react"
import Snackbar from '@mui/material/Snackbar';
import { TextareaAutosize } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Review from "../components/Review";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false)
  const { id } = useParams();
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [review, setReview] = useState("")
  const [editOpen, setEditOpen] = useState(false);
  const [rating, setRating] = useState(3.5)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:4000/review/${id}`, {
      method: 'POST',
      body: JSON.stringify({ rating, review, id }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      await fetch(`http://localhost:4000/post/${id}`)
        .then(response => {
          response.json().then(postInfo => {
            setPostInfo(postInfo);
            setReview('');
            setRating(5);
            setEditOpen(true)
          });
        });
    }
  };

  const handleDelete = () => {
    fetch(`http://localhost:4000/post/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    }).then((res) => {
      console.log(res)
      if (res.ok === true) {
        toast.success('Post deleted successfully!', {
          position: toast.POSITION.CENTER,
        });
        setRedirect(true);
      }
    })
  }

  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`)
      .then(response => {
        response.json().then(postInfo => {
          setPostInfo(postInfo);
        });
      });
  }, []);

  if (!postInfo) return '';
  if (redirect) {
    return <Navigate to={"/"} />
  }
  return (
    <div className="post-page">
      <Snackbar
        open={editOpen}
        autoHideDuration={2500}
        onClose={() => setEditOpen(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Review Created Successfully
        </Alert>
      </Snackbar>
      <h1>{postInfo.title}</h1>
      <Rating
      className="ratingPost"
        readOnly
        value={postInfo.reviews.reduce((acc, curr) => acc + curr.rating, 0) / postInfo.reviews.length}
      />
      <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
      <div className="author">by @{postInfo.author.username}</div>
      {userInfo?.id === postInfo?.author?._id && (
        <div className="edit-row">
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Edit this post
          </Link>
          <Link className="edit-btn" onClick={handleDelete} style={{ marginLeft: "8px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            delete this post
          </Link>
        </div>
      )}
      <div className="image">
        <img src={`http://localhost:4000/${postInfo.cover}`} alt="" />
      </div>
      <div className="content" dangerouslySetInnerHTML={{ __html: postInfo.content }} />

      <h2 style={{ textDecoration: "underline" }}>Reviews</h2>

      {userInfo?.id && (<form onSubmit={handleSubmit} >
        <Typography component="legend">Rating</Typography>
        <Rating
          value={rating}
          defaultValue={3.5}
          precision={0.5}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
        />
        <TextareaAutosize
          className="textAreaMain"
          minRows={3}
          value={review}
          placeholder={"Write ur review here"}
          onChange={(e) => setReview(e.target.value)}
        />
        <button onClick={handleSubmit} style={{ marginTop: '5px', marginBottom: "40px" }}>Post review</button>
      </form>)}

      {postInfo.reviews.map((post) => {
        return (
          <div className="reviews">
            <Review {...post} setPostInfo={setPostInfo} postId={id} />
          </div>)
      })}
    </div>
  );
}