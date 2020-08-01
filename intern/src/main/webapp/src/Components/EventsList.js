import '../index.css';

import React, {useContext} from "react";

import EventCard from './EventCard';
//material ui
import Grid from '@material-ui/core/Grid';
import Pagination from "@material-ui/lab/Pagination";
import axios from "axios";
import AddEventDialog from "./AddEventDialog";
import { getJwsToken} from "./authentication/LocalStorageService";
import AssignEventDialog from "./AssignEventDialog";
import QrCodeDialog from "./QrCodeDialog";
import Divider from "@material-ui/core/Divider";
import BarChart from "./BarChart";
import {CreatedEventsContext} from "./contexts/CreatedEventsContext";

export default function EventsList(props) {
    const [page, setPage] = React.useState(0);
    const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);
    const [updatedEvent, setUpdatedEvent] = React.useState({});
    const [updatedDialogElement, setUpdatedDialogElement] = React.useState(<div/>);

    const [assignEventDialogElement, setAssignEventDialogElement] = React.useState(<div/>);
    const [isOpenAssignEventDialog, setIsOpenAssignEventDialog] = React.useState(false);
    const [qrCodeDialogElement, setQrCodeDialogElement] = React.useState(<></>);

    const ITEMS_PER_PAGE = 3;
    const CARD_IMAGE_URL='https://images.all-free-download.com/images/graphiclarge/team_meeting_background_table_stationery_gathering_people_icons_6838493.jpg';

    const MANAGE_EVENT_PAGE=1;
    const ALL_EVENTS_PAGE=2;

    const createdEventsContext = useContext(CreatedEventsContext);

    const titleStyle = {
        marginLeft:'40px',
    };

    const printEvents = ()=>{
        console.log(createdEventsContext);
        const printedEvents = (props.whichPage===MANAGE_EVENT_PAGE) ? createdEventsContext.createdEvents : props.allEvents;

        return(
            <Grid item>
                {printedEvents.slice(page * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE + ITEMS_PER_PAGE).map(
                    (item,index)=> {
                        item.endDateTime = dateTimeParserFromString(item.endDateTime);
                        item.startDateTime = dateTimeParserFromString(item.startDateTime);
                        return setEventCard(item, index);
                    })}
            </Grid>

        );
    }
    const dateTimeParserFromString = (dateTime) =>new Date(dateTime);

    const setEventCard = (eventObject, index)=>{
        return(
            <div style={{ marginBottom:'40px',marginRight:'40px', marginLeft:'40px'}} key={index}>
                {createEventCardByPageType(eventObject, index)}
            </div>
        );
    };

    const createEventCardByPageType = (eventObject, index)=>{
        if(props.whichPage === MANAGE_EVENT_PAGE){
            return (
                <EventCard  key={eventObject.uniqueName}
                            whichPage={props.whichPage}
                            eventObject={eventObject}
                            imageOfEvent={CARD_IMAGE_URL}
                            allEvents={props.allEvents}
                            openUpdateEventDialog={openUpdateDialog}
                            handleClose = {handleCloseUpdateEventDialog}
                            handleSubmit= {handleSubmitUpdateEvent}
                            handleClickOpenUpdateDialog={handleClickOpenUpdateDialog}
                            handleClickDeleteEventButton={handleClickDeleteEventButton}
                />
            );
        }
        else if(props.whichPage === ALL_EVENTS_PAGE){
            return (
                <EventCard  whichPage={props.whichPage}
                            eventObject={eventObject}
                            imageOfEvent={CARD_IMAGE_URL}
                            handleClickOpenAssignDialog={handleClickOpenAssignDialog}
                />
            );
        }
    };

    // UPDATE EVENT FUNCTIONS start //
    //Click to update event
    const handleClickOpenUpdateDialog = (selectedUpdatedEvent) => {
        setOpenUpdateDialog(true);
        setUpdatedEvent(selectedUpdatedEvent);
        setUpdatedDialogElement((
            <AddEventDialog
                openAddEventDialog={true}
                handleClose = {handleCloseUpdateEventDialog}
                handleSubmit= {handleSubmitUpdateEvent}
                allEvents={props.allEvents}
                updatedEvent={selectedUpdatedEvent}
                isEventUpdated={true}
            />
        ));
    };

    //Close add event dialog
    const handleCloseUpdateEventDialog = () => {
        setUpdatedDialogElement(<div/>);
        setOpenUpdateDialog(false);
    };

    const handleSubmitUpdateEvent = (eventObject) => {

        console.log("eventObject: ");
        console.log(eventObject);
        let headers = {
            'Authorization': `Bearer ${getJwsToken()}`
        };

        axios.put("/manageevent/updateevent", eventObject, {
            headers:headers
        })
            .then((response) => {
                if(response.data==='') props.snackbarOpen(eventObject.uniqueName+" updated successfully", "success");
                else props.snackbarOpen(response.data, "error");
                props.getAllEvents();
            }).catch(error => {
                if(error.response.status === 500)
                    props.snackbarOpen(error.response.data.errors[0].defaultMessage, "error");
            console.log(error.response);
            });
        setUpdatedDialogElement(<div/>);
        setOpenUpdateDialog(false);

    }
    // UPDATE EVENT FUNCTIONS end //

    const onChangePageNumber = (event, value) => {
        setPage(value-1);
        console.log(value);
    };
    const calculateNumberOfPage = () => {
        if(props.whichPage===MANAGE_EVENT_PAGE){
            if(createdEventsContext.createdEvents.length % ITEMS_PER_PAGE !== 0)
                return Math.trunc(createdEventsContext.createdEvents.length / ITEMS_PER_PAGE) +1;
            else
                return createdEventsContext.createdEvents.length / ITEMS_PER_PAGE;
        }else{
            if(props.allEvents.length % ITEMS_PER_PAGE !== 0)
                return Math.trunc(props.allEvents.length / ITEMS_PER_PAGE) +1;
            else
                return props.allEvents.length / ITEMS_PER_PAGE;
        }
    }

    function isEmpty(obj) {
        for(let prop in obj) {
            if(obj.hasOwnProperty(prop)) {
                return false;
            }
        }
        return JSON.stringify(obj) === JSON.stringify({});
    }

    const handleClickDeleteEventButton = (uniqueName)=>{
        let headers = {
            'Authorization': `Bearer ${getJwsToken()}`
        };
        axios.post("/manageevent/deleteevent/"+uniqueName,{},{
            headers:headers
        })
            .then((response) => {
                props.snackbarOpen(response.data, response.data==="Invalid delete request!" ? "error":"success")
                props.getAllEvents();
            })
            .catch(error => {
                if (error.response.status === 400) {
                    props.snackbarOpen(error.response.data.errors[0].defaultMessage, "error")
                }
            })
    }

    //**** ASSIGN EVENT FUNCTIONS START ****//
    const handleClickOpenAssignDialog = (selectedEventToAssign) => {
        setAssignEventDialogElement((
            <AssignEventDialog
                isOpenAssignEventForm={true}
                handleClose = {handleCloseAssignEventDialog}
                handleSubmitAssignEvent= {handleSubmitAssignEvent}
                assignedEvent={selectedEventToAssign}
                isEventUpdated={true}
            />
        ));
    }

    const handleSubmitAssignEvent = (participant, eventUniqueName, title) => {
        setAssignEventDialogElement(<div/>);
        setIsOpenAssignEventDialog(false);
        let qrCode='';

            axios.post("/assignevent/assign/"+eventUniqueName.toString(), participant,{responseType: 'blob'})
                .then((response) => {
                    console.log(response);
                    qrCode = response.data;
                    setQrCodeDialogElement(<QrCodeDialog open={true}
                                                         qrCodeImage={response.data}
                                                         handleClose={handleCloseQrCodeDialog}
                                                         title={title}
                    />);
                }).catch( error => {
                if (error.response.status === 400) {
                    props.snackbarOpen(error.response.data.errors[0].defaultMessage, "error")
                }
                let blob = error.response.data;
                let promise = blopToPromiseParser(blob);
                promiseToJSONParserIncludeFunction(promise);
            });
    }

    //Its used for convert error blob response to promise.
    const blopToPromiseParser = (arrayBuffer)=>{
        return new Response(arrayBuffer);
    }

    //Its used for convert promise to json object to fetch message field.
    const promiseToJSONParserIncludeFunction = (promise)=>{
        let errorMessage = {};
        promise.text().then(result=> {
            console.log("before");
            console.log(result);
            errorMessage = JSON.parse(result);
            console.log(errorMessage);
            if(errorMessage.code === 500){
                console.log("before");
                props.snackbarOpen(errorMessage.message, "error");
            }
        });
    }
    const handleCloseAssignEventDialog = () => {
        console.log("adasdsadasdasdasdsda")
        setAssignEventDialogElement(<div/>);
        setIsOpenAssignEventDialog(false);
        props.getAllEvents();
    }

    const handleCloseQrCodeDialog = (title) => {
        // qrCodeImage="";
        setQrCodeDialogElement(<></>);
        props.snackbarOpen("You assign to "+title+" successfully", "success");
    };
    //**** ASSIGN EVENT FUNCTIONS END ****//

    const printBarChartsIfManagePage = ()=>{
        return (
            <Grid container direction="column" spacing={'3'}>
                <Grid item style={{marginLeft:'40px',marginRight:'40px'}}>
                    <BarChart />
                </Grid>
                <br/>

                <Grid item >
                    <Divider variant="middle"/>
                </Grid>
                <Grid item >
                    <h3 style={{marginLeft:'40px',marginBottom:'40px'}}>
                        Senin Tarafından Yaratılan Etkinlikler
                    </h3>
                </Grid>
            </Grid>
        )
    }


    return (

            <Grid container direction="column" alignItems="stretch" >
                {qrCodeDialogElement}
                <h1 style={titleStyle}>{props.pageTitle}</h1>
                {updatedDialogElement}
                {assignEventDialogElement}
                <Grid
                    direction="column"
                    container
                >
                    {printBarChartsIfManagePage()}
                    {printEvents()}
                    <Grid item >
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="flex-start"
                            style={{marginBottom:'40px'}}
                        >
                            <Pagination count={calculateNumberOfPage()}
                                        onChange={onChangePageNumber}/>
                        </Grid>
                    </Grid>
                </Grid>


            </Grid>
    )
}