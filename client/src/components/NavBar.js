import React, { useContext, useEffect, useState } from 'react';
import { AppBar, BottomNavigation, BottomNavigationAction, Box, Button, Grid, IconButton, makeStyles, Toolbar, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';
import {Link, Router} from "react-router-dom";
import { AuthContext } from '../context/GlobalContext';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { NavBarContext } from '../context/NavBarContext';
import SocialMedia from './images/social-media.png'
import DrawerMenu from './DrawerMenu';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme)=>({
    root:{
        flexGrow:1,
        position:"sticky",
        zIndex:100,
        top:0
    },
    appBar:{
        height:65,
        backgroundColor:"#26a69a",
    },
    linkStyle:{
        marginTop:8,
        textDecoration: "none",
        display:"block",
        color:"white"
    },
    bottomNavigationStyle:{
        backgroundColor:"#26a69a",
    },
    signOutBottomStyle:{
        marginTop:10
    },
    bottomNavigationActionStyle:{
        "&$selected":{
            color:"blue",
            
        }
    },
    selected:{},

    bottomNavigationBox:{
        [theme.breakpoints.down('sm')]:{
            display:'none'
        }
    },
    signIn_signOut_box:{
        [theme.breakpoints.down('sm')]:{
            display:'none'
        }
    }
    
}));

const NavBar=(props)=>{
    const classes = useStyles();
    const auth = useContext(AuthContext);
    const navBarContext = useContext(NavBarContext);
    const selectedMenu = JSON.parse(localStorage.getItem('selectedMenu'))
    const theme = useTheme();
    const matchesOnSM = useMediaQuery(theme.breakpoints.down('sm'));

    const [value,setValue] = useState(selectedMenu)
    const [openDrawer, setOpenDrawer] = useState(false)

    const selectMenuFunction = (value) => {
        navBarContext.selectMenuFunction(value)
    }
    
    const onSignOutButton=()=>{
        auth.isLoggedOut();
    }

    const openDrawerFunction = () => {
        setOpenDrawer(false);
    }

    useEffect(()=>{
        setValue(selectedMenu)
    },[selectedMenu])

    return(
      <div className={classes.root} style={{width:"100%"}}>
        <AppBar className={classes.appBar} position="static">
            <Toolbar>
                <Box display="flex" alignItems="center" m={1} p={1}>
                    {/* <ShareIcon/> */}
                    <img style={{width:40, height:40}} src={SocialMedia} alt="Social Media Img"/>
                    <Typography variant="h6" style={{marginLeft:10, }}>Social Media App</Typography>
                </Box>
                <Box style={{marginLeft:"auto"}}>
                    {auth.status===false ?  
                        (<Box className={classes.signIn_signOut_box}>
                            <Link to="/" title="SIGN IN" style={{textDecoration:"none"}}>
                                <Button variant="outlined">Sign In</Button>
                            </Link>
                            <Link  to="/signup" title="SIGN UP" style={{textDecoration:"none"}}>
                                <Button variant="outlined" style={{marginLeft:10}}>Sign Up</Button>
                            </Link>    
                        </Box>) :
                        (<Box display="flex" className={classes.bottomNavigationBox}>
                            <BottomNavigation value={value} className={classes.bottomNavigationStyle} onChange={(e, newValue)=>{ setValue(newValue)}}>
                                <BottomNavigationAction
                                    classes={{
                                        bottomNavigationStyle: classes.bottomNavigationActionStyle,
                                        selected: classes.selected
                                    }}
                                    onClick={()=>selectMenuFunction('Home')}
                                    component={Link}
                                    to={`/home/${JSON.parse(localStorage.getItem('userID'))}`}  
                                    title="Home"
                                    label="Home" 
                                    value="Home"
                                    icon={<HomeIcon/>} 
                                />

                                <BottomNavigationAction
                                    classes={{
                                        bottomNavigationStyle: classes.bottomNavigationActionStyle,
                                        selected: classes.selected
                                    }}
                                    onClick={()=>selectMenuFunction('Profile')}
                                    component={Link}
                                    to={`/profile/${JSON.parse(localStorage.getItem('userID'))}`}  
                                    title="Profile"
                                    label="Profile" 
                                    value="Profile"
                                    icon={<PersonIcon/>}
                                />                                
                            </BottomNavigation>
                            <Link to="/" title="SIGN OUT" className={classes.signOutBottomStyle} style={{textDecoration:'none'}}>
                                <Button variant="outlined" style={{marginLeft:10}} onClick={()=>onSignOutButton()}>Sign Out</Button>
                            </Link>
                        </Box>)
                    }
                    {matchesOnSM ? 
                        (<IconButton onClick={()=>setOpenDrawer(true)} aria-label="menu">
                            <MenuIcon/>
                        </IconButton>) :
                        null 
                    }
                    <DrawerMenu 
                        openDrawer={openDrawer}
                        openDrawerFunction={openDrawerFunction}
                    />
                </Box>
            </Toolbar>
        </AppBar>
    </div>
  )
}

export default NavBar;
