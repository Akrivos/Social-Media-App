import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { withRouter } from 'react-router';
import { CommentContext } from '../context/CommentsOfPostContext';
import { PostContext } from '../context/PostsOfProfileContext';

const DeletePopupBox = (props) => {
    const postsContext = useContext(PostContext);
    const commentsContext = useContext(CommentContext);

    const [open, setOpen] = useState(props.openPopup);

    const onDeleteButton = async() => {
        const userID = JSON.parse(localStorage.getItem('userID'));

        if(props.title === "post"){
            await axios.delete(`http://localhost:5000/post/deletePost/${userID}/${props.id}`);
            props.openPopupFunction(false);
            setOpen(false);
            postsContext.updatePostsToggle();
        }else{
            await axios.delete(`http://localhost:5000/comment/deleteComment/${props.id}`)
            props.openPopupFunction(false);
            setOpen(false);
            commentsContext.updateCommentsToggle()
        }
    }

    const cancelFunction = () => {
        props.openPopupFunction(false);
        setOpen(false);
    }

    return(
        <Box>
            <Dialog
                open={open}
                onClose={cancelFunction}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">Are you sure?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure that you want to delete this {props.title}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={cancelFunction} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={onDeleteButton} color="primary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default DeletePopupBox;