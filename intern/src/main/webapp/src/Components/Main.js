import '../index.css';

import React, {Component} from "react";

import PrimarySearchAppBar from './PrimarySearchAppBar';
import AddEventDialog from './manageevent/AddEventDialog';
import 'fontsource-roboto';
//material ui
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import EventNoteIcon from "@material-ui/icons/EventNote";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import SettingsIcon from "@material-ui/icons/Settings";
import AddIcon from "@material-ui/icons/Add";
import Card from "@material-ui/core/Card";

import EventsList from "./EventsList";
import Login from "./Login";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';
import {getJwsToken, getUsername} from "./authentication/LocalStorageService";
import {BackdropContext} from "./contexts/BackdropContext";
import {AppStateContext} from "./contexts/AppStateContext";
import QrCodeWebSocketDialog from "./QrCodeWebSocketDialog";
import AppliedEventsList from "./AppliedEventsList";
import {withRouter,BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';

const styles = theme =>  ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },

});

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const BACKGROUND_URL='url(https://previews.123rf.com/images/notkoo2008/notkoo20081412/notkoo2008141200034/34479086-seamless-doodle-coffee-pattern-background.jpg)';

let stompClient=null;
const WEBSOCKET_COMPONENT=1;

class Main extends Component{


    static contextType = BackdropContext;

    constructor(props) {
        super(props);
        this.state={
            openAddEventDialog:false,
            allEvents:[],
            createdEvents:[],
            snackbar: [{
                isOpen: false,
                message: "",
                severity: ""
            }],
            isLoginDialogOpen:false,
            isAuthorized:false,
            username:'',
            setIsAuthorized:this.setIsAuthorized ,
            setUsername:this.setUsername ,
            setCreatedEvents:this.setCreatedEvents,
            sendNotification:this.sendNotification,
            getAllEvents:this.getAllEvents,
            websocketDialogElement:(<></>),
            getSearchedEvents:this.getSearchedEvents,
            copyOfAllEvents:[],
            copyOfCreatedEvents:[]
        };
    }


    MANAGE_EVENT_PAGE=1;
    ALL_EVENTS_PAGE=2;
    APPLIED_EVENTS_PAGE=3;

    componentDidMount() {
        this.getAllEvents();
        this.checkJwtValidation();
        this.connectWebSocket();
        console.log("->>>>>>>>>>>>>>>>>>>>hello=-=-=-=-=-");
        this.context.setOpenBackdropScreen();
    }

    checkJwtValidation = ()=>{
        axios.get("/manageevent/allevents/createdevents",{
            headers: {
                'Authorization': `Bearer ${getJwsToken()}`
            }
        }).then((response) => {
            this.setIsAuthorized(true);
        }).catch((error)=>{});
    }

    //**** setters for authorization variables to use in context  ***///
    setIsAuthorized = (value) =>{
        this.setState({
            isAuthorized: value
        });
    }
    setUsername = (username)=>{
        this.setState({
            username: username
        });
    }
    //**** setters for authorization variables to use in context ***///

    //****WEBSOCKET***//
    connectWebSocket = () => {
        const Stomp = require('stompjs');
        let SockJS = require('sockjs-client');
        SockJS = new SockJS('/sendNotification');
        stompClient = Stomp.over(SockJS);
        stompClient.connect({}, this.onConnected, this.onError);
    }
    onConnected = () => {
        if(this.state.isAuthorized)
            stompClient.subscribe('/notify/reply/'+getUsername(), this.onMessageReceived);
        else
            stompClient.subscribe('/notify/reply/', this.onMessageReceived);
    }
    sendNotification = ( participantDTO, assignedEvent) => {
        let notificationDTO = {
            name: participantDTO.name,
            surname: participantDTO.surname,
            ssn: participantDTO.ssn,
            eventTitle: assignedEvent.title,
            eventUniqueName: assignedEvent.uniqueName
        };
        stompClient.send('/app/sendNotification', {}, JSON.stringify(notificationDTO));
    }
    onMessageReceived = (payload) => {
        let message = JSON.parse(payload.body);
        this.setState({
            websocketDialogElement: (
                <QrCodeWebSocketDialog
                    message={message}
                    dialogTitle={"Yeni bir katılımcı var"}
                    whichDialogContent={WEBSOCKET_COMPONENT}
                    handleClose={this.handleCloseWebsocketDialog}
                    open={true}
                />)
        });
        this.getAllEvents();
    }
    handleCloseWebsocketDialog = () => {
        this.setState({
            websocketDialogElement:(<></>)
        });
    };
    //****WEBSOCKET***//


