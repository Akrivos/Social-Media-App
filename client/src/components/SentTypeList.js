import { Box, makeStyles, Menu, MenuItem, Typography, withStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import PublicIcon from '@material-ui/icons/Public';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';

const useStyles = makeStyles((theme) => ({
    typographyStyle:{
        marginLeft:5
    }
}))

const SentTypeList = (props) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClose = () => {
        setAnchorEl(null);
        props.closeSendTypeFunction()
    };

    const onSelectType = (type) => {
        props.selectedSendTypeFunction(type);
        setAnchorEl(null);
        props.closeSendTypeFunction()
    }

    useEffect(()=>{
        setAnchorEl(props.openSendType)
    },[props.openSendType])

    return (
        <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            <MenuItem onClick={()=>onSelectType('Public')}>
                <PublicIcon fontSize="small" />
                <Typography className={classes.typographyStyle}>Public</Typography>
            </MenuItem>
            <MenuItem onClick={()=>onSelectType('Friends')}>
                <PeopleIcon fontSize="small" />
                <Typography className={classes.typographyStyle}>Friends</Typography>
            </MenuItem>
            <MenuItem onClick={()=>onSelectType('Only me')}>
                <PersonIcon fontSize="small" />
                <Typography className={classes.typographyStyle}>Only me</Typography>
            </MenuItem>
        </Menu>
    )
}

export default SentTypeList;