import { Avatar, Box, Button, Card, CardActions, CardContent, CardMedia, Container, Grid, IconButton, makeStyles, TextField, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../context/GlobalContext';
import Post from './Post';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import axios from 'axios';
import UnfollowedUsers from './UnfollowedUsers';
import PublicIcon from '@material-ui/icons/Public';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import SentTypeList from './SentTypeList';

const useStyles = makeStyles((theme) => ({
    root:{
        backgroundColor:"#e0f2f1",
        width:"100%",
        minHeight:"100vh",
        paddingBottom:50,
    },
    cardStyle:{
        marginTop:20,
        marginBottom:10
    },
    mainInfoBox:{
        backgroundColor:"#4db6ac",
        height:70,
        display:"flex",
        alignContent:"center",
        alignItems:"center",
    },
    cardMediaStyle:{
        height:50,
        width:50,
        borderRadius:"50%",
    },
    userNameTypography:{
        fontSize:15,
        marginLeft:15
    },
    photoIconBoxStyle:{
        marginTop:5,
        marginBottom:5
    },
    postButtonBox:{
        backgroundColor:"#4db6ac",
        height:60,
        display:"flex",
        alignContent:"center",
        alignItems:"center",
    },
    // gridContainer:{
    //     height:"100%"
    // },
    postButtonStyle:{
        marginLeft:"auto",
        marginRight:20,
        color:"#00796b",
    },
    rightSideCardStyle:{
        borderLeft:"1px solid silver",
        // minHeight:"100vh",
        height:"100vh",
        overflow:"auto"
    },
    peopleMayKnowBox:{
        padding:10,
        textAlign:'center',
        borderBottom:"1px solid silver"

    },
    profileImageStyle:{
        height:50,
        width:50,
        marginLeft:15
    },
    grid_posts:{
        width:"100%",
        height:"100%",
        minHeight:"100%"
    },
    grid_peopleMayKnow:{
        [theme.breakpoints.down('sm')]:{
            display:'none'
        }
    }
}))


const Home = (prosp) =>{
    const classes = useStyles();
    const auth = useContext(AuthContext);
    const fileInput = useRef('');

    const [user, setUser] = useState('');
    const [postsInfo, setPostsInfo] = useState();
    const [updateToggle, setUpdateToggle] = useState(false);
    const [sendType, setSendType] = useState('Public');
    const [openSendType, setOpenSendType] = useState(null)
    const [unfollowedUsersInfo, setUnfollowedUsersInfo] = useState({
        unfollowedUsers:'',
        followToggle: false
    });
    const [createPost, setCreatePost] = useState({
        content:'',
        selectedImage:''
    });
    
    const onPostImageSelectChange=(e)=>{
        setCreatePost({...createPost, selectedImage: e.target.files[0]});
    }

    const onContentFieldChange=(e)=>{
        setCreatePost({...createPost, content: e.target.value});
    }

    const selectedSendTypeFunction = (type) => {
        setSendType(type)
    }

    const closeSendTypeFunction = () => {
        setOpenSendType(null)
    }

    const onPostButton=async()=>{
        const formData = new FormData();
        formData.append('photo', createPost.selectedImage);

        console.log('SELECTED IMAGE NAME --->>' + createPost.selectedImage.name)
        //await axios.post('http://localhost:5000/profile/image', formData)
        if(createPost.selectedImage.name){
            await axios.post('http://localhost:5000/post/uploadImage', formData)

            await axios.post(`http://localhost:5000/post/createPost/${user.id}`, {
                content: createPost.content,
                sendType: sendType,
                image: createPost.selectedImage.name,
            }).then(resp=>{
                setCreatePost({selectedImage:'', content:''});
                (updateToggle) ? setUpdateToggle(false) : setUpdateToggle(true);
            })
        }else{
            await axios.post(`http://localhost:5000/post/createPost/${user.id}`, {
                content: createPost.content,
                sendType: sendType
            }).then(resp=>{
                setCreatePost({selectedImage:'', content:''});
                (updateToggle) ? setUpdateToggle(false) : setUpdateToggle(true);
            })
        }
    }

    const updateFollowersToggle=(state)=>{
        setUnfollowedUsersInfo({...unfollowedUsersInfo, followToggle: state})
    }

    const loadUser = async() => {
        const userID = JSON.parse(localStorage.getItem('userID'));
        await axios.get(`http://localhost:5000/user/getUser/${userID}`).then(resp=>{
            setUser(resp.data);
        })
    }


    const loadUnfollowedUsers = async() => {
        const userID = JSON.parse(localStorage.getItem('userID'));
        await axios.get(`http://localhost:5000/follower/findUnfollowedUsers/${userID}`).then(resp=>{
            setUnfollowedUsersInfo({...unfollowedUsersInfo, unfollowedUsers: resp.data});
        })
    }

    const loadPostsAndProfilesOfFollowers = async() => {
        const userID = JSON.parse(localStorage.getItem('userID'));
        await axios.get(`http://localhost:5000/follower/getAllFriendsPostsAndProfilesOfUserID/${userID}`).then(resp=>{
            setPostsInfo(resp.data);
        })
    }  

    useEffect(()=>{
        loadUser();
    },[])


    useEffect(()=>{
        loadPostsAndProfilesOfFollowers();
        loadUnfollowedUsers();
    },[updateToggle,unfollowedUsersInfo.followToggle]);

    return(
        <div className={classes.root}>
                <Grid className={classes.gridContainer} container>
                    <Grid item md={2} sm={0}/>
                    <Grid item md={5} sm={12} className={classes.grid_posts}>
                       <Card className={classes.cardStyle}>
                            <Box className={classes.mainInfoBox} >
                                <Avatar 
                                    className={classes.profileImageStyle} 
                                    alt={`${user.name} Image`} 
                                    src={ user.userHasProfile ?
                                        `http://localhost:5000/profile/image/${user.userHasProfile.image}` :
                                        `http://localhost:5000/profile/image/random`
                                    } 
                                /> 
                                <Typography className={classes.userNameTypography}>{user.name} {user.surname}</Typography> 
                            </Box>
                            <CardContent>
                                <TextField
                                    value={createPost.content}
                                    fullWidth
                                    onChange={onContentFieldChange}
                                    id="content"
                                    label="Add a status"
                                    variant="outlined"
                                    placeholder={`Whats on your mind, ${user.name}?`}
                                />
                                <Box display="flex">
                                    <Box className={classes.photoIconBoxStyle}>
                                        <input ref={fileInput} type="file" style={{display:"none"}} onChange={onPostImageSelectChange}/>
                                        <IconButton style={{color:"red"}} onClick={()=>fileInput.current.click()}>
                                            <AddAPhotoIcon/>
                                        </IconButton>
                                    </Box>
                                    <Box style={{marginLeft:"auto",marginTop:5}}>
                                        <IconButton title={sendType} onClick={ (e) => setOpenSendType(e.currentTarget) }>
                                            {
                                                sendType === 'Public' ? 
                                                    <PublicIcon  fontSize="small" /> : 
                                                sendType === 'Friends' ?
                                                    <PeopleIcon fontSize="small" /> :
                                                    <PersonIcon fontSize="small" />
                                            }
                                        </IconButton>
                                        <SentTypeList 
                                            openSendType={openSendType}
                                            closeSendTypeFunction={closeSendTypeFunction}
                                            selectedSendTypeFunction={(type)=>selectedSendTypeFunction(type)}
                                        />
                                    </Box>
                                </Box>
                            </CardContent>
                            <Box className={classes.postButtonBox}>
                                <Button onClick={onPostButton} className={classes.postButtonStyle} variant="contained">Post</Button>
                            </Box>
                       </Card>
                       <Box>
                            {postsInfo? postsInfo.map(post=>{
                                return(
                                <Post
                                    postID={post.id}
                                    userName={post.postFromUser.name}
                                    userSurname={post.postFromUser.surname}
                                    profileImage={post.postFromProfile.image}
                                    postImage={post.image}
                                    postSendDate={post.sendDate}
                                    postContent={post.content}
                                    postSendType={post.sendType}
                                    updatePostFunction={null}
                                    page="Home"
                                />
                            )}) : null}
                       </Box>
                    </Grid>
                    <Grid item md={2} sm={0}/>
                    <Grid item md={3} sm={0} className={classes.grid_peopleMayKnow}>
                        <Card className={classes.rightSideCardStyle}>
                            <Box className={classes.peopleMayKnowBox}>
                                <Typography  variant="h6">People you may know</Typography>
                            </Box>
                            { (unfollowedUsersInfo.unfollowedUsers) ? 
                                    unfollowedUsersInfo.unfollowedUsers.map(user=>{
                                        return(
                                            <UnfollowedUsers
                                                id = {user.id}
                                                name = {user.name}
                                                surname = {user.surname}
                                                userProfile = {user.userHasProfile}
                                                updateFollowersToggle={(status)=>updateFollowersToggle(status)}
                                                followToggle = {unfollowedUsersInfo.followToggle}
                                            />
                                        )
                                }) : null
                            }
                        </Card>
                    </Grid>
                </Grid>
        </div>
    )
}
export default Home;