    //****EVENTS TO LIST***//
    getAllEvents = ()=>{
        //Backdrop screen is set.

        let header={
            'Authorization': `Bearer ${getJwsToken()}`
        }
        axios.get("/manageevent/allevents")
            .then(response => {
                this.setState({
                    allEvents: response.data,
                    copyOfAllEvents:response.data
                });
            }).catch((error)=>{});
        if(getJwsToken()!==null){
            this.getCreatedEvents(header);
        }
    }
    getCreatedEvents = (header)=>{
        axios.get("/manageevent/allevents/createdevents",{
            headers:header
        }).then(response => {
            this.setState({
                createdEvents: response.data,
                copyOfCreatedEvents:response.data
            });
        }).catch((error)=>{});
    }
    getSearchedEvents = (event)=>{ //For search operation
        let initialPath = window.location.href.slice(22,window.location.href.length);
        let searchKeyword = event.target.value.toLowerCase();
        if(event.keyCode === 13){ //Keycode for `Enter` key
            if(initialPath==="allevents"){//search for created events for applying event page
                let searchedEvents = this.searchForAllEvents(
                    searchKeyword,
                    this.state.copyOfAllEvents
                );
                this.setState({
                    allEvents:searchedEvents
                });
            }
            else if(initialPath==="manageevents"){//search for created events for corporate user
                let searchedEvents= this.searchForAllEvents(
                    searchKeyword,
                    this.state.copyOfCreatedEvents
                );
                this.setState({
                    createdEvents:searchedEvents
                });
            }
        }
    }
    searchForAllEvents = (keyword, eventList)=>{
        let searchedEvents=[];
        if(keyword==="")
            searchedEvents=eventList;
        else{
            eventList.forEach((event)=>{ //Search for each event field
                if(event.title.toLowerCase().includes(keyword))
                    searchedEvents.push(event);
                else if(event.startDateTime.toLocaleString().toLowerCase().includes(keyword))
                    searchedEvents.push(event);
                else if(event.endDateTime.toLocaleString().toLowerCase().includes(keyword))
                    searchedEvents.push(event);
                else if(event.address.toLocaleString().toLowerCase().includes(keyword))
                    searchedEvents.push(event);
            });
        }
        return searchedEvents;
    }
    //****EVENTS TO LIST***//



    // ADD EVENT FUNCTIONS START //
    //Click add event start
    handleClickOpen = () => {
        this.setState({
            openAddEventDialog:true
        });
    };
    //Close add event dialog
    handleCloseAddEvent = () => {
        this.setState({
            openAddEventDialog:false
        });
    };
    handleSubmitAddEvent = (eventObject) => {
        this.setState({
            openAddEventDialog:false
        });

        let headers = {
            'Authorization': `Bearer ${localStorage.getItem("Authorization")}`
        };
        axios.post("/manageevent/addevent",eventObject,{
            headers:headers
        })
            .then(response => {
                this.snackbarOpen(eventObject.title+" başarıyla eklendi", "success");
                this.getAllEvents();
            })
            .catch(error => {
                if (error.response.status === 400) {
                    this.snackbarOpen(error.response.data.errors[0].defaultMessage, "error")
                }
            });
    }
    // ADD EVENT FUNCTIONS END //


    // SNACK BAR FUNCTIONS START //
    snackbarOpen = (message, severity) => {
        this.setState(prevState => {
            let snackbar = {...prevState.snackbar}
            snackbar.isOpen = true;
            snackbar.message = message;
            snackbar.severity = severity;
            return {snackbar};
        })
    }
    snackbarClose = () => {
        this.setState(prevState => {
            let snackbar = {...prevState.snackbar}
            snackbar.isOpen = false;
            snackbar.message = "";
            snackbar.severity = "";
            return {snackbar};
        })
    }
    // SNACK BAR FUNCTIONS END


    getAddAndManageEventButtonIfAuthorized() {
        if(this.state.isAuthorized)
            return (
                <>
                    <Divider/>
                    <Link to={"/manageevents"} style={{textDecoration: 'none'}}>
                        <ListItem button>
                            <ListItemIcon>
                                <SettingsIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Etkinlikleri Yönet" style={{color: 'white'}}/>
                        </ListItem>
                    </Link>
                    <Divider/>
                    <ListItem button onClick={this.handleClickOpen}>
                        <ListItemIcon>
                            <AddIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Etkinlik Ekle" style={{color: 'white'}}/>
                    </ListItem>
                </>
            );
        else
            return '';
    }

    routeManageEventPageIfAuthorized=()=>{
        if (!this.state.isAuthorized)
            return (<Login
                snackbarOpen={this.snackbarOpen}
                setCreatedEvents={this.setCreatedEvents}
            />);
        else
            return (<EventsList
                allEvents={this.state.allEvents}
                snackbarOpen={this.snackbarOpen}
                snackbarClose={this.snackbarClose}
                whichPage={this.MANAGE_EVENT_PAGE}
                getAllEvents={this.getAllEvents}
                pageTitle={'Etkinlikleri Yönet'}
            />);
    }

