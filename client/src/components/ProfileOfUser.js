import React, { useContext, useEffect, useState } from 'react';
import { AppBar, Avatar, Box, Card, CardContent, CardMedia, Container, Grid, IconButton, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { TabContext, TabPanel } from '@material-ui/lab';
import Post from './Post';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import FollowingsBox from './FollowingsBox';
import EmailIcon from '@material-ui/icons/Email';
import WorkIcon from '@material-ui/icons/Work';
import FollowersBox from './FollowersBox';
import { PostContext } from '../context/PostsOfProfileContext';
import CommentsOfPostContext from '../context/CommentsOfPostContext';
import { AlternateEmail } from '@material-ui/icons';

const useStyles = makeStyles(theme=>({
    root:{
        backgroundColor:"#e0f2f1",
        width:"100%",
        minHeight:"100vh",
    },
    cardMediaStyle:{
        height:50,
        width:50,
        borderRadius:"50%",
    },
    editDeleteButtonsPosition:{
        display:"flex",
        flexDirection:"column",
        marginLeft:"auto",
        marginTop:-30
    },
    mainInfoBox:{
        display:"flex",
        marginTop:32,
        paddingBottom:10,
        borderBottom:"1px solid silver"
    },
    joinedStyle:{
        fontSize:15, 
        color:"#9e9e9e",
        marginLeft:20,
        marginTop:10
    },
    acountCircleIconStyle:{
        fontSize:50,
        color:'#0d47a1'
    },
    avatarStyle:{
        height:60,
        width:60,
        marginLeft:20,
        marginRight:5
    }
}))


const ProfileOfUser=(props)=>{
    const postsContext = useContext(PostContext);
    const {navigateUserID} = useParams();
    const userID = JSON.parse(navigateUserID);
    const loggedUserID = JSON.parse(localStorage.getItem('userID'));

    const classes = useStyles();
    const [user,setUser]=useState('');
    const [posts, setPosts] = useState();
    const [publicAndFriendsPosts, setPublicAndFriendsPosts] = useState();
    const [publicPosts, setPublicPosts] = useState()
    const [tabValue, setTabValue] = useState("Posts");
    const [followings, setFollowings] = useState();
    const [followingStatus, setFollowingStatus] = useState(false);
    const [unfollowToggle, setUnfollowToggle] = useState(false);
    const [followers, setFollowers] = useState();
    const [checkIfIsFriend, setCheckIfIsFriend] = useState(false);
    const [updatePost, setUpdatePost] = useState(false);

    const handleChangeTabs = (event,value) =>{
        setTabValue(value);
    }

    const unfollowToggleFunction = (state) => {
        console.log("UNFOLLOW STATE:"+ state)
        setUnfollowToggle(state);
    }

    const updatePostFunction=()=>{
        updatePost ? setUpdatePost(false) : setUpdatePost(true)
    }


    const loadUser = async() => {
        //const userID = JSON.parse(localStorage.getItem('userID'));
        await axios.get(`http://localhost:5000/user/getUser/${userID}`).then(resp=>{
            setUser(resp.data);
        })
    }   

    const loadPublicAndFriendsPostsOfUser = async() => {
        await axios.get(`http://localhost:5000/post/getPublicAndFriendsPostsOfUser/${userID}`).then(resp=>{
            setPublicAndFriendsPosts(resp.data);
        })
    }

    const loadPublicPostsOfUser = async() => {
        await axios.get(`http://localhost:5000/post/getPublicPostsOfUser/${userID}`).then(resp=>{
            setPublicPosts(resp.data);
        })
    }


    const findFollowingsOfUser = async() => {
        //const userID = JSON.parse(localStorage.getItem('userID'));
        await axios.get(`http://localhost:5000/follower/findFollowingsOfUserID/${userID}`).then(resp => {
            setFollowings(resp.data);
        })
    }

    const loadFollowers = async() => {
        //const userID = JSON.parse(localStorage.getItem('userID'));
        await axios.get(`http://localhost:5000/follower/followersOfUserID/${userID}`).then(resp => {
            setFollowers(resp.data);
        })
    }

    const loadPosts = async() => {
        await axios.get(`http://localhost:5000/post/getPostsOfUser/${userID}`).then(resp => {
            setPosts(resp.data)
        })  
    }

    const checkIfIsInFriendList = async() => {
        await axios.get(`http://localhost:5000/follower/checkIfIsInFriendList/${loggedUserID}/${userID}`).then(resp => {
            setCheckIfIsFriend(resp.data)
        })
    }

    useEffect(()=>{
        loadFollowers();
        loadUser();
        loadPublicAndFriendsPostsOfUser();
        loadPublicPostsOfUser();
        checkIfIsInFriendList();
    },[navigateUserID]);

    useEffect(()=>{
        loadPosts()
    },[postsContext.updatePostsState, navigateUserID, updatePost])


    useEffect(()=>{
        findFollowingsOfUser();
    },[followingStatus, unfollowToggle, navigateUserID]);


    return(
        <div className={classes.root}>
            <Container style={{padding:0}}>
                <Grid container style={{paddingTop:50}}>
                    <Grid item md={2} sm={0}/>
                    <Grid item md={8} sm={12} style={{width:"100%"}}>
                        <Card style={{backgroundColor:"#fafafa",marginBottom:30}}>
                            <CardContent>
                                <Typography variant="h4" style={{color:"#26a69a",textAlign:"center"}}>Profile</Typography>
                                <Box className={classes.mainInfoBox}>
                                    {(user.userHasProfile) ? <Avatar alt={user.name + "image"} src={`http://localhost:5000/profile/image/${user.userHasProfile.image}`} className={classes.avatarStyle}/> : null}
                                    <Box ml={2}>
                                        <Typography style={{fontSize:20}} >{user.name} {user.surname}</Typography>
                                        <Box display="flex">
                                            <EmailIcon/>
                                            <Typography style={{fontSize:15,color:"#9e9e9e", marginLeft:5}}>{user.email}</Typography>
                                        </Box>
                                        { user.userHasProfile ?
                                            <Box display="flex">
                                                <WorkIcon/>
                                                <Typography style={{fontSize:15,color:"#9e9e9e",marginLeft:5}}>{user.userHasProfile.about}</Typography>
                                            </Box> : null}
                                        
                                    </Box>
                                    { loggedUserID === userID ?
                                    <Box className={classes.editDeleteButtonsPosition}>
                                        <Link to={`/edit-profile/${JSON.parse(localStorage.getItem('userID'))}`}>
                                            <IconButton title="Edit Profile">
                                                <EditIcon style={{color:"#26a69a", fontSize:20}} />
                                            </IconButton>
                                        </Link>
                                        <IconButton title="Delete Profile">
                                            <DeleteForeverIcon style={{color:"red", fontSize:20}} />
                                        </IconButton>
                                    </Box> : null }
                                </Box>
                                <Box>
                                    <Typography className={classes.joinedStyle}>Joined: {user.joinedDate}</Typography>
                                </Box>
                                <Box mt={2}>
                                    <TabContext value={tabValue}>
                                        <AppBar position="static" color="default">
                                            <Tabs
                                                style={{backgroundColor:"#efebe9"}}
                                                value={tabValue}
                                                onChange={(event,value)=>handleChangeTabs(event,value)}
                                                indicatorColor="primary"
                                                textColor="primary"
                                                variant="fullWidth"
                                                aria-label="full width tabs example"
                                            >
                                                <Tab value="Posts" label="POSTS"  />
                                                <Tab value="Following" label="FOLLOWING"  />
                                                <Tab value="Followers" label="FOLLOWERS" />
                                            </Tabs>
                                        </AppBar>
                                        <TabPanel style={{padding:0}} value="Posts">
                                            {(posts &&  (userID === loggedUserID)) ?
                                                (posts.map(post => {
                                                    return(
                                                        <Post 
                                                            navigateUserID={userID}
                                                            postID={post.id}
                                                            userName={post.postFromUser.name}
                                                            userSurname={post.postFromUser.surname}
                                                            profileImage={post.postFromProfile.image}
                                                            postImage={post.image}
                                                            postSendDate={post.sendDate}
                                                            postContent={post.content}
                                                            postSendType={post.sendType}
                                                            updatePostFunction={updatePostFunction}
                                                            page="Profile"
                                                    />)})) : 
                                                (publicAndFriendsPosts && (userID !== loggedUserID) && checkIfIsFriend) ? 
                                                    (publicAndFriendsPosts.map(post => {
                                                        return(
                                                            <Post 
                                                                navigateUserID={userID}
                                                                postID={post.id}
                                                                userName={post.postFromUser.name}
                                                                userSurname={post.postFromUser.surname}
                                                                profileImage={post.postFromProfile.image}
                                                                postImage={post.image}
                                                                postSendDate={post.sendDate}
                                                                postContent={post.content}
                                                                postSendType={post.sendType}
                                                                updatePostFunction={updatePostFunction}
                                                                page="Profile"
                                                        />)})) : 
                                                (publicPosts) ?
                                                    (publicPosts.map(post => {
                                                        return(
                                                            <Post 
                                                                navigateUserID={userID}
                                                                postID={post.id}
                                                                userName={post.postFromUser.name}
                                                                userSurname={post.postFromUser.surname}
                                                                profileImage={post.postFromProfile.image}
                                                                postImage={post.image}
                                                                postSendDate={post.sendDate}
                                                                postContent={post.content}
                                                                postSendType={post.sendType}
                                                                updatePostFunction={updatePostFunction}
                                                                page="Profile"
                                                        />)})) : null
                                            }
                                        </TabPanel>
                                        <TabPanel value="Following">
                                            <Grid>
                                                <Grid container spacing={1}>
                                                    { followings ?
                                                        (followings.map( following => {
                                                            return(
                                                                <FollowingsBox 
                                                                    navigateUserID={userID}
                                                                    id = {following.id}
                                                                    firstName = {following.name}
                                                                    lastName = {following.surname}
                                                                    userHasProfile = {following.userHasProfile}
                                                                    unfollowToggleFunction = {(state) => unfollowToggleFunction(state)}
                                                                    unfollowToggle = {unfollowToggle}
                                                                />
                                                            )
                                                        })) : null }
                                                </Grid>
                                            </Grid>
                                        </TabPanel>
                                        <TabPanel value="Followers">
                                            <Grid>
                                                <Grid container spacing={1}>
                                                    { followers ?
                                                        (followers.map( follower => {
                                                            return(
                                                                <FollowersBox
                                                                    id = {follower.id}
                                                                    firstName = {follower.name}
                                                                    lastName = {follower.surname}
                                                                    userHasProfile = {follower.userHasProfile}
                                                                />
                                                            )
                                                        })) : null }
                                                </Grid>
                                            </Grid>
                                        </TabPanel>
                                    </TabContext>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={2} sm={0}/>
                </Grid>
            </Container>
        </div>
    )
}
export default ProfileOfUser;
