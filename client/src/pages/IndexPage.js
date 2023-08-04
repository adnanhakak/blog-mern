import Post from "../Post";
import Pagination from "../components/Pagination";
import { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:4000/post', { credentials: "include" }).then(response => {
      response.json().then(posts => {
        setPosts(posts);
        setLoading(false)
      });
    });
  }, []);
  
  return (
    <>
      {loading && 
      <div style={{ textAlign: "center" }}><CircularProgress /></div> }

      {!posts.length &&
        (<div style={{ textAlign: "center" }}>No posts to show</div>)}
      {!!posts.length &&
        posts.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage).map((post, i) => (
          <Post {...post} key={i * Math.random()} />
        ))}

      <Pagination
        page={page}
        setPage={setPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        posts={posts}
        options={[5, 10, 15]}
      />

    </>
  );
}