    setCreatedEvents = (newEvents)=>{
        this.setState(
            {
                createdEvents:newEvents
            }
        )
    }

    render(){
        const { classes } = this.props;
        return (
            <AppStateContext.Provider value={this.state}>
                <Router>
                    <Grid container direction={"column"}>

                    </Grid>
                    <PrimarySearchAppBar/>
                    {this.state.websocketDialogElement}
                    {/* Add event Modal start */}
                    <AddEventDialog openAddEventDialog={this.state.openAddEventDialog}
                                    handleClose={this.handleCloseAddEvent}
                                    handleSubmit={this.handleSubmitAddEvent}
                                    allEvents={this.state.allEvents}
                                    isAddEventDialogMountedForUpdate={false}
                                    updatedEvent={{}}
                    />
                    {/* Add event Modal end */}
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="stretch"
                        style={{    marginTop: '64px'}}
                    >
                        {/* Left Menu start*/}
                        <Grid item md={3}
                              style={{backgroundImage: 'url(https://previews.123rf.com/images/notkoo2008/notkoo20081412/notkoo2008141200034/34479086-seamless-doodle-coffee-pattern-background.jpg)'}}>

                            <Grid
                                container
                                direction="column"
                                justify="flex-start"
                                alignItems="stretch"
                                style={{minHeight: '100vh'}}
                            >
                                <Grid item style={{height: '11vh'}}/>
                                <Grid
                                    container
                                    direction="column"
                                    justify="center"
                                    alignItems="center"
                                >
                                    <Card className={classes.root} variant="outlined" style={{backgroundColor: '#F6931E'}}>
                                        <List component="nav" aria-label="main mailbox folders">

                                            <Link to={"/allevents"} style={{textDecoration: 'none'}}>
                                                <ListItem button>
                                                    <ListItemIcon>
                                                        <EventNoteIcon/>
                                                    </ListItemIcon>
                                                    <ListItemText primary="Etkinliğe Katıl" style={{color: 'white'}}/>
                                                </ListItem>
                                            </Link>
                                            <Divider/>
                                            <Link to={"/listappliedevents"} style={{textDecoration: 'none'}}>
                                                <ListItem button>
                                                    <ListItemIcon>
                                                        <EventAvailableIcon/>
                                                    </ListItemIcon>
                                                    <ListItemText primary="Katıldığın Etkinlikler" style={{color: 'white'}}/>
                                                </ListItem>
                                            </Link>

                                            {this.getAddAndManageEventButtonIfAuthorized()}
                                        </List>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>
                        {/*Left Menu end*/}

                        {/* Page contents start */}

                        <Grid item md={7} style={{backgroundColor:'#FBF4ED'}}>
                            <Switch>
                                <Route path="/allevents" component={() => (<EventsList allEvents={this.state.allEvents}
                                                                                       pageTitle={'Tüm Etkinlikler'}
                                                                                       whichPage={this.ALL_EVENTS_PAGE}
                                                                                       snackbarOpen={this.snackbarOpen}
                                                                                       snackbarClose={this.snackbarClose}
                                                                                       getAllEvents={this.getAllEvents}

                                />)
                                }/>
                                <Route path="/manageevents" component={() => this.routeManageEventPageIfAuthorized()}/>
                                <Route path="/listappliedevents" component={
                                    () => (<AppliedEventsList allEvents={this.state.allEvents}
                                                              pageTitle={'Kaydolunan Etkinlikler'}
                                                              whichPage={this.APPLIED_EVENTS_PAGE}
                                                              snackbarOpen={this.snackbarOpen}
                                                              snackbarClose={this.snackbarClose}
                                    />)}
                                />
                                <Route path="/" component={() => this.routeManageEventPageIfAuthorized()}/>
                            </Switch>
                        </Grid>
                        {/* Page contents end */}

                        <Grid item md={2} style={{
                            backgroundRepeat: 'repeat-y',
                            backgroundImage: BACKGROUND_URL
                        }}/>

                    </Grid>
                </Router>
                <Snackbar open={this.state.snackbar.isOpen} autoHideDuration={2000} onClose={this.snackbarClose}>
                    <Alert onClose={this.snackbarClose} severity={this.state.snackbar.severity}>
                        {this.state.snackbar.message}
                    </Alert>
                </Snackbar>
            </AppStateContext.Provider>
        );
    }
}

export default withStyles(styles)(withRouter(Main));
