import './index.css';

import React, {Component} from "react";

import PrimarySearchAppBar from './Components/PrimarySearchAppBar';
import AddEventDialog from './Components/AddEventDialog';
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
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {Switch} from 'react-router-dom';

import EventsList from "./Components/EventsList";
import Login from "./Components/Login";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';
import {getJwsToken, getUsername} from "./Components/authentication/LocalStorageService";
import {GlobalStateContext} from "./Components/contexts/GlobalStateContext";
import QrCodeWebSocketDialog from "./Components/QrCodeWebSocketDialog";


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

class App extends Component{

  state={
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
    setIsAuthorized:()=>{} ,
    setUsername:()=>{} ,
    setCreatedEvents:()=>{},
    sendNotification:()=>{},
    websocketDialogElement:(<></>)
  };

  MANAGE_EVENT_PAGE=1;
  ALL_EVENTS_PAGE=2;

  componentDidMount() {
    this.getAllEvents();
    this.setState({
      setCreatedEvents:this.setCreatedEvents,
      sendNotification:this.sendNotification,
      setIsAuthorized: this.setIsAuthorized,
      setUsername: this.setUsername,
      isAuthorized:false
    })
    this.checkJwtValidation();
    this.connectWebSocket();
  }

  checkJwtValidation = ()=>{
    axios.get("/manageevent/allevents/createdevents",{
      headers: {
        'Authorization': `Bearer ${getJwsToken()}`
      }
    }).then((response) => {
      this.setIsAuthorized(true);
    });
  }

  //**** setters for context variables ***///
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
  //**** setters for context variables ***///

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
    else if(!this.state.isAuthorized){
      stompClient.subscribe('', this.onMessageReceived);
    }
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
      console.log("sendNotification");
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
  }
  handleCloseWebsocketDialog = () => {
    this.setState({
      websocketDialogElement:(<></>)
    });
  };
  //****WEBSOCKET***//


  getAllEvents = ()=>{
    let header={
      'Authorization': `Bearer ${getJwsToken()}`
    }
    axios.get("/manageevent/allevents")
        .then(response => {
          this.setState({allEvents: response.data});
        });
    if(getJwsToken()!==null){
      this.getCreatedEvents(header);
    }
  }

  getCreatedEvents = (header)=>{
    axios.get("/manageevent/allevents/createdevents",{
      headers:header
    }).then(response => {
      console.log(response);
      this.setState({
        createdEvents: response.data
      });
    });

  }

  updateLeftMenuIfAuthorized = ()=>{
    this.setState({
      isAuthorized:true
    });
  }

  // ADD EVENT FUNCTIONS START //
  //Click add event start
  handleClickOpen = () => {
    this.setState({
      openAddEventDialog:true
    });
    console.log("app open setOpenAddEventDialog: "+ this.openAddEventDialog);
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
    let requestObject = {
      eventObject
    };
    axios.post("/manageevent/addevent",eventObject,{
      headers:headers
    })
        .then(response => {
          this.snackbarOpen("Event added successfully", "success")
        })
        .catch(error => {
          if (error.response.status === 400) {
            this.snackbarOpen(error.response.data.errors[0].defaultMessage, "error")
          }
          console.log(error.response);
        });
    console.log("event: "+eventObject);
    this.getAllEvents();
  }
  // ADD EVENT FUNCTIONS END //

  // SNACK BAR FUNCTIONS START //
  snackbarOpen = (message, severity) => {
    console.log(message, severity);
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

  getAddEventButtonIfAuthorized() {
    if(this.state.isAuthorized)
      return (<ListItem button onClick={this.handleClickOpen}>
        <ListItemIcon>
          <AddIcon/>
        </ListItemIcon>
        <ListItemText primary="Etkinlik Ekle" style={{color: 'white'}}/>
      </ListItem>);
    else
      return '';
  }

  routeManageEventPageIfAuthorized=()=>{
    if (!this.state.isAuthorized)
      return (<Login
          snackbarOpen={this.snackbarOpen}
          setCreatedEvents={this.setCreatedEvents}
          updateLeftMenuIfAuthorized={this.updateLeftMenuIfAuthorized}
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
        <GlobalStateContext.Provider value={this.state}>
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
                      // spacing={3}
                      // style={{ minHeight: '100vh' }}
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
                        <ListItem button>
                          <ListItemIcon>
                            <EventAvailableIcon/>
                          </ListItemIcon>
                          <ListItemText primary="Katıldığın Etkinlikler" style={{color: 'white'}}/>
                        </ListItem>
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
                        {this.getAddEventButtonIfAuthorized()}
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
        </GlobalStateContext.Provider>
    );
  }


}

export default withStyles(styles)(App)
