import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MuiAlert from '@mui/material/Alert';
import React from "react"
import Rating from '@mui/material/Rating';
import Snackbar from '@mui/material/Snackbar';
import { useContext, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { TextareaAutosize } from '@mui/material';
import { UserContext } from '../UserContext';
import { formatDateAndTime } from '../Utils';

export default function Review(props) {
    const { userInfo } = useContext(UserContext);
    const [editing, setEditing] = useState(false)
    const [editOpen, setEditOpen] = useState(false);
    const [newRating, setNewRating] = useState(props.rating)
    const [newReview, setNewReview] = useState(props.review)
    const [deleteOpen, setDeleteOpen] = useState(false)

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleEditSubmit = (e, props) => {
        e.preventDefault()
        console.log(props)
        fetch(`http://localhost:4000/review/${props._id}`, {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify({ newRating, newReview, props }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            if (res.ok) {
                fetch(`http://localhost:4000/post/${props.postId}`)
                    .then(response => {
                        response.json().then(postInfo => {
                            props.dispatch({type:"setInfo",payload:postInfo});
                        });
                        setEditing(false)
                        setEditOpen(true)
                    });
            }

        })
    }

    const handleDelete = async (reviewDetails) => {
        console.log(reviewDetails, "rd")
        const { _id } = reviewDetails
        console.log(_id)
        const response = await fetch(`http://localhost:4000/review/${_id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(reviewDetails),
        })
        console.log(response)
        if (response.ok) {

            await fetch(`http://localhost:4000/post/${props.postId}`)
                .then(response => {
                    response.json().then(postInfo => {
                        props.setPostInfo(postInfo);
                    });
                    setDeleteOpen(true)
                });
        }

    }
    return (
        <Card sx={{ maxWidth: 300 }}>
            {/* ///edit alert///// */}
            <Snackbar
                open={editOpen}
                autoHideDuration={2500}
                onClose={() => setEditOpen(false)}
            >
                <Alert severity="success" sx={{ width: '100%' }}>
                    Review Updated Successfully
                </Alert>
            </Snackbar>
            {/* ///////////////////delete alert ///////*/}
            <Snackbar
                open={deleteOpen}
                anchorOrigin={{ vertical:"bottom", horizontal :"center"}}
                autoHideDuration={2500}
                onClose={() => setDeleteOpen(false)}
                message="Review Deleted Successfully"
            />
            <div className='header-container'>
            <CardHeader
                avatar={<>
                    <Avatar sx={{ bgcolor: red[400] }} aria-label="recipe">
                        {props.author.username.charAt(0)}
                    </Avatar>
                </>
                }
                title={props.author.username}
                subheader={formatDateAndTime(props.updatedAt)}
            />
            {(userInfo?.id === props?.author?._id) && (
                <div className='btn-container'>
                    <button className='ed-icon' onClick={() => handleDelete(props)}><DeleteIcon /></button>
                    {!editing && <button className='ed-icon' onClick={() => setEditing(true)}><EditIcon /></button>}
                    {editing && <button className='ed-icon' onClick={() => setEditing(false)}><CloseIcon /></button>}

                </div>
            )}
            </div>
            {!editing && <CardContent>
                <Rating
                    readOnly
                    precision={0.5}
                    value={props.rating}
                />
                <Typography variant="body2" color="text.secondary">
                    {props.review}
                </Typography>
            </CardContent>}
            {editing &&
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {props.review}
                    </Typography>
                    <form onSubmit={handleEditSubmit} >
                        <Typography component="legend">Rating</Typography>
                        <Rating
                            value={newRating}
                            defaultValue={props.rating}
                            precision={0.5}
                            onChange={(event, newValue) => {
                                setNewRating(newValue);
                            }}
                        />
                        <TextareaAutosize
                            className="textAreaMain"
                            minRows={3}
                            value={newReview}
                            placeholder={"Write ur review here"}
                            onChange={(e) => setNewReview(e.target.value)}
                        />
                        <button onClick={(e) => handleEditSubmit(e, props)} style={{ marginTop: '5px' }}>Update review</button>
                    </form>
                </CardContent>
            }
        </Card>
    );
}