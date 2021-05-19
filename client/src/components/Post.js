import { Avatar, Badge, Box, Button, Card, CardContent, CardHeader, CardMedia, Collapse, Container, Grid, Icon, IconButton, Link, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import MessageIcon from '@material-ui/icons/Message';
import Comment from './Comment';
import axios from 'axios';
import DeletePopupBox from './DeletePopupBox';
import PublicIcon from '@material-ui/icons/Public';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import { CommentContext } from '../context/CommentsOfPostContext';
import SentTypeList from './SentTypeList';


const useStyles = makeStyles({
    root:{
        marginTop:20,
        
    },
    infoBox:{
        backgroundColor:"#e8eaf6",
        paddingLeft:15,
        paddingRight:15,
        height:60,
        display:"flex",
        alignContent:"center",
        alignItems:"center",
    },
    deleteIconStyle:{
        color:"red",
        marginLeft:"auto"
    },
    contentStyle:{
        paddingLeft:20,
        paddingBottom:10,
        paddingTop:10,
        paddingRight:20
    },
    reactionStyle:{
        marginLeft:15,
        marginRight:15,
        paddingBottom:13,
        paddingTop:18,
    },
    badgeIconStyle:{
        marginLeft:20,
        color:"#616161",
        cursor:"pointer"
    },
    cardMediaImageStyle:{
        border:"1px solid silver",
        width:'100%',
        height:300
    },
    messageTextStyle:{
        backgroundColor:"#e8eaf6",
        borderTop:"1px solid silver",
        borderBottom:"1px solid silver",
        padding:15,
        display:"flex"
    },
    avatarStyle:{
        marginRight:15
    },
    showMoreLessButton:{
        padding:7,
        display:"flex",
        justifyContent:"center",
        alignContent:"center",
        alignItems:"center"
    },
    checked:{
        color:"#1565c0"
    },
    sendTypeButtonStyle:{
        marginTop:-20
    }
})

const Post = (props) => {
    const classes = useStyles();
    const commentsContext = useContext(CommentContext);
    //const userID = JSON.parse(localStorage.getItem('userID'));
    const userID = props.navigateUserID;
    const loggedUserID = JSON.parse(localStorage.getItem('userID'));

    const [extended, setExtended] = useState(false);
    const [seeMoreStatus, setSeeMoreStatus] = useState(false);
    const [commentsArray, setCommentsArray] = useState('');
    const [reactionsAndComments, setReactonsAndComments] = useState({});
    const [openPopupBox, setOpenPopupBox] = useState(false);
    const [loggedUser, setLoggedUser] = useState();
    const [openSendType, setOpenSendType] = useState(null)
    const [sendType, setSendType] = useState(props.postSendType);
    const [updateReaction, setUpdateReaction] = useState({
        likeState:false,
        dislikeState:false
    });
    const [reloadCommentStatus, setReloadCommentStatus] = useState()
    const [userInfo, setUserInfo] = useState({
        user:'',
        userImage: '',
        userComment:'',
    });

    const openPopupFunction = (state) => {
        setOpenPopupBox(state);
    }

    const selectedSendTypeFunction = async(type) => {
        await axios.patch(`http://localhost:5000/post/updatePost`, {id: props.postID, sendType: type})
        props.updatePostFunction()
    }

    const closeSendTypeFunction = () => {
        setOpenSendType(null)
    }

    const onKeyUp=async(e)=>{
        if(e.keyCode === 13){
            await createComment();
            setUserInfo({...userInfo, userComment: ''});
            (reloadCommentStatus) ? setReloadCommentStatus(false) : setReloadCommentStatus(true);
        }
    }

    const onCommentFieldChange=(e)=>{
        setUserInfo({...userInfo, userComment: e.target.value});
    }

    const createComment=async()=>{
        await axios.post(`http://localhost:5000/comment/createComment`, {
            userID: JSON.parse(localStorage.getItem('userID')),
            postID: props.postID,
            comment: userInfo.userComment
        })
    }

    const loadCommentsOfPost=async()=>{
        await axios.get(`http://localhost:5000/comment/getCommentsOfPost/${props.postID}`).then(resp=>{
            setCommentsArray(resp.data);
        })
    }

    const getReactionOfUserToPost = async() => {
        await axios.get(`http://localhost:5000/reaction/getReactionOfUserToPost/${JSON.parse(localStorage.getItem('userID'))}/${props.postID}`).then(resp=>{
            if(resp.data.type === 'like'){
                setUpdateReaction({likeState: true, dislikeState: false});
            }else if(resp.data.type === 'dislike'){
                setUpdateReaction({likeState: false, dislikeState: true});
            }else{
                setUpdateReaction({likeState: false, dislikeState: false});
            }
        })
    }

    const getNumberOfReactionsAndCommentsOfPost = async() => {
        await axios.get(`http://localhost:5000/reaction/countReactionsAndCommentsOfPost/${props.postID}`).then(resp=>{
            setReactonsAndComments(resp.data);
        })
    }

    const loadUser = async() => {
        await axios.get(`http://localhost:5000/user/getUser/${userID}`).then(resp=>{
            setUserInfo({...userInfo, user: resp.data});
        })
    } 

    const getLoggedUser = async() => {
        const loggedUserID = JSON.parse(localStorage.getItem('userID'));
        await axios.get(`http://localhost:5000/user/getUser/${loggedUserID}`).then(resp=>{
            setLoggedUser(resp.data);
        })
    } 

    const onAddReactionClick=async(value)=>{
        if(value === 'like'){
            if(updateReaction.likeState === false){
                await axios.post(`http://localhost:5000/reaction/addReactionToPost`, {
                    userID: JSON.parse(localStorage.getItem('userID')),
                    postID: props.postID,
                    type: value
                }).then(resp=>{
                    setUpdateReaction({dislikeState:false, likeState:true});
                })
            }else{
                await axios.delete(`http://localhost:5000/reaction/deleteReactionFromPost/${props.postID}/${JSON.parse(localStorage.getItem('userID'))}`).then(resp=>{
                    setUpdateReaction({dislikeState:false, likeState:false});
                })
            }
        }else{
            if(updateReaction.dislikeState === false){
                await axios.post(`http://localhost:5000/reaction/addReactionToPost`, {
                    userID: JSON.parse(localStorage.getItem('userID')),
                    postID: props.postID,
                    type: value
                }).then(resp=>{
                    setUpdateReaction({dislikeState:true, likeState:false});
                })
            }else{
                await axios.delete(`http://localhost:5000/reaction/deleteReactionFromPost/${props.postID}/${userID}`).then(resp=>{
                    setUpdateReaction({dislikeState:false, likeState:false});
                })
            }
        }
    }


    useEffect(()=>{
        getLoggedUser();
        loadUser();
    },[]);


    useEffect(()=>{
        getNumberOfReactionsAndCommentsOfPost();
        getReactionOfUserToPost();
        console.log(props.postSendType)
    },[updateReaction.likeState, updateReaction.dislikeState, props.postID])

    useEffect(()=>{
        loadCommentsOfPost();
        getNumberOfReactionsAndCommentsOfPost();
    },[reloadCommentStatus, props.postID, commentsContext.updateCommentsState])


    return(
        <div className={classes.root}>
                <Grid container>
                    <Grid item xs={12}>
                        <Card>
                            <Box className={classes.infoBox}>
                                <Avatar alt={`${props.userName} Image`} style={{height:50,width:50}} src={`http://localhost:5000/profile/image/${props.profileImage}`} />
                                <Box ml={2}>
                                    <Typography style={{fontSize:15}}> {props.userName} {props.userSurname} </Typography>
                                    <Box display="flex">
                                        <Typography style={{fontSize:15,color:"#9e9e9e", marginRight:5}}> {props.postSendDate.split(' ').slice(0, 5).join(' ')} </Typography>
                                        { userID === loggedUserID && props.page === 'Profile' ?
                                            <IconButton className={classes.sendTypeButtonStyle} title={sendType} onClick={ (e) => setOpenSendType(e.currentTarget) }>
                                              {
                                                props.postSendType === 'Public' ? 
                                                    <PublicIcon fontSize="small" /> : 
                                                props.postSendType === 'Friends' ?
                                                    <PeopleIcon fontSize="small"  /> :
                                                    <PersonIcon fontSize="small"  />
                                              }
                                            </IconButton> : 
                                          props.postSendType === 'Public' &&  (props.page === 'Profile' || props.page ==='Home') ?
                                            <Icon component="span" title={props.postSendType}>
                                                <PublicIcon fontSize="small"/>
                                            </Icon> :
                                          props.postSendType === 'Friends' && (props.page === 'Profile' || props.page ==='Home') ?
                                            <Icon component="span" title={props.postSendType}>
                                                <PeopleIcon fontSize="small"/>
                                            </Icon> :
                                          props.postSendType === 'Only me' && (props.page === 'Profile' || props.page ==='Home') ?
                                            <Icon component="span" title={props.postSendType}>
                                                <PersonIcon fontSize="small"/> 
                                            </Icon> : null
                                        }
                                        <SentTypeList 
                                            openSendType={openSendType}
                                            closeSendTypeFunction={closeSendTypeFunction}
                                            selectedSendTypeFunction={(type)=>selectedSendTypeFunction(type)}
                                        />
                                    </Box>
                                </Box>
                                { (props.page === 'Profile') && (props.navigateUserID === loggedUserID ) ?
                                    <IconButton onClick={()=>setOpenPopupBox(true)} title="Delete Post" className={classes.deleteIconStyle}>
                                        <DeleteForeverIcon style={{fontSize:22}} />
                                    </IconButton> : null }
                                { openPopupBox ?
                                    <DeletePopupBox
                                        title="post"
                                        id={props.postID}
                                        openPopup={openPopupBox}
                                        openPopupFunction = {(state) => openPopupFunction(state)}
                                    /> : null }
                            </Box>
                            { props.postContent.length > 300 ?
                                    (<Box className={classes.contentStyle}>
                                       {(seeMoreStatus===false) ? 
                                            (<Typography variant="subtitle2" style={{wordWrap:"break-word"}} paragraph>
                                                {props.postContent.substring(0,300)}...<Link onClick={()=>setSeeMoreStatus(true)} style={{cursor:'pointer'}}>Read More</Link>
                                            </Typography>) :
                                            (<Typography variant="subtitle2" style={{wordWrap:"break-word"}} paragraph>
                                                {props.postContent} <Link  style={{cursor:'pointer'}} onClick={()=>setSeeMoreStatus(false)}>Read Less</Link>
                                            </Typography>) 
                                       }
                                    </Box>) :
                                    (<Box className={classes.contentStyle}>
                                        <Typography variant="subtitle2" style={{wordWrap:"break-word"}} paragraph>
                                            {props.postContent}
                                        </Typography>
                                    </Box>)
                            }
                            {(props.postImage)? (<CardMedia className={classes.cardMediaImageStyle} component="img" src={`http://localhost:5000/post/image/${props.postImage}`} />) : null}
                            <Box className={classes.reactionStyle}>
                                <Badge 
                                    className={classes.badgeIconStyle} 
                                    value="like"
                                    title="Like" 
                                    onClick={()=>onAddReactionClick("like")}
                                    badgeContent={reactionsAndComments.countLikes} 
                                    color="secondary"
                                >
                                    <ThumbUpIcon className={updateReaction.likeState ? classes.checked : null} />
                                </Badge>
                                <Badge 
                                    className={classes.badgeIconStyle} 
                                    value="dislike"
                                    title="Dislike" 
                                    onClick={()=>onAddReactionClick("dislike")}
                                    badgeContent={reactionsAndComments.countDislikes} 
                                    color="secondary"
                                >
                                    <ThumbDownIcon className={updateReaction.dislikeState ? classes.checked : null} />
                                </Badge>
                                <Badge 
                                    className={classes.badgeIconStyle} 
                                    title="Messages" 
                                    badgeContent={reactionsAndComments.countComments} 
                                    color="secondary"
                                >
                                    <MessageIcon />
                                </Badge>
                            </Box>
                            <Box className={classes.messageTextStyle}>
                                { loggedUser ? <Avatar className={classes.avatarStyle} alt={loggedUser.name + "image"} src={`http://localhost:5000/profile/image/${loggedUser.userHasProfile.image}`} /> : null }
                                <TextField value={userInfo.userComment} onKeyUp={onKeyUp} onChange={onCommentFieldChange} style={{width:"100%"}} id="commentField" label="Add comments*" />
                            </Box>
                            {(commentsArray.length > 0) ?
                                <Box style={{backgroundColor:"#e8eaf6"}}>
                                    <Comment 
                                        navigateUserID={props.navigateUserID}
                                        page={props.page}
                                        id={commentsArray[0].id}
                                        profileImage={commentsArray[0].commentOfProfile.image} 
                                        name={commentsArray[0].commentOfUser.name}
                                        surname={commentsArray[0].commentOfUser.surname}
                                        comment={commentsArray[0].comment}
                                        sendDate={commentsArray[0].sendDate}
                                    /> 
                                    <Collapse in={extended} timeout="auto" unmountOnExit>
                                        { commentsArray.slice(1, commentsArray.length).map(com=>{
                                            return(
                                                <Comment
                                                    navigateUserID={props.navigateUserID}
                                                    page={props.page}
                                                    id={com.id}
                                                    profileImage={com.commentOfProfile.image} 
                                                    name={com.commentOfUser.name}
                                                    surname={com.commentOfUser.surname}
                                                    comment={com.comment}
                                                    sendDate={com.sendDate}
                                                />
                                            )
                                        }) }
                                    </Collapse>
                                </Box>:null
                            }
                            { (extended===false && commentsArray.length > 1) ?
                                (<Box fullWidth className={classes.showMoreLessButton}>
                                    <IconButton onClick={()=>setExtended(true)} style={{width:"100%", borderRadius:"10px"}} fullWidth>
                                        <Typography style={{fontSize:20, color:"#1976d2"}}>Show more comments</Typography>
                                    </IconButton>
                                </Box>) : (extended && commentsArray.length >1) ? 
                                (<Box className={classes.showMoreLessButton}>
                                    <IconButton onClick={()=>setExtended(false)} style={{width:"100%", borderRadius:"10px"}} fullWidth>
                                        <Typography style={{fontSize:20, color:"#1976d2"}}>Show less comments</Typography>
                                    </IconButton>
                                </Box>):
                                null}
                        </Card>
                    </Grid>
                </Grid>
        </div>
        // </CommentsOfPostContext>
    )
}
export default Post;