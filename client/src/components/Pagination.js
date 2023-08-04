import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { createDropdownItems } from '../Utils';

export default function Pagination(props) {
    const { page, setPage, itemsPerPage, setItemsPerPage, posts, options } = props;
  
    return (
        <div className="pageinationButtons">

            <Button size="small"
                variant="text"
                disabled={page <= 0}
                onClick={() => setPage(prev => prev - 1)}>
                {`<Previous`}
            </Button>

            <span >
                Showing | {(itemsPerPage * page) + 1} to {posts.length < ((page + 1) * itemsPerPage) ?
                    posts.length :
                    (page + 1) * itemsPerPage} | of {posts.length}
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
                    {createDropdownItems(Math.floor((posts.length - 1) / itemsPerPage + 1)).map((each) => {
                        return <MenuItem key={each*Math.random()} value={each - 1}>{each}</MenuItem>
                    })}
                </Select>
            </FormControl>

            <FormControl variant="standard" sx={{ m: 1, minWidth: 100 }}>
                <InputLabel id="demo-simple-select-standard-label">Items Per Page</InputLabel>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={itemsPerPage}
                    onChange={(e) => {
                        setItemsPerPage(e.target.value);
                        setPage(0);
                    }
                    }
                    label="Items Per Page"
                >
                    {createDropdownItems(options).map((each) => {
                        return <MenuItem key={each*Math.random()} value={each}>{each}</MenuItem>
                    })}
                </Select>
            </FormControl>

            <Button size="small"
                variant="text"
                disabled={page >= Math.floor(posts.length / itemsPerPage)}
                onClick={() => setPage(prev => prev + 1)}>
                {`Next>`}
            </Button>

        </div >
    )
}

