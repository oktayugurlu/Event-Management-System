import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {AppStateContext} from "./contexts/AppStateContext";
import SearchIcon from '@material-ui/icons/Search';
import InputBase from "@material-ui/core/InputBase";
import {fade} from "@material-ui/core";

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
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },[theme.breakpoints.up('sm')]: {
            display: 'flex',
        },[theme.breakpoints.up('xs')]: {
            display: 'flex',
        },
    },
}));

export default function PrimarySearchAppBar() {
    const classes = useStyles();
    const createdEventsContext = useContext(AppStateContext);

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
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon/>
                        </div>
                        <InputBase
                            onKeyDown={createdEventsContext.getSearchedEvents}
                            placeholder="Arama…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        {renderButtonForLogin()}
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}