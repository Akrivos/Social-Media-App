import { Divider,Drawer,List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import {Link, Router} from "react-router-dom";
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { AuthContext } from '../context/GlobalContext';
import { NavBarContext } from '../context/NavBarContext';

const useStyles = makeStyles((theme) => ({
    list:{
        width:150,
        //backgroundColor:"rgb(70, 68, 68)"
        //color:'white'
    },
    iconStyle:{
        paddingTop:3,
        paddingRight:5
    },
    drawer:{
        [theme.breakpoints.up('md')]:{
            display:'none'
        }
    }
}))

const DrawerMenu = (props) => {
    const classes = useStyles();
    const auth = useContext(AuthContext);
    const navBarContext = useContext(NavBarContext);
    const loggedUserID = JSON.parse(localStorage.getItem('userID'));

    const [openDrawer, setOpenDrawer] = useState(true);

    const onSignOutButton=()=>{
        auth.isLoggedOut();
    }

    const selectMenuFunction = (value) => {
        navBarContext.selectMenuFunction(value)
    }

    const onDrawerClose = () => {
        props.openDrawerFunction();
    }

    return(
        <Drawer
            classes={{paper: classes.drawer}}
            className={classes.drawer}
            anchor="left"
            open={props.openDrawer}
            onClose={onDrawerClose}
        >
            {auth.status ?
                (<List className={classes.list}>
                    <ListItem 
                        component={Link} 
                        onClick={()=>selectMenuFunction('Home')}
                        to={`/home/${loggedUserID}`}
                        divider 
                        button
                    >
                        <ListItemIcon>
                            <HomeIcon className={classes.iconStyle}/>
                            <ListItemText primary="Home"/>
                        </ListItemIcon>
                    </ListItem>
                    <ListItem 
                        component={Link} 
                        onClick={()=>selectMenuFunction('Profile')}
                        to={`/profile/${loggedUserID}`}
                        divider 
                        button
                    >
                        <ListItemIcon>
                            <PersonIcon className={classes.iconStyle}/>
                            <ListItemText primary="Profile"/>
                        </ListItemIcon>
                    </ListItem>
                    <ListItem 
                        component={Link}
                        to={'/'}
                        onClick={onSignOutButton} 
                        divider 
                        button
                    >
                        <ListItemIcon>
                            <ExitToAppIcon className={classes.iconStyle}/>
                            <ListItemText primary="Sign out"/>
                        </ListItemIcon>
                    </ListItem> 
                </List> ) : 
                <List className={classes.list}>
                    <ListItem 
                        component={Link} 
                        to={`/`}
                        //onClick={()=>setOpenDrawer(false)}
                        divider 
                        button
                    >
                        <ListItemIcon>
                            {/* <HomeIcon className={classes.iconStyle}/> */}
                            <ListItemText primary="Sign in"/>
                        </ListItemIcon>
                    </ListItem>
                    <ListItem 
                        component={Link} 
                        to={`/signup`}
                        //onClick={()=>setOpenDrawer(false)}
                        divider 
                        button
                    >
                        <ListItemIcon>
                            {/* <HomeIcon className={classes.iconStyle}/> */}
                            <ListItemText primary="Sign up"/>
                        </ListItemIcon>
                    </ListItem>
                </List>
            }
        </Drawer>
    )
}

export default DrawerMenu;