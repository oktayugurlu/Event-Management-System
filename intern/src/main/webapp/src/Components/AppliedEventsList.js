import '../index.css';

import React, {Component} from "react";
import 'fontsource-roboto';
import EventCard from './EventCard';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Alert from "@material-ui/lab/Alert";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Pagination from "@material-ui/lab/Pagination";
import axios from "axios";
import {getJwsToken, getSSN, setSSN} from "./authentication/LocalStorageService";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";

const ITEMS_PER_PAGE = 5;
export default class EventsList extends Component{

    APPLIED_EVENTS_PAGE=3;
    CARD_IMAGE_URL='https://images.all-free-download.com/images/graphiclarge/team_meeting_background_table_stationery_gathering_people_icons_6838493.jpg';
    state={
        ssn:getSSN(),
        participant:{},
        isParticipantExist:false,
        page:0,
        isSubmitSSNClicked:false,
        appliedEvents:[]
    }
    componentDidMount() {
        if(getSSN()!=='' && getSSN()!==null){
            this.findParticipantAndAppliedEventsBySSN();
        }
    }

    renderAppliedEventsPage = ()=>{
        if(this.state.isSubmitSSNClicked){
            if(this.state.isParticipantExist){
                return (this.renderAppliedEvents());
            }
            else
                return (this.renderSubmitSSNCard());
        }
        else
            return this.renderSubmitSSNCard();
    }

