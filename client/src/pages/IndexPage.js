import Post from "../Post";
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0)

  const createDropdownItems = (x) => {
    let arr = []
    for (let i = 1; i <= x; i++) {
      arr.push(i)
    }
    return arr
  }
  useEffect(() => {
    fetch('http://localhost:4000/post', { credentials: "include" }).then(response => {
      response.json().then(posts => {
        setPosts(posts);
      });
    });
  }, []);
  return (
    <>

      {posts.length === 0 && (<div style={{ containedAlign: "center" }}>No posts to show</div>)}
      {posts.length > 0 && posts.slice(page * 5, page * 5 + 5).map((post) => (
        <Post {...post} />
      ))}
      <div className="pageinationButtons">

        <Button size="small" variant="text" disabled={page === 0} onClick={() => setPage(prev => prev - 1)}>{`<Previous`}</Button>
        <span >
          Showing | {(5 * page) + 1} to {posts.length < ((page + 1) * 5) ?
            posts.length :
            (page + 1) * 5} | of {posts.length}
        </span>
         <FormControl variant="standard" sx={{ m: 1, minWidth: 60 }}>
        <InputLabel id="demo-simple-select-standard-label">Page No.</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={page}
          onChange={(e) => setPage(e.target.value)}
          label="Page no."
        >
          {createDropdownItems(Math.floor((posts.length -1)/ 5 + 1)).map((each) => {
            return <MenuItem key={each} value={each - 1}>{each}</MenuItem>
          })}
        </Select>
      </FormControl>
        <Button size="small" variant="text" disabled={page === Math.floor(posts.length / 5)} onClick={() => setPage(prev => prev + 1)}>{`Next>`}</Button>
      </div >
    </>
  );
}
