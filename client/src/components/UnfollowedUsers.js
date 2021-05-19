import { Avatar, Box, Button, makeStyles, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles({
    userNameTypography:{
        fontSize:15,
        marginLeft:15
    },
    unfollowedUsersBox:{
        '&:hover': {
            backgroundColor:"#f5f5f5",
        },
        paddingLeft:15,
        paddingRight:15,
        display: "flex",
        paddingTop:20,
        paddingBottom:20,
        cursor:'pointer'
    },
    followButton:{
        marginTop:5,
        backgroundColor:"#4db6ac",
        color: "white",
        height:35,
        marginLeft:"auto"
    }
})

const UnfollowedUsers=(props)=>{
    const classes = useStyles();

    const follow = async () =>{
        await axios.post(`http://localhost:5000/follower/follow/`, {
              followingID: JSON.parse(localStorage.getItem('userID')),
              followedID: props.id
          }).then(resp=>{
              if(props.followToggle){
                  props.updateFollowersToggle(false);
              }else{
                  props.updateFollowersToggle(true);
              }
        })
    }
    
    return(
        <Box className={classes.unfollowedUsersBox}>
            <Avatar 
                alt={`${props.name} Image`} 
                // alt="K"
                src={ props.userProfile ? 
                        `http://localhost:5000/profile/image/${props.userProfile.image}` : `http://localhost:5000/profile/image/random`
                }
            />
            <Box>
                <Typography className={classes.userNameTypography}>{props.name}</Typography>
                <Typography className={classes.userNameTypography}>{props.surname}</Typography>
            </Box>
            <Button onClick={follow} className={classes.followButton} variant="contained">Follow</Button>
        </Box>
    )
}
export default UnfollowedUsers;