import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Container, FormControl, FormHelperText, Grid, IconButton, Input, InputAdornment, InputLabel, makeStyles, NativeSelect, OutlinedInput, Snackbar, TextField, Typography } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import ErrorIcon from '@material-ui/icons/Error';
import { MuiPickersUtilsProvider,KeyboardDatePicker,} from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import axios from 'axios';
import { Alert } from '@material-ui/lab';
import { useSnackbar } from 'notistack';


const useStyles = makeStyles((theme) => ({
    root:{
        backgroundColor:"#e0f2f1",
        width:"100%",
        minHeight:"100vh"
    },
    cardStyle:{
        marginTop:50
    },
    boxSignUp:{
        paddingBottom:10,
        borderBottom:"1px solid silver"
    },
    nameInput:{
        width:270,
        [theme.breakpoints.down('sm')]:{
            width:"100%"
        }
    },
    lastNameInput:{
        width:270,
        marginLeft:"auto",
        [theme.breakpoints.down('sm')]:{
            width:"100%"
        }
    }
}))


const SignUp=(props)=>{
    const classes=useStyles();
    const { enqueueSnackbar } = useSnackbar();

    const [formInfo, setFormInfo]= useState({
        firstnameInfo:{ firstname:'', firstnameError:false, firstnameMessage:''},
        lastNameInfo:{ lastname:'', lastnameError:false, lastnameMessage:'' },
        passwordInfo:{ password:'', passwordError:false, passwordMessage:'' , showPassword:false},
        emailInfo:{ email:'', emailError:false, emailMessage:''},
        dateOfBirth: new Date(),
        gender:"Male"
    });
    const [openMsg, setOpenMsg] = useState(false)
    

    const onCancelButton=()=>{
        props.history.push('/');
    }

    const handleClickShowPassword=()=>{
        (formInfo.passwordInfo.showPassword) ? 
        setFormInfo({...formInfo}, formInfo.passwordInfo.showPassword= false) : 
        setFormInfo({...formInfo}, formInfo.passwordInfo.showPassword= true)
    }

    const onFirstnameChange=(e)=>{
        setFormInfo({...formInfo, firstnameInfo:{firstname: e.target.value}})
    }

    const onLastnameChange=(e)=>{
        setFormInfo({...formInfo, lastNameInfo:{lastname: e.target.value}})
    }

    const onPasswordChange=(e)=>{
        setFormInfo({...formInfo, passwordInfo:{password: e.target.value, showPassword: formInfo.passwordInfo.showPassword}})
    }

    const onEmailChange=(e)=>{
        setFormInfo({...formInfo, emailInfo:{email: e.target.value}})
    }

    const onDateOfBirthChange=(e)=>{
        setFormInfo({...formInfo, dateOfBirth: e})
    }

    const onGenderChange=(e)=>{
        setFormInfo({...formInfo, gender: e.target.value})
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenMsg(false);
    };

    const onSubmitButton=async()=>{
        const regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/

        if( regex.test(String(formInfo.emailInfo.email)) && (formInfo.firstnameInfo.firstname.length > 0) && (formInfo.lastNameInfo.lastname.length > 0)  && (formInfo.passwordInfo.password.length > 3)){
            const checkIfEmailExists = await axios.get(`http://localhost:5000/user/getUserByEmail/${formInfo.emailInfo.email}`);
            if(!checkIfEmailExists.data){
                await axios.post('http://localhost:5000/user/signup', { 
                    name: formInfo.firstnameInfo.firstname,
                    surname: formInfo.lastNameInfo.lastname,
                    password: formInfo.passwordInfo.password,
                    email: formInfo.emailInfo.email,
                    dateOfBirth: formInfo.dateOfBirth,
                    gender: formInfo.gender
                 })
                 const variant = 'success'
                 enqueueSnackbar('Your account created successfully!', {variant})
                 props.history.push('/') 
            }else{
                setFormInfo({...formInfo, emailInfo: {email:'', emailMessage: "Email address already in use", emailError:true }})
            }
        }else if(formInfo.emailInfo.email.length === 0 && formInfo.firstnameInfo.firstname.length === 0 && formInfo.lastNameInfo.lastname.length === 0 &&  (formInfo.passwordInfo.password===undefined || formInfo.passwordInfo.password.length === 0 )){
            setFormInfo({...formInfo, 
                        firstnameInfo: {firstname:'', firstnameMessage: "Empty field", firstnameError:true},
                        lastNameInfo: {lastname:'', lastnameMessage: "Empty field" , lastnameError: true },
                        passwordInfo: {password:'', passwordMessage: "Empty field" , passwordError:true, showPassword:false},
                        emailInfo: {email:'', emailMessage: "Empty field", emailError:true }
            });
        }else{
            if(( formInfo.passwordInfo.password.length === 0) || (formInfo.passwordInfo.password=== undefined)){
                setFormInfo({...formInfo, passwordInfo: {password:'', passwordMessage: "Empty field", passwordError:true , showPassword:false}});
            }else if( formInfo.passwordInfo.password.length < 4){
                setFormInfo({...formInfo, passwordInfo: {password:'', passwordMessage: "Invalid password", passwordError:true , showPassword:false}});
            }

            if(formInfo.emailInfo.email.length === 0){
                setFormInfo({...formInfo, emailInfo: {email:'' ,emailMessage: "Empty field", emailError:true }});
            }else if( !regex.test(String(formInfo.emailInfo.email))){
                setFormInfo({...formInfo, emailInfo: {email:'' ,emailMessage: "Invalid email", emailError:true }});
            }

            if(formInfo.firstnameInfo.firstname.length === 0){
                setFormInfo({...formInfo, firstnameInfo: {firstname:'' ,firstnameMessage: "Empty field", firstnameError:true }});
            }

            if(formInfo.lastNameInfo.lastname.length === 0){
                setFormInfo({...formInfo, lastNameInfo: {lastname:'' ,lastnameMessage: "Empty field", lastnameError:true }});
            }
        }
    }
    
    return(
        <div className={classes.root}>
            <Container>
                <Grid container >
                    <Grid item md={3} sm={0} />
                    <Grid item md={6} sm={12}>
                        <Card className={classes.cardStyle}>
                            <CardContent>
                                <Box className={classes.boxSignUp}>
                                    <Typography variant="h4">Sign up</Typography>
                                    <Typography variant="subtitle1">Its quick and easy!</Typography>
                                </Box>
                                <form noValidate style={{marginTop:15}} autoComplete="off">
                                    <Box display="flex">
                                        <FormControl error={formInfo.firstnameInfo.firstnameError} onChange={(e)=>onFirstnameChange(e)} className={classes.nameInput} variant="outlined">
                                            <InputLabel id="firstname" htmlFor="firstname-outlined">First name</InputLabel>
                                            <OutlinedInput 
                                                id="firstname-outlined" 
                                                type="text"
                                                label="First name"
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        {(formInfo.firstnameInfo.firstnameError) ? <ErrorIcon label="Error" style={{color:"red"}} /> : null}
                                                    </InputAdornment>
                                                }
                                            />
                                            {(formInfo.firstnameInfo.firstnameError) ? (<FormHelperText id="firstname-outlined">{formInfo.firstnameInfo.firstnameMessage}</FormHelperText>) : null}
                                        </FormControl>
                                        <FormControl error={formInfo.lastNameInfo.lastnameError} onChange={(e)=>onLastnameChange(e)} className={classes.lastNameInput} variant="outlined">
                                            <InputLabel htmlFor="lastname-outlined">Last name</InputLabel>
                                            <OutlinedInput 
                                                id="lastname-outlined" 
                                                type="text"
                                                label="Last name" 
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        {(formInfo.lastNameInfo.lastnameError) ? <ErrorIcon label="Error" style={{color:"red"}} /> : null}
                                                    </InputAdornment>
                                                }
                                            />
                                            {(formInfo.lastNameInfo.lastnameError) ? (<FormHelperText id="lastname-outlined">{formInfo.lastNameInfo.lastnameMessage}</FormHelperText>) : null}
                                        </FormControl>
                                    </Box>
                                    <Box mt={2}>
                                        <FormControl error={formInfo.passwordInfo.passwordError} onChange={(e)=>onPasswordChange(e)} style={{width:"100%"}} variant="outlined">
                                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-password"
                                                type={formInfo.passwordInfo.showPassword ? 'text' : 'password'}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={()=>handleClickShowPassword()}
                                                        edge="end"
                                                        >
                                                            { formInfo.passwordInfo.showPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                        {(formInfo.passwordInfo.passwordError) ? <ErrorIcon style={{marginLeft:15, color:"red"}}/> : null}
                                                    </InputAdornment>
                                                }
                                                labelWidth={70}
                                            />
                                            {(formInfo.passwordInfo.passwordError) ? (<FormHelperText id="outlined-adornment-password">{formInfo.passwordInfo.passwordMessage}</FormHelperText>) : null}
                                        </FormControl>
                                    </Box>
                                    <Box mt={2}>
                                        <FormControl error={formInfo.emailInfo.emailError} onChange={(e)=>onEmailChange(e)} style={{width:"100%"}} variant="outlined">
                                            <InputLabel htmlFor="my-email-outlined">Email address</InputLabel>
                                            <OutlinedInput 
                                                type="text" 
                                                id="my-email-outlined" 
                                                label="Email address" 
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        {(formInfo.emailInfo.emailError) ? <ErrorIcon label="Error" style={{color:"red"}} /> : null}
                                                    </InputAdornment>
                                                }
                                            />
                                            {(formInfo.emailInfo.emailError) ? (<FormHelperText id="my-email-outlined">{formInfo.emailInfo.emailMessage}</FormHelperText>) : null}
                                        </FormControl>       
                                    </Box>
                                    <Box mt={2} display="flex">
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                margin="normal"
                                                id="date-picker-dialog"
                                                label="Date of Birth"
                                                format="MM/dd/yyyy"
                                                value={formInfo.dateOfBirth}
                                                onChange={(e)=>onDateOfBirthChange(e)}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                        <FormControl style={{marginLeft:"auto",marginLeft:10,marginTop:16}}>
                                            <InputLabel shrink htmlFor="age-native-label-placeholder">
                                                 Gender
                                            </InputLabel>
                                            <NativeSelect
                                                value={formInfo.gender}
                                                onChange={(e)=>onGenderChange(e)}
                                                inputProps={{
                                                    name: 'age',
                                                    id: 'age-native-label-placeholder',
                                                }}
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                {/* <option value={30}>None</option> */}
                                            </NativeSelect>
                                        </FormControl>
                                    </Box>
                                    <Box mt={5}>
                                        <CardContent style={{display:"flex", justifyContent:"center"}}>
                                            <Button onClick={()=>onSubmitButton()} variant="contained" style={{backgroundColor:"#4caf50", color:"white",marginRight:10}}>Sign up</Button>
                                            <Button onClick={()=> onCancelButton()} variant="contained" style={{backgroundColor:"red", color:"white"}}>Cancel</Button>
                                        </CardContent>
                                    </Box>
                                    <Snackbar open={openMsg} autoHideDuration={6000} onClose={handleClose}>
                                        <Alert onClose={handleClose} severity="info">
                                            Account created successfully!
                                        </Alert>
                                    </Snackbar>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={3} sm={0} />
                </Grid>
            </Container>
        </div>
    )
}
export default SignUp;