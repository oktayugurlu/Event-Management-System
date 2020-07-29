import '../index.css';

import React from "react";

import EventCard from './EventCard';

//material ui
import Grid from '@material-ui/core/Grid';
import Pagination from "@material-ui/lab/Pagination";
import axios from "axios";
import AddEventDialog from "./AddEventDialog";
import {getCreatedItemsByUser, getJwsToken} from "./authentication/LocalStorageService";
import {} from "./authentication/LocalStorageService";
import AssignEventDialog from "./AssignEventDialog";

export default function EventsList(props) {
    const [page, setPage] = React.useState(0);
    const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);
    const [updatedEvent, setUpdatedEvent] = React.useState({});
    const [updatedDialogElement, setUpdatedDialogElement] = React.useState(<div/>);

    const [assignEventDialogElement, setAssignEventDialogElement] = React.useState(<div/>);
    const [isOpenAssignEventDialog, setIsOpenAssignEventDialog] = React.useState(false);
    const ITEMS_PER_PAGE = 3;
    const CARD_IMAGE_URL='https://images.all-free-download.com/images/graphiclarge/team_meeting_background_table_stationery_gathering_people_icons_6838493.jpg';

    const MANAGE_EVENT_PAGE=1;
    const ALL_EVENTS_PAGE=2;

    const titleStyle = {
        marginLeft:'40px',
    };

    const printEvents = ()=>{
        const printedEvents = (props.whichPage===MANAGE_EVENT_PAGE) ? getCreatedItemsByUser() : props.allEvents;

        return(
            printedEvents.slice(page * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE + ITEMS_PER_PAGE).map(
                (item,index)=> {
                    item.endDateTime = dateTimeParserFromString(item.endDateTime);
                    item.startDateTime = dateTimeParserFromString(item.startDateTime);
                    return setEventCard(item, index);
                })
        );
    }
    const dateTimeParserFromString = (dateTime) =>new Date(dateTime);

    const setEventCard = (eventObject, index)=>{
        return(
            <div style={{marginBottom:'4px', marginRight:'40px', marginLeft:'40px'}} key={index}>
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
        setUpdatedDialogElement(<div/>);
        setOpenUpdateDialog(false);
        console.log("eventObject: ");
        console.log(eventObject);
        let headers = {
            'Authorization': `Bearer ${getJwsToken()}`
        };

        axios.put("/manageevent/updateevent", eventObject, {
            headers:headers
        })
            .then(() => {
                props.snackbarOpen(eventObject.uniqueName+" updated successfully", "success")
                props.getAllEvents();
            })
            .catch(error => {
                if (error.response.status === 400) {
                    props.snackbarOpen(error.response.data.errors[0].defaultMessage, "error")
                }
                console.log(error.response);
            })
    }
    // UPDATE EVENT FUNCTIONS end //

    const onChangePageNumber = (event, value) => {
        setPage(value-1);
        console.log(value);
    };
    const calculateNumberOfPage = () => {
        if(props.whichPage===MANAGE_EVENT_PAGE){
            if(getCreatedItemsByUser().length % ITEMS_PER_PAGE !== 0)
                return Math.trunc(getCreatedItemsByUser().length / ITEMS_PER_PAGE) +1;
            else
                return getCreatedItemsByUser().length / ITEMS_PER_PAGE;
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
        axios.post("/manageevent/deleteevent/"+uniqueName)
            .then((response) => {
                props.snackbarOpen(response.data, response.data==="Invalid delete request!" ? "error":"success")
                props.getAllEvents();
            })
            .catch(error => {
                if (error.response.status === 400) {
                    props.snackbarOpen(error.response.data.errors[0].defaultMessage, "error")
                }
                console.log(error.response);
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

    const handleSubmitAssignEvent = (participant, eventObject) => {
        setAssignEventDialogElement(<div/>);
        setIsOpenAssignEventDialog(false);
        axios.put("/assignevent/assign", participant)
            .then(() => {
                props.snackbarOpen("You assign to "+eventObject.title+" event successfully", "success")
                props.getAllEvents();
            })
            .catch(error => {
                if (error.response.status === 400) {
                    props.snackbarOpen(error.response.data.errors[0].defaultMessage, "error")
                }
                console.log(error.response);
            })
    }
    const handleCloseAssignEventDialog = () => {
        console.log("adasdsadasdasdasdsda")
        setAssignEventDialogElement(<div/>);
        setIsOpenAssignEventDialog(false);
    }
    //**** ASSIGN EVENT FUNCTIONS END ****//

    return (
        <Grid item md={7} style={{backgroundColor:'#FBF4ED'}}>
            <Grid container direction="column" alignItems="stretch" >
                <h1 style={titleStyle}>{props.pageTitle}</h1>
                {updatedDialogElement}
                {assignEventDialogElement}
                {printEvents()}
                <div style={{marginBottom:'40px'}}>
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="flex-start"
                    >
                        <Pagination count={calculateNumberOfPage()}
                                    onChange={onChangePageNumber}/>
                    </Grid>
                </div>
            </Grid>
        </Grid>
    )
}