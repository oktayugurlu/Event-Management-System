import '../index.css';

import React, {useContext} from "react";
import 'fontsource-roboto';
import EventCard from './EventCard';
//material ui
import Grid from '@material-ui/core/Grid';
import Pagination from "@material-ui/lab/Pagination";
import axios from "axios";
import AddEventDialog from "./manageeventpage/AddEventDialog";
import {getJwsToken} from "./authentication/LocalStorageService";
import AssignEventDialog from "./AssignEventDialog";
import QrCodeWebSocketDialog from "./QrCodeWebSocketDialog";
import Divider from "@material-ui/core/Divider";
import BarChart from "./manageeventpage/BarChart";
import {AppStateContext} from "./contexts/AppStateContext";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import {BackdropContext} from "./contexts/BackdropContext";


export default function EventsList(props) {
    const [page, setPage] = React.useState(0);
    const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);
    const [updatedDialogElement, setUpdatedDialogElement] = React.useState(<div/>);

    const [assignEventDialogElement, setAssignEventDialogElement] = React.useState(<div/>);
    const [qrCodeDialogElement, setQrCodeDialogElement] = React.useState(<></>);

    const ITEMS_PER_PAGE = 5;
    const CARD_IMAGE_URL='https://images.all-free-download.com/images/graphiclarge/team_meeting_background_table_stationery_gathering_people_icons_6838493.jpg';

    const MANAGE_EVENT_PAGE=1;
    const ALL_EVENTS_PAGE=2;
    const QR_CODE_COMPONENT=0;

    //BARCHART CONSTANTS
    const ALL_EVENTS_NUMBER_OF_PARTICIPANTS=0;
    //BARCHART CONSTANTS

    const createdEventsContext = useContext(AppStateContext);
    const backdropContext = useContext(BackdropContext);


    const titleStyle = {
        marginLeft:'40px', marginTop:'20px'
    };


    const printEvents = ()=>{
        const printedEvents = (props.whichPage===MANAGE_EVENT_PAGE) ? createdEventsContext.createdEvents : props.allEvents;
        if(printedEvents.length>0)
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
        else
            return (
                <Alert style={{marginLeft: '40px', marginRight: '40px', marginTop: '40px'}} variant="filled" severity="error">
                    <AlertTitle>Hata!</AlertTitle>
                    Henüz bir etkinlik bulunmamaktadır
                </Alert>);
    }
    const dateTimeParserFromString = (dateTime) =>new Date(dateTime);

    const setEventCard = (eventObject, index)=>{
        return(
            <div style={{ marginTop:'40px',marginRight:'40px', marginLeft:'40px'}} key={index}>
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
                            snackbarOpen={props.snackbarOpen}
                />
            );
        }
        else if(props.whichPage === ALL_EVENTS_PAGE){
            return (
                <EventCard  whichPage={props.whichPage}
                            eventObject={eventObject}
                            imageOfEvent={CARD_IMAGE_URL}
                            handleClickOpenAssignDialog={handleClickOpenAssignDialog}
                            snackbarOpen={props.snackbarOpen}

                />
            );
        }
    };

    // UPDATE EVENT FUNCTIONS start //
    //Click to update event
    const handleClickOpenUpdateDialog = (selectedUpdatedEvent) => {
        setOpenUpdateDialog(true);
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
        let headers = {
            'Authorization': `Bearer ${getJwsToken()}`
        };

        axios.put("/manageevent/updateevent", eventObject, {
            headers:headers
        })
            .then((response) => {
                if(response.data==='') props.snackbarOpen(eventObject.title+" başarıyla güncellendi!", "success");
                else props.snackbarOpen(response.data, "error");
                props.getAllEvents();
            }).catch(error => {
            if(error.response.status === 500 || error.response.status === 500)
                props.snackbarOpen(error.response.data.errors[0].defaultMessage, "error");

        });
        setUpdatedDialogElement(<div/>);
        setOpenUpdateDialog(false);

    }
    // UPDATE EVENT FUNCTIONS end //

    const onChangePageNumber = (event, value) => {
        setPage(value-1);
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



    const handleClickDeleteEventButton = (uniqueName)=>{
        let headers = {
            'Authorization': `Bearer ${getJwsToken()}`
        };
        axios.post("/manageevent/deleteevent/"+uniqueName,{},{
            headers:headers
        })
            .then((response) => {
                props.snackbarOpen(
                    response.data, response.data==="Geçersiz silme işlemi!"
                    ? "error"
                    :"success");
                props.getAllEvents();
            })
            .catch(error => {
                if (error.response.status === 400) {
                    props.snackbarOpen(error.response.data.errors[0].defaultMessage, "error");
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

    const handleSubmitAssignEvent = (participant, eventUniqueName, assignedEvent) => {
        setAssignEventDialogElement(<div/>);
        axios.post("/manageparticipant/assign/"+eventUniqueName.toString(),
            participant,{responseType: 'blob'})
            .then((response) => {
                setQrCodeDialogElement(
                    <QrCodeWebSocketDialog
                        open={true}
                        qrCodeImage={response.data}
                        handleClose={handleCloseQrCodeDialog}
                        title={assignedEvent.title}
                        dialogTitle={"Başvuru Bilgilerinizi İçeren QR Kod"}
                        whichDialogContent={QR_CODE_COMPONENT}
                    />);
                createdEventsContext.sendNotification(participant,assignedEvent);

            }).catch( error => {
                        if (error.response.status === 400) {
                            props.snackbarOpen(error.response.data.errors[0].defaultMessage, "error");
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
            errorMessage = JSON.parse(result);
            if(errorMessage.code === 500){
                props.snackbarOpen(errorMessage.message, "error");
            }
        });
    }
    const handleCloseAssignEventDialog = () => {
        setAssignEventDialogElement(<div/>);
        props.getAllEvents();
    }

    const handleCloseQrCodeDialog = (title) => {
        // qrCodeImage="";
        setQrCodeDialogElement(<></>);
        props.snackbarOpen(title+" etkinliğine başarılı bir şekilde kaydoldun", "success");
    };
    //**** ASSIGN EVENT FUNCTIONS END ****//



    const printBarChartsIfManagePage = ()=>{
        if(props.whichPage===MANAGE_EVENT_PAGE){

            return(
                <Grid container direction="column" spacing={3}>
                    <Grid item style={{marginLeft: '40px', marginRight: '40px', marginTop: '40px'}}>
                        <BarChart
                            title={"Katılımcı Sayısı"}
                            whichChart={ALL_EVENTS_NUMBER_OF_PARTICIPANTS}
                        />
                    </Grid>
                    <Grid item>
                        <Divider variant="middle"/>
                    </Grid>
                    <Grid item style={{marginLeft: '40px'}}>
                        <Typography style={{marginLeft: '40px',}} variant="h5" gutterBottom>
                            Senin Tarafından Yaratılan Etkinlikler
                        </Typography>
                    </Grid>
                </Grid>
            );
        }
    }


    return (
        <Grid container direction="column" alignItems="stretch" >
            {qrCodeDialogElement}
            <Typography style={titleStyle} variant="h3" gutterBottom>
                {props.pageTitle}
            </Typography>
            <Grid item>
                <Divider variant="middle"/>
            </Grid>
            {updatedDialogElement}
            {assignEventDialogElement}

            <Grid
                direction="column"
                container
            >
                {printBarChartsIfManagePage()}
                {printEvents()}
                <Grid item style={{paddingTop:'20px', paddingBottom:'40px'}}>
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="flex-start"
                    >
                        <Pagination count={calculateNumberOfPage()}
                                    onChange={onChangePageNumber}/>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}