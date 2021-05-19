import { Avatar, Box, Card, CardContent,Link, Grid, makeStyles, Typography } from '@material-ui/core';
import React, { useContext } from 'react';
import {Router} from "react-router-dom";
import { NavBarContext } from '../context/NavBarContext';

const useStyles = makeStyles({
    avatarStyle:{
        height:50,
        width:50,
        marginLeft:20,
        marginRight:5
    }
})

const FollowersBox = (props) => {
    const classes = useStyles();
    const navBarContext = useContext(NavBarContext);

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
                </Box>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default FollowersBox;