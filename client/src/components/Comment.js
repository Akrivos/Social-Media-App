import { Avatar, Badge, Box, Card, CardMedia, IconButton, Link, makeStyles, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import axios from 'axios';
import DeletePopupBox from './DeletePopupBox';

const useStyles = makeStyles((theme) => ({
    boxContainer:{
        width:"100%",
        backgroundColor:"white",
        display:"flex",
        paddingTop:5,
        paddingBottom:5,
        borderTop:"1px solid silver",
        borderBottom:"1px solid silver"
    },
    avatarStyle:{
        //margin: '1rem'
        // marginLeft:15,
        // marginTop:10,
        // marginBottom:10,
        // marginRight:15
    },
    thumbsStyle:{
        display:"flex",
        color:"#616161",
        fontSize:15,
        marginTop:2,
        marginRight:10,
        cursor:"pointer"
    },
    contentStyle:{
        backgroundColor:"#e8eaf6",
        padding:10,
        borderRadius: 10,
        width:"90%",
        display:"inline-block",
        paddingBottom:10,
        paddingTop:10,
        paddingRight:20
    },
    checked:{
        color:"#1565c0"
    },
    deleteIconStyle:{
        color:"red",
        marginLeft:"auto"
    },
    avatarBox:{
        padding:"1rem",
        width:"10%",
        // marginRight:"1%",
        [theme.breakpoints.down('xs')]:{
            width:"19%"
        }
    },
    commentContainer:{
        width:"90%",
        [theme.breakpoints.down('xs')]:{
            width:"75%"
        }
    }
}))

const Comment = (props) => {
    const classes = useStyles();
    const userID = JSON.parse(localStorage.getItem('userID'));

    const [seeMoreStatus, setSeeMoreStatus] = useState(false);
    const [openPopupBox, setOpenPopupBox] = useState(false);
    const [updateReaction, setUpdateReaction] = useState({
        likeState: false,
        dislikeState: false
    });
    const [reactions, setReactions] = useState({})

    const openPopupFunction = (state) => {
        setOpenPopupBox(state);
    }

    const onAddReactionClick=async(value)=>{
        if(value === 'like'){
            if(updateReaction.likeState === false){
                await axios.post(`http://localhost:5000/reaction/addReactionToComment`, {
                    userID: JSON.parse(localStorage.getItem('userID')),
                    commentID: props.id,
                    type: value
                }).then(resp=>{
                    setUpdateReaction({dislikeState:false, likeState:true});
                })
            }else{
                await axios.delete(`http://localhost:5000/reaction/deleteReactionFromComment/${props.id}/${userID}`).then(resp=>{
                    setUpdateReaction({dislikeState:false, likeState:false});
                })
            }
        }else{
            if(updateReaction.dislikeState === false){
                await axios.post(`http://localhost:5000/reaction/addReactionToComment`, {
                    userID: JSON.parse(localStorage.getItem('userID')),
                    commentID: props.id,
                    type: value
                }).then(resp=>{
                    setUpdateReaction({dislikeState:true, likeState:false});
                })
            }else{
                await axios.delete(`http://localhost:5000/reaction/deleteReactionFromComment/${props.id}/${userID}`).then(resp=>{
                    setUpdateReaction({dislikeState:false, likeState:false});
                })
            }
        }
    }

    const getReactionOfUserToComment = async() => {
        await axios.get(`http://localhost:5000/reaction/getReactionOfUserToComment/${JSON.parse(localStorage.getItem('userID'))}/${props.id}`).then(resp=>{
            if(resp.data.type === 'like'){
                setUpdateReaction({likeState: true, dislikeState: false});
            }else if(resp.data.type === 'dislike'){
                setUpdateReaction({likeState: false, dislikeState: true});
            }else{
                setUpdateReaction({likeState: false, dislikeState: false});
            }
        })
    }

    const getNumberOfReactionsOfComment = async() => {
        await axios.get(`http://localhost:5000/reaction/countReactionOfComment/${props.id}`).then(resp=>{
            setReactions(resp.data);
        })
    }

    useEffect(()=>{
        getNumberOfReactionsOfComment();
        getReactionOfUserToComment();
    },[updateReaction.likeState, updateReaction.dislikeState])

    return(
        <Box className={classes.boxContainer}>
            <Box className={classes.avatarBox}>
                <Box style={{width:"100%"}}>
                    <Avatar className={classes.avatarStyle} alt={`${props.name} Image`}  src={`http://localhost:5000/profile/image/${props.profileImage}`} />
                </Box>
            </Box>
            <Box className={classes.commentContainer}>
                <Box style={{width:"100%"}} display="flex">
                    <Box>
                        <Typography variant="subtitle2" style={{color:"#212121"}}> {props.name} {props.surname} </Typography>
                    </Box>
                    { (props.page === "Profile") && (props.navigateUserID === userID ) ?
                        <IconButton onClick={()=>setOpenPopupBox(true)} title="Delete comment" className={classes.deleteIconStyle}>
                            <DeleteForeverIcon style={{fontSize:15}} />
                        </IconButton> : null}
                    { openPopupBox ?
                        <DeletePopupBox   
                            title="comment"
                            id={props.id}
                            openPopup={openPopupBox}
                            openPopupFunction = {(state) => openPopupFunction(state)}
                        /> : null }
                </Box>
                {(props.comment.length > 200) ?
                    (<Box className={classes.contentStyle}>
                        {(seeMoreStatus === false) ?
                            (<Typography variant="subtitle2" style={{wordBreak:"break-word"}}>
                                {props.comment.substring(0,200)}...<Link onClick={()=>setSeeMoreStatus(true)} style={{cursor:'pointer'}}>Read More</Link>
                            </Typography>) :
                            (<Typography variant="subtitle2" style={{wordBreak:"break-word"}}>
                                {props.comment} <Link  style={{cursor:'pointer'}} onClick={()=>setSeeMoreStatus(false)}>Read Less</Link>
                            </Typography>)
                        }
                    </Box>) :
                    (<Box className={classes.contentStyle}>
                        <Typography variant="subtitle2" style={{wordBreak:"break-word"}}>
                            {props.comment}
                        </Typography>
                    </Box>)
                }
                <Typography style={{fontSize:14,color:"#9e9e9e"}}> {props.sendDate.split(' ').slice(0, 5).join(' ')} </Typography>
                <Box display="flex">
                    <Box className={classes.thumbsStyle}>
                        <ThumbUpIcon 
                            onClick={()=>onAddReactionClick('like')} 
                            className={updateReaction.likeState? classes.checked : null} 
                            style={{fontSize:15, padding:3}}/>
                        <Typography>{reactions.countLikes}</Typography>
                    </Box>
                    <Box className={classes.thumbsStyle}>
                        <ThumbDownIcon 
                            onClick={()=>onAddReactionClick('dislike')}
                            className={updateReaction.dislikeState? classes.checked : null}  
                            style={{fontSize:15,padding:3}}/>
                        <Typography>{reactions.countDislikes}</Typography>
                    </Box>    
                </Box>
            </Box>
        </Box>
    )
}   
export default Comment;