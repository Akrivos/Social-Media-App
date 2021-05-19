import { Avatar, Box, Button, Card, CardContent, Grid, IconButton,Link, makeStyles, Menu, MenuItem, Paper, Typography } from '@material-ui/core';
import react, { useContext, useEffect, useState } from 'react';
//import {Link, Router} from "react-router-dom";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import axios from 'axios';
import { NavBarContext } from '../context/NavBarContext';


const options = [
    'Unfollow'
]

const useStyles = makeStyles({
    avatarStyle:{
        height:50,
        width:50,
        marginLeft:20,
        marginRight:5
    }
})


const FollowersBox=(props)=>{
    const classes = useStyles();
    const navBarContext = useContext(NavBarContext);
    const loggedUserID = JSON.parse(localStorage.getItem('userID'));

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl)


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event) => {
        setAnchorEl(null)
    }

    const unfollow = async () => {
        const userID = JSON.parse(localStorage.getItem('userID'));
        await axios.delete(`http://localhost:5000/follower/unfollow/${userID}/${props.id}`).then(resp => {
            if(props.unfollowToggle === true){
                props.unfollowToggleFunction(false)
            }else{
                props.unfollowToggleFunction(true);
            }
        })
    }

    const unselectMenuFunction = () => {
        navBarContext.unselectMenuFunction()
    }

    return(
            <Grid item xs={6}>
                <Card>
                    <CardContent>
                        <Box display="flex">
                            <Avatar 
                                alt={props.firstName + 'Image'} 
                                src={ props.userHasProfile ?
                                    `http://localhost:5000/profile/image/${props.userHasProfile.image}` :
                                    `http://localhost:5000/profile/image/random`
                                } 
                                className={classes.avatarStyle}
                            />
                            <Box ml={1}>
                                <Link 
                                    href={`/profile/${props.id}`} 
                                    style={{color:"black", cursor:"pointer"}}
                                    onClick={unselectMenuFunction}
                                >
                                    <Typography>{props.firstName}</Typography>
                                    <Typography>{props.lastName}</Typography>
                                </Link>
                            </Box>
                            { props.navigateUserID === loggedUserID ?
                                <IconButton
                                    style={{marginLeft: "auto"}}
                                    aria-label="more"
                                    aria-controls="long-menu"
                                    aria-haspopup="true"
                                    onClick={handleClick}
                                >
                                    <MoreVertIcon />
                                </IconButton> : null}
                            <Menu
                                id="long-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={open}
                                onClose={handleClose}
                            >
                                {options.map((option) => (
                                    <MenuItem key={option} onClick={unfollow}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
    )
}

export default FollowersBox;