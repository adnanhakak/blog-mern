import Post from "../Post";
import Pagination from "../components/Pagination";
import { useEffect, useState } from "react";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5)

  useEffect(() => {
    fetch('http://localhost:4000/post', { credentials: "include" }).then(response => {
      response.json().then(posts => {
        setPosts(posts);
      });
    });
  }, []);
  return (
    <>
      {!posts.length &&
        (<div style={{ textAlign: "center" }}>No posts to show</div>)}
      {posts.length &&
        posts.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage).map((post) => (
          <Post {...post} />
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
