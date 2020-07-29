import './index.css';

import React, {Component} from "react";

import PrimarySearchAppBar from './Components/PrimarySearchAppBar';
import AddEventDialog from './Components/AddEventDialog';

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
import {getJwsToken, isAuthorized, setCreatedItems} from "./Components/authentication/LocalStorageService";

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

class App extends Component{

  state={
    openAddEventDialog:false,
    allEvents:[],
    snackbar: [{
      isOpen: false,
      message: "",
      severity: ""
    }],
    isLoginDialogOpen:false
  };

  MANAGE_EVENT_PAGE=1;
  ALL_EVENTS_PAGE=2;

  componentDidMount() {
    this.getAllEvents();
  }

  getAllEvents = ()=>{
    let header={
      'Authorization': `Bearer ${getJwsToken()}`
    }
    axios.get("/manageevent/allevents")
        .then(response => {
          this.setState({allEvents: response.data})
        });
    axios.get("/manageevent/allevents/createdevents",{
      headers:header
    })
        .then(response => {
          console.log(response);
          setCreatedItems(response.data);
        });

    console.log("response");
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
          this.setState(prevState => (
              {allEvents: [...prevState.allEvents, response.data]}
          ));
          this.snackbarOpen("Event added successfully", "success")
        })
        .catch(error => {
          if (error.response.status === 400) {
            this.snackbarOpen(error.response.data.errors[0].defaultMessage, "error")
          }
          console.log(error.response);
        })
      console.log("event: "+eventObject);
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
    if(isAuthorized())
      return (<ListItem button onClick={this.handleClickOpen}>
                <ListItemIcon>
                  <AddIcon/>
                </ListItemIcon>
                <ListItemText primary="Add Event" style={{color: 'white'}}/>
              </ListItem>);
    else
      return '';
  }

  routeManageEventPageIfAuthorized=()=>{
    if (!isAuthorized())
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
                  pageTitle={'Manage Events'}
              />);
  }


  render(){
    const { classes } = this.props;
    return (
        <div>
          <Router>
            <PrimarySearchAppBar/>
            {/* Add event Modal start */}
            <AddEventDialog openAddEventDialog={this.state.openAddEventDialog}
                            handleClose={this.handleCloseAddEvent}
                            handleSubmit={this.handleSubmitAddEvent}
                            allEvents={this.state.allEvents}
                            isAddEventDialogMountedForUpdate={false}
                            updatedEvent={{}}
            />
            {/* Add event Modal end */}
            <Grid item>
              <Grid
                  container
                  direction="row"
                  justify="flex-start"
                  alignItems="stretch"
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
                              <ListItemText primary="All Events" style={{color: 'white'}}/>
                            </ListItem>
                          </Link>
                          <Divider/>
                          <ListItem button>
                            <ListItemIcon>
                              <EventAvailableIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Assigned Events" style={{color: 'white'}}/>
                          </ListItem>
                          <Divider/>
                          <Link to={"/manageevents"} style={{textDecoration: 'none'}}>
                            <ListItem button>
                              <ListItemIcon>
                                <SettingsIcon/>
                              </ListItemIcon>
                              <ListItemText primary="Manage Events" style={{color: 'white'}}/>
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
                <Switch>
                  <Route path="/allevents" component={() => (<EventsList allEvents={this.state.allEvents}
                                                                         pageTitle={'All Events'}
                                                                         whichPage={this.ALL_EVENTS_PAGE}/>)
                  }/>
                  <Route path="/manageevents" component={() => this.routeManageEventPageIfAuthorized()}/>
                  <Route path="/" component={() => <Login snackbarOpen={this.snackbarOpen}
                                                          setCreatedEvents={this.setCreatedEvents}
                                                          updateLeftMenuIfAuthorized={this.updateLeftMenuIfAuthorized}/>}/>
                </Switch>
                {/* Page contents end */}

                <Grid item md={2} style={{
                  backgroundRepeat: 'repeat-y',
                  backgroundImage: BACKGROUND_URL
                }}/>

              </Grid>
            </Grid>
          </Router>
          <Snackbar open={this.state.snackbar.isOpen} autoHideDuration={3000} onClose={this.snackbarClose}>
            <Alert onClose={this.snackbarClose} severity={this.state.snackbar.severity}>
              {this.state.snackbar.message}
            </Alert>
          </Snackbar>
        </div>
      );
  }


}

export default withStyles(styles)(App)
