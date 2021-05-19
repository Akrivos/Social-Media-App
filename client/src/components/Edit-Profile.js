import { Box, Button, Card, CardContent, Grid, IconButton, makeStyles, TextField, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useRef, useState } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import axios from 'axios';
import { AuthContext } from '../context/GlobalContext';

const useStyles = makeStyles({
    root:{
        backgroundColor:"#e0f2f1",
        width:"100%",
        minHeight:"100vh",
    },
    editIconStyle:{
        borderRadius:"50%",
        padding:6,
        backgroundColor:"#ff1744",
        color:'white'
    },
    editBox:{
        display:"flex",
        justifyContent:"center",
        alignContent:"center",
        alignItems:"center"
    },
    editProfileTypography:{
        marginTop:10,
        marginBottom:10,
        textAlign:'center'
    },
    acountCircleBox:{
        display:"flex",
        justifyContent:"center",
        alignContent:"center",
        alignItems:"center"
    },
    acountCircleIconStyle:{
        fontSize:60,
        color:'#0d47a1'
    },
    textFieldStyle:{
        marginTop:30,
    },
    textFieldsBoxContainer:{
        marginLeft:10,
        marginRight:10
    },
    saveButtonStyle:{
        marginTop:30,
        backgroundColor:"#43a047",
        color:"white",
    }
})

const EditProfile=(props)=>{
    const classes = useStyles();
    const [selectedFile, setSelectedFile] = useState('');
    const fileInput = useRef('');
    const [user, setUser] = useState();
    const [profile, setProfile] = useState({
        firstName:'',
        lastName:'',
        job:''
    })

    const onFileSelectChange=(e)=>{
        setSelectedFile(e.target.files[0]);
    }

    const onFileSelectClick=()=>{
        fileInput.current.click()
    }

    const onFirstNameChange=(e)=>{
        setProfile({
            ...profile, firstName: e.target.value
        })
    }

    const onLastNameChange=(e)=>{
        setProfile({
            ...profile, lastName: e.target.value
        })
    }

    const onJobChange=(e)=>{
        setProfile({
            ...profile, job: e.target.value
        })
    }

    const onSaveProfile = async() => {
        const formData = new FormData();
        formData.append('photo', selectedFile);

        if(selectedFile.name){
            await axios.post('http://localhost:5000/profile/uploadImage', formData);

            await axios.post(`http://localhost:5000/profile/updateProfile/${user.id}`, {
                name: profile.firstName,
                surname: profile.lastName,
                about: profile.job,
                image: selectedFile.name
            })
        } else {
            await axios.post(`http://localhost:5000/profile/updateProfile/${user.id}`, {
                name: profile.firstName,
                surname: profile.lastName,
                about: profile.job,
            })
        }

        props.history.push(`/profile/${user.id}`)
    }

    const loadUser = async() => {
        const userID = JSON.parse(localStorage.getItem('userID'));
        await axios.get(`http://localhost:5000/user/getUser/${userID}`).then(resp=>{
            setUser(resp.data)
            if(!resp.data.userHasProfile){
                setProfile({ firstName: resp.data.name, lastName: resp.data.surname, job: ''})
            }else{
                setProfile({firstName: resp.data.name, lastName: resp.data.surname, job: resp.data.userHasProfile.about})
            }
        })
    }

    useEffect(()=>{
        loadUser();
    },[])



    return(
        <div className={classes.root}>
            <Grid container>
                <Grid item md={4} sm={2}/>
                <Grid item md={4} sm={8}>
                    <Card style={{marginTop:50}}>
                        <CardContent>
                            <Box className={classes.editBox}>
                                <EditIcon className={classes.editIconStyle} />
                            </Box>
                            <Typography className={classes.editProfileTypography} variant="h5">Edit Profile</Typography>
                            <Box className={classes.acountCircleBox}>
                                <AccountCircleIcon className={classes.acountCircleIconStyle} />
                            </Box>
                            <Box className={classes.acountCircleBox}>
                                <input ref={fileInput} type="file" style={{display:"none"}} onChange={onFileSelectChange}/>
                                <Button  
                                    variant="contained"
                                    style={{backgroundColor:"#ff1744", color:"white"}}
                                    onClick={onFileSelectClick}
                                    endIcon={<CloudUploadIcon/>}
                                    >
                                    Upload Image
                                </Button>
                            </Box>
                            <Box className={classes.textFieldsBoxContainer}>
                                <TextField 
                                    id="firstname" 
                                    className={classes.textFieldStyle}
                                    value={profile.firstName}
                                    type="text"
                                    label="First name*" 
                                    onChange={onFirstNameChange}
                                    fullWidth
                                />
                                <TextField 
                                    id="lastname"
                                    value={profile.lastName}
                                    className={classes.textFieldStyle} 
                                    type="text"
                                    label="Last name*" 
                                    onChange={onLastNameChange}
                                    fullWidth
                                />
                                <TextField 
                                    id="job" 
                                    value={profile.job}
                                    className={classes.textFieldStyle}
                                    type="text"
                                    label="Job*" 
                                    onChange={onJobChange}
                                    fullWidth
                                />
                                <Button fullWidth variant="contained" onClick={onSaveProfile} className={classes.saveButtonStyle}>Save</Button>
                            </Box>

                        </CardContent>
                    </Card>
                </Grid>
                <Grid item md={4} sm={2}/>
            </Grid>
        </div>
    )
}
export default EditProfile;