    renderAppliedEvents=()=>{
        return (
            <Grid container
                  direction="column"
                  alignItems="stretch"
                  style={{minHeight:'100vh'}}>
                <Grid
                    direction="column"
                    container
                >
                    {this.printEvents()}
                    <Grid item style={{paddingTop:'20px', paddingBottom:'40px'}}>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="flex-start"
                        >
                            <Pagination count={this.calculateNumberOfPage()}
                                        onChange={this.onChangePageNumber}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

    //******** PAGINATION FUNCTIONS ******///
    onChangePageNumber = (event, value) => {
        this.setState({
            page:value-1
        });
    };
    calculateNumberOfPage = () => {
        if(this.state.appliedEvents.length % ITEMS_PER_PAGE !== 0)
            return Math.trunc(this.state.appliedEvents.length / ITEMS_PER_PAGE) +1;
        else
            return this.state.appliedEvents.length / ITEMS_PER_PAGE;

    }

    printEvents = ()=>{
        if(this.state.appliedEvents.length>0)
            return(
                <Grid item>
                    {this.state.appliedEvents.slice(this.state.page * ITEMS_PER_PAGE,
                        this.state.page * ITEMS_PER_PAGE + ITEMS_PER_PAGE).map(
                        (item,index)=> {
                            item.endDateTime = this.dateTimeParserFromString(item.endDateTime);
                            item.startDateTime = this.dateTimeParserFromString(item.startDateTime);
                            return this.setEventCard(item, index);
                        })}
                </Grid>

            );
    }
    dateTimeParserFromString = (dateTime) =>new Date(dateTime);

    setEventCard = (eventObject, index)=>{
        return(
            <div style={{ marginTop:'40px',marginRight:'40px', marginLeft:'40px'}} key={index}>
                {this.createEventCardByPageType(eventObject, index)}
            </div>
        );
    };

    createEventCardByPageType = (eventObject)=>{
        return (
            <EventCard  key={eventObject.uniqueName}
                        whichPage={this.APPLIED_EVENTS_PAGE}
                        eventObject={eventObject}
                        imageOfEvent={this.CARD_IMAGE_URL}
                        allEvents={this.state.appliedEvents}
                        snackbarOpen={this.props.snackbarOpen}
                        participant={this.state.participant}
                        handleClickSureButtonToLeaveFromEventInFrontend={this.handleClickSureButtonToLeaveFromEventInFrontend}
            />
        );

    };

    //******* DELETE EVENT functions start ********//
   /* handleDeleteEventFromBackend = (deletedEvent)=>{
        let headers = {
            'Authorization': `Bearer ${getJwsToken()}`
        };
        console.log(deletedEvent);
        axios.post("/manageevent/deleteevent/"+deletedEvent.uniqueName,{},{
            headers:headers
        })
            .then((response) => {
                mainStatesContext.getAllEvents();
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 400) {
                    props.snackbarOpen(error.response.data.errors[0].defaultMessage, "error");
                }
            })
    }
    handleClickSureButtonToLeaveFromEventInFrontend = (deletedEvent)=>{
        let deletedIndex = -1;
        let copyCreatedEvents = [...this.state.appliedEvents];
        copyCreatedEvents.forEach((event,index)=>{
            if(deletedEvent.uniqueName === event.uniqueName)
                deletedIndex=index;
        });
        copyCreatedEvents.splice(deletedIndex, 1);
        mainStatesContext.setCreatedEvents(copyCreatedEvents);
        let timeOutToDeleteFromBackend = setTimeout(()=>handleDeleteEventFromBackend(deletedEvent), 6000);
        mainStatesContext.openSnackbarToUndo(deletedEvent.title+" başarıyla silindi!",()=> {
            clearTimeout(timeOutToDeleteFromBackend);
            mainStatesContext.getAllEvents();
            mainStatesContext.closeUndoSnackbar();
            props.snackbarOpen(deletedEvent.title+" etkinliği başarıyla geri alındı", "success");
        });
    }*/

    //******* DELETE EVENT functions end ********//

    renderSubmitSSNCard = ()=>{
        return(
            <Grid container
                  direction={"column"}
                  justify="flex-start"
            >
                <Grid container direction={"row"}>
                    <Grid item md={2}/>
                    <Grid item md={8} style={{marginTop:"40px"}}>
                        <Card>
                            <CardContent>
                                <Grid container>
                                    <Grid item md={3}/>
                                    <Grid item md={6}>
                                        <TextField
                                            id="filled-error-helper-text"
                                            label="TC Kimlik Numarası"
                                            variant="filled"
                                            onChange={this.handleOnChangeSSNInput}
                                            inputProps={{ maxLength: 11}}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item md={3}/>
                                </Grid>
                                {this.renderErrorMessage()}
                            </CardContent>
                            <CardActions>
                                <Button onClick={this.handleClickSubmitSSN} type="submit" color="primary">Gönder</Button>
                            </CardActions>
                        </Card>

                    </Grid>
                    <Grid item md={2}/>
                </Grid>
            </Grid>
        );
    }

    renderErrorMessage = ()=>{
        if(this.state.isSubmitSSNClicked && !this.state.isParticipantExist)
            return (
                <Grid container>
                    <Grid item md={3}/>
                    <Grid item md={6}>
                        <Alert style={{marginTop:'8px', marginBottom:'8px'}} severity="error">
                            Bu TC Kimlik numarası ile bir katılımcı bulunamadı!
                        </Alert>
                    </Grid>
                    <Grid item md={3}/>
                </Grid>);
    }

    handleClickSubmitSSN = ()=>{
        this.findParticipantAndAppliedEventsBySSN();
    }

    findParticipantAndAppliedEventsBySSN=()=>{
        let participant={
            ssn:this.state.ssn
        }
        axios.post("/manageparticipant/getappliedevents",participant)
            .then(response =>{
                let applications=response.data;
                this.setAppliedEventsAndParticipantFromApplication(response.data);
            })
            .catch(error => {
                this.setState({
                    isSubmitSSNClicked:true,
                    isParticipantExist:false
                })
            });
    }

    setAppliedEventsAndParticipantFromApplication = (applications)=>{
        let participantFromBackend={};
        let appliedEvents = applications.map(
            applicationWithEventDTO=>{
                participantFromBackend= applicationWithEventDTO.applicationDTO.participant;
                return applicationWithEventDTO.eventDTO;
            }
        );
        setSSN(participantFromBackend!=={} ? participantFromBackend.ssn:'');
        console.log(participantFromBackend);
        this.setState({
            isParticipantExist:participantFromBackend!=={},
            appliedEvents:[...appliedEvents],
            participant: {...participantFromBackend},
            isSubmitSSNClicked:true,
        });
    }



    handleOnChangeSSNInput = (event)=>{
        this.setState({
            ssn:event.target.value
        });
    }

    handleClickOpenSubmitSSNCardFromBreadcrumbs = ()=>{
        setSSN('');
        this.setState({
            isSubmitSSNClicked:false
        });
    }

    render(){
        return(
            <>
                <Grid container
                      direction="column"
                      alignItems="stretch"
                      style={{minHeight:'100vh'}}
                >
                    <Typography variant="h3" gutterBottom style={{marginLeft:'40px', marginTop:'20px'}}>
                        {this.props.pageTitle}
                    </Typography>
                    <Grid item>
                        <Divider variant="middle"/>
                    </Grid>

                    <Breadcrumbs aria-label="breadcrumb" style={{marginLeft:'40px',marginTop:'40px'}}>
                        <Link component="button" onClick={this.handleClickOpenSubmitSSNCardFromBreadcrumbs}>
                            <Typography color="textSecondary" >TC ile Sorgula</Typography>
                        </Link>
                        {(this.state.isSubmitSSNClicked && this.state.isParticipantExist)
                            ? (<Typography color="textPrimary" >Kayıtlı Etkinlikler</Typography>)
                            : ''
                        }
                    </Breadcrumbs>
                    {this.renderAppliedEventsPage()}
                </Grid>
            </>
        );
    }
}