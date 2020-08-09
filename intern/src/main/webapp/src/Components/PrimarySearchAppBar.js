import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {GlobalStateContext} from "./contexts/GlobalStateContext";

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
}));

export default function PrimarySearchAppBar() {
    const classes = useStyles();
    const createdEventsContext = useContext(GlobalStateContext);

    const handleLogout = ()=> {
        localStorage.clear();

        window.location.href = "/allevents";
    }
    const handleLogin = ()=> {
        window.location.href = "/login";
    }

    const renderButtonForLogin = ()=>{
        if(createdEventsContext.isAuthorized){
            return (
                <Button variant="outlined"
                        onClick={handleLogout}
                        startIcon={<ExitToAppIcon/>}
                        color="inherit"
                >
                    ÇIKIŞ YAP
                </Button>
            )
        }
        else{
            return (
                <Button
                    variant="outlined"
                    startIcon={<PersonOutlineIcon/>}
                    color="inherit"
                    onClick={handleLogin}
                >
                    GİRİŞ YAP
                </Button>
            );
        }
    }

    return (
        <div className={classes.grow}>
            <AppBar position="fixed" style={{ background: '#F6931E' }}>
                <Toolbar>
                    <Typography className={classes.title} variant="h6" noWrap>
                        Etkinlik Yönetimi
                    </Typography>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        {renderButtonForLogin()}
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}