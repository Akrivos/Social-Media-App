import { Box, Button, Card, CardActions, CardContent, CardMedia, Container, FormControl, Grid, IconButton, InputAdornment, InputLabel, makeStyles, OutlinedInput, Typography } from '@material-ui/core';
import React, { useContext } from 'react';
import EmailIcon from '@material-ui/icons/Email';
import Alert from '@material-ui/lab/Alert';
import { Lock, Visibility, VisibilityOff } from '@material-ui/icons';
import { useState } from 'react';
import LockIcon from '@material-ui/icons/Lock';
import { AuthContext } from '../context/GlobalContext';
import { Link } from 'react-router-dom';
import { NavBarContext } from '../context/NavBarContext';

const useStyles = makeStyles({
    root:{
        backgroundColor:"#e0f2f1",
        width:"100%",
        height:"100vh"
    },
    signInTypography:{
        paddingBottom:10,
        borderBottom:"1px solid silver"
    },
    emailIconStyle:{
        marginTop:15,
        marginRight:10,

    },
    signInButton:{
        // backgroundColor:"#4caf50",
        // color:"white",
        marginTop:20,
    }
})

const SignIn=(props)=>{
    const classes = useStyles();
    const auth = useContext(AuthContext);
    const navBarContext = useContext(NavBarContext)

    const [showPassword,setShowPassword]=useState(false);
    const [signInData, setSignInData] = useState({
        email:'',
        password:'',
        status:false
    })

    const handleClickShowPassword=()=>{
        (showPassword)? setShowPassword(false) : setShowPassword(true);
    }

    const onEmailChange=(e)=>{
        setSignInData({...signInData, email:e.target.value})
    }

    const onPasswordChange=(e)=>{
        setSignInData({...signInData, password: e.target.value});
    }


    const onSignInButton=()=>{
        auth.isLoggedIn( signInData.email, signInData.password, (res)=>{
            if(res === true){
                props.history.push(`/home/${JSON.parse(localStorage.getItem("userID"))}`);
                navBarContext.selectMenuFunction('Home')
            }else{
                setSignInData({...signInData, status: true})
            }
        })

    }

    return(
        <div className={classes.root}>
            <Container>
                <Grid container>
                    <Grid item md={4} sm={2}/>
                    <Grid item md={4} sm={8}>
                        <Card style={{marginTop:50}}>
                            <CardContent>
                                <Typography className={classes.signInTypography} variant="h4">Sign in</Typography>
                                { (signInData.status) ? <Alert style={{marginTop:10}} severity="error">{auth.message}</Alert> : null}
                                <form>
                                <Box display="flex" mt={2}>
                                    <EmailIcon className={classes.emailIconStyle} />
                                    <FormControl onChange={(e)=>onEmailChange(e)} fullWidth variant="outlined">
                                        <InputLabel htmlFor="email">Email address</InputLabel>
                                        <OutlinedInput 
                                            type="text" 
                                            id="email" 
                                            label="Email address" 
                                        />
                                    </FormControl>   
                                </Box>
                                <Box mt={2} display="flex">
                                    <LockIcon style={{marginTop:15, marginRight:10}} />
                                    <FormControl onChange={(e)=>onPasswordChange(e)} fullWidth variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            type={showPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={()=>handleClickShowPassword()}
                                                        edge="end"
                                                    >
                                                        { showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            labelWidth={70}
                                        />
                                    </FormControl>
                                </Box>
                                </form>
                                <CardActions style={{display:"flex", justifyContent:"center"}}>
                                    <Button fullWidth onClick={()=>onSignInButton()} color="primary" variant="contained" className={classes.signInButton}>Sign in</Button>
                                </CardActions>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={4} sm={2}/>
                </Grid>
            </Container>
        </div>
    )
}
export default SignIn;