

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

const ITEMS_PER_PAGE = 5;
export default class EventsList extends Component{

    APPLIED_EVENTS_PAGE=3;
    CARD_IMAGE_URL='https://images.all-free-download.com/images/graphiclarge/team_meeting_background_table_stationery_gathering_people_icons_6838493.jpg';

    constructor(props) {
        super(props);
        this.state={
            ssn:'',
            participant:{},
            isParticipantExist:false,
            page:0,
            isSubmitSSNClicked:false,
            appliedEvents:[]
        }
    }

    renderAppliedEventsPage = ()=>{
        if(this.state.isSubmitSSNClicked){
            if(this.state.isParticipantExist)
                return (this.renderAppliedEvents());
            else
                return (this.renderSubmitSSNCard());
        }
        else
            return this.renderSubmitSSNCard();
    }

    renderAppliedEvents=()=>{
        return (
            <Grid container direction="column" alignItems="stretch" >
                <Typography variant="h3" gutterBottom>
                    {this.props.pageTitle}
                </Typography>
                <Grid item>
                    <Divider variant="middle"/>
                </Grid>
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

    createEventCardByPageType = (eventObject, index)=>{
        return (
            <EventCard  key={eventObject.uniqueName}
                        whichPage={this.APPLIED_EVENTS_PAGE}
                        eventObject={eventObject}
                        imageOfEvent={this.CARD_IMAGE_URL}
                        allEvents={this.state.appliedEvents}
                        snackbarOpen={this.props.snackbarOpen}
                        participant={this.state.participant}
            />
        );

    };

    renderSubmitSSNCard = ()=>{
        return(
            <Grid container>
                <Grid item md={2}/>
                <Grid item md={8}>
                    <Grid container direction="row" justify="center" alignItems="stretch">
                        <Grid item md={12} style={{marginTop:"80px"}}>
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
                    </Grid>
                </Grid>
                <Grid item md={2}/>
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
        let participantFromEvent={};
        let appliedEvents=[];
        this.props.allEvents.forEach(
            event=>{
                for(let i=0;i<event.appliedParticipantSet.length;i++){
                    if(event.appliedParticipantSet[i].participant.ssn===this.state.ssn){
                        participantFromEvent = event.appliedParticipantSet[i].participant;
                        break;
                    }
                }
            }
        );
        axios.post("/managesurvey/participantanswers", participantFromEvent)
            .then(response => {
                let surveyAnswers = response.data;
                this.props.allEvents.map(
                  event => event.appliedParticipantSet
                      .forEach(
                          application=>{
                              if(application.participant.ssn===this.state.ssn){
                                  if(event.surveyQuestionSet.length>0 && surveyAnswers.length >0) {
                                      if(event.surveyQuestionSet.filter(
                                          surveyQuestion => surveyQuestion.content!==surveyAnswers[0].surveyQuestion.content)===[])
                                          appliedEvents.push(event);
                                  }
                                  else{
                                      appliedEvents.push(event);
                                  }
                              }
                          }
                          ));
                this.setState({
                    appliedEvents:appliedEvents
                });
            });
        this.setState({
            participant:participantFromEvent,
            isParticipantExist:!this.isEmpty(participantFromEvent),
            isSubmitSSNClicked:true
        });
    }

    isEmpty(obj) {
        for(let prop in obj) {
            if(obj.hasOwnProperty(prop)) {
                return false;
            }
        }
        return JSON.stringify(obj) === JSON.stringify({});
    }

    handleOnChangeSSNInput = (event)=>{
        this.setState({
            ssn:event.target.value
        });
    }

    render() { return this.renderAppliedEventsPage();}

}