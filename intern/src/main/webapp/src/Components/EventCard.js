import React, {Component, useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';

import Fab from '@material-ui/core/Fab';
import Grid from "@material-ui/core/Grid";

import AddIcon from '@material-ui/icons/Add';

// Accept Button
import {green} from '@material-ui/core/colors';
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import ParticipantsDetailDialog from "./manageeventpage/ParticipantsDetailDialog";
import {AppStateContext} from "./contexts/AppStateContext";
import AssessmentIcon from '@material-ui/icons/Assessment';
import SurveyDialog from "./manageeventpage/CreateSurveyDialog";
import {getJwsToken} from "./authentication/LocalStorageService";
import axios from "axios";
import FillSurveyDialog from "./appliedeventspage/FillSurveyDialog";
import Tooltip from "@material-ui/core/Tooltip";
import Box from "@material-ui/core/Box";
import CasinoIcon from '@material-ui/icons/Casino';
import ManageLotsDialog from "./manageeventpage/ManageLotsDialog";
import PlaceIcon from '@material-ui/icons/Place';
import MapDialog from "./appliedeventspage/MapDialog"
import AskQuestionDialog from "./appliedeventspage/AskQuestionDialog";
import AskQuestionButton from "./appliedeventspage/AskQuestionButton";

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: '1.25rem',
        color: '#122740',
    },
    pos: {
        marginBottom: 12,
    },
    media: {
        height: '20vh',
        borderRadius: 6
    },

    // Accept Button
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));

export default function EventCard(props) {
    const classes = useStyles();

    const createdEventsContext = useContext(AppStateContext);

    const MANAGE_EVENT_PAGE=1;
    const ALL_EVENTS_PAGE=2;
    const APPLIED_EVENTS_PAGE=3;



    // DIALOG ELEMENTS //
    const [participantsDetailDialogElement, setParticipantsDetailDialogElement] = React.useState(<></>);
    const [surveyDialogElement, setSurveyDialogElement] = React.useState(<></>);
    const [fillSurveyDialogElement, setFillSurveyDialogElement] = React.useState(<></>);
    const [manageLotsDialogElement, setManageLotsDialogElement] = React.useState(<></>);
    const [showMapDialogElement, setShowMapDialogElement] = React.useState(<></>);
    const [askQuestionDialogElement, setAskQuestionDialogElement] = React.useState(<></>);

    const selectCardActionButtons = ()=>{
        if(props.whichPage === MANAGE_EVENT_PAGE){
            return (
                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                >
                    <div className={classes.wrapper}
                    >
                        <Tooltip title={
                            checkStartDateIsNotUpToDate(new Date())
                                ? "Etkinlik bitiş tarihinden sonra güncellenemez!"
                                : "Etkinliği güncelle"
                            } aria-label="add">
                            <Box component="span" display="block">
                                <span>
                                    <Fab
                                        aria-label="edit"
                                        color="primary"
                                        disabled={checkStartDateIsNotUpToDate( new Date())}
                                        onClick={()=>props.handleClickOpenUpdateDialog(props.eventObject)}
                                    >
                                        <EditIcon />
                                    </Fab>
                                </span>
                            </Box>
                        </Tooltip>
                    </div>
                    <div className={classes.wrapper}>
                        <Tooltip title={
                            checkStartDateIsNotUpToDate(new Date())
                                ? "Etkinlik bitiş tarihinden sonra silinemez!"
                                : "Sil"} aria-label="add"
                        >
                            <Box component="span" display="block">
                                <span>
                                    <Fab
                                        aria-label="delete"
                                        color="secondary"
                                        onClick={()=>props.handleClickDeleteEventButton(props.eventObject.uniqueName)}
                                        disabled={checkStartDateIsNotUpToDate( new Date())}
                                    >
                                        <DeleteIcon/>
                                    </Fab>
                                </span>
                            </Box>
                        </Tooltip>
                    </div>
                    <div className={classes.wrapper}>
                        <Tooltip title={
                            checkEndDateIsOutOfDate(new Date())
                                ? "Anket, bitiş tarihinden sonra güncellenemez!"
                                : "Anketi yönet"} aria-label="add"
                        >
                            <Box component="span" display="block">
                                <span>
                                    <Fab
                                        aria-label="survey"
                                        color="inherit"
                                        style={{colorInherit:"#FF7F00"}}
                                        onClick={()=>handleClickOpenManageSurveyButton()}
                                        disabled={checkEndDateIsOutOfDate(new Date())}
                                    >
                                        <AssessmentIcon/>
                                    </Fab>
                                </span>
                            </Box>
                        </Tooltip>
                    </div>
                    <div className={classes.wrapper}>
                        <Tooltip title="Çekiliş" aria-label="add">
                            <Box component="span" display="block">
                                <span>
                                    <Fab
                                        aria-label="survey"
                                        color="inherit"
                                        style={{colorInherit:"#FF7F00"}}
                                        onClick={()=>handleClickOpenManageLotsButton()}
                                    >
                                        <CasinoIcon/>
                                    </Fab>
                                </span>
                            </Box>
                        </Tooltip>
                    </div>
                </Grid>
            );
        }
        else if(props.whichPage===ALL_EVENTS_PAGE){
            if(checkStartDateIsNotUpToDate( new Date()) && !createdEventsContext.isAuthorized){
                return ('');
            }
            else{
                return (
                    <Grid
                        container
                        direction="column"
                        justify="flex-start"
                        alignItems="center"
                    >
                        <div className={classes.wrapper}>
                            <Tooltip title="Katıl" aria-label="add">
                                <Box component="span" display="block">
                                    <span>
                                        <Fab
                                            aria-label="save"
                                            color="primary"
                                            onClick={()=>props.handleClickOpenAssignDialog(props.eventObject)}
                                        >
                                            <AddIcon />
                                        </Fab>
                                    </span>
                                </Box>
                            </Tooltip>
                        </div>
                    </Grid>
                );
            }
        }
        else if(props.whichPage===APPLIED_EVENTS_PAGE){
            return (
                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                >
                    <div className={classes.wrapper}>
                        <Tooltip title={returnTooltipAboutSurveyToParticipant()}
                                 aria-label="add">
                            <Box component="span" display="block">
                                    <span color="inherit">
                                        <Fab
                                            aria-label="survey"
                                            style={{colorInherit:"#FFFBD6"}}
                                            onClick={()=>handleClickOpenFillSurveyButton()}
                                            disabled={checkEndDateIsUpToDate(new Date()) || !isEventHasSurveyQuestion()}
                                        >
                                            <AssessmentIcon/>
                                        </Fab>
                                    </span>
                            </Box>
                        </Tooltip>
                    </div>
                    <div className={classes.wrapper}>
                        <Tooltip title={"Etkinliğin Konumu"} aria-label="add">
                            <Box component="span" display="block">
                                <span>
                                    <Fab
                                        aria-label="place"
                                        color="primary"
                                        onClick={()=>handleClickShowMapDialogButton()}
                                    >
                                        <PlaceIcon/>
                                    </Fab>
                                </span>
                            </Box>
                        </Tooltip>
                    </div>
                    <AskQuestionButton
                        checkEndDateIsUpToDate={checkEndDateIsUpToDate}
                        checkStartDateIsNotUpToDate={checkStartDateIsNotUpToDate}
                        handleClickOpenAskQuestionDialogButton={handleClickOpenAskQuestionDialogButton}
                        classes={classes}
                    />
                </Grid>
            );
        }
    }

    const returnTooltipAboutSurveyToParticipant = ()=>{
        if(checkEndDateIsUpToDate(new Date()))
            return "Anket etkinlik bitince aktif olacak";
        else {
            if(isEventHasSurveyQuestion())
                return "Anketi doldurun";
            else
                return "Mevcut bir anket bulunmamakta";
        };
    }
    const isEventHasSurveyQuestion = ()=>{
        return props.eventObject.surveyQuestionSet.length !== 0;
    }
    const renderCardActionAreaAndCardContent =()=>{
        if(props.whichPage === MANAGE_EVENT_PAGE){
            return (
                <CardActionArea disabled={props.whichPage!==MANAGE_EVENT_PAGE} onClick={handleOpenParticipantsDetailDialog}>
                    {justRenderCardContent()}
                </CardActionArea>
            );
        }
        else{
            return justRenderCardContent();
        }
    }

    const justRenderCardContent = ()=>{
        return (
            <CardContent>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                >
                    <Grid item md={3}>
                        <CardMedia
                            className={classes.media}
                            image={props.imageOfEvent!=null ? ( props.imageOfEvent) : '../../static/image/social.png'}
                            title={props.eventObject.title}
                        />
                    </Grid>
                    <Grid item md={1}/>
                    <Grid item md={8} >
                        <Grid
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="baseline"
                        >
                            <Typography className={classes.title}>
                                {props.eventObject.title}
                            </Typography>
                            <br/>

                            {renderEventDetailsIfInManagePage()}
                            <Typography style={{marginTop:'5px'}} variant="body2" component="p" >
                                <b>Adres: </b> {props.eventObject.address}
                            </Typography>
                            <Typography style={{marginTop:'5px'}}  variant="body2" component="p" >
                                <b>Başlangıç Tarihi: </b> {props.eventObject.startDateTime.toLocaleString('tr-TR').slice(0,16)}
                            </Typography>
                            <Typography style={{marginTop:'5px'}}  variant="body2" component="p" >
                                <b>Bitiş Tarihi: </b> {props.eventObject.endDateTime.toLocaleString('tr-TR').slice(0,16)}
                            </Typography>
                            <Typography style={{marginTop:'5px'}} variant="body2" component="p">
                                <b style={{float:'left'}}>{"Detaylar:"}</b>{'\u00A0'}
                                {props
                                    ?  props.eventObject.notes.length > 250
                                        ? props.eventObject.notes.substring(0, 250) + "..."
                                        : props.eventObject.notes
                                    : " " }

                                <br />
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item md={8} >

                    </Grid>
                </Grid>
            </CardContent>
        );
    }

    const checkStartDateIsNotUpToDate = (compareWith)=>{
        return props.eventObject.startDateTime <= compareWith;
    }
    const checkEndDateIsUpToDate = (compareWith)=>{
        return props.eventObject.endDateTime > compareWith;
    }
    const checkEndDateIsOutOfDate = (compareWith)=>{
        return props.eventObject.endDateTime < compareWith;
    }


    //********* ASK TO INSTRUCTOR DIALOG *************//
    const handleClickOpenAskQuestionDialogButton = ()=>{
        setAskQuestionDialogElement(
            <AskQuestionDialog
                openDialog={true}
                handleClose={handleCloseAskQuestionDialogButton}
                handleSubmit={handleSubmitAskQuestionDialogButton}
                event={props.eventObject}
                participant={props.participant}
            />
        );
    }
    const handleSubmitAskQuestionDialogButton= (askedQuestions)=>{
        axios.post("/manageparticipant/askquestion/"+props.eventObject.uniqueName, askedQuestions)
            .then((response) => {
                if(response.data===''){
                    props.snackbarOpen("Sorular "+props.eventObject.title+" için başarıyla iletildi!", "success");
                }
                else props.snackbarOpen(response.data, "error");
            }).catch(error => {
            if(error.response.status === 400 || error.response.status === 500)
                props.snackbarOpen(error.response.data.errors[0].defaultMessage, "error");
        });
        handleCloseAskQuestionDialogButton();
    }
    const handleCloseAskQuestionDialogButton= ()=>{
        setAskQuestionDialogElement(<></>);
    }




    //********* SHOW MAP DIALOG IN APPLIED EVENTS DIALOG *************//
    const handleClickShowMapDialogButton =()=>{
        setShowMapDialogElement(
            <MapDialog
                openDialog={true}
                handleClose={handleCloseShowMapDialogButton}
                assignedEvent={props.eventObject}
            />
        );
    }
    const handleCloseShowMapDialogButton = ()=>{
        setShowMapDialogElement(<></>);
    }

    //********* MANAGE LOTS DIALOG*************//
    const handleClickOpenManageLotsButton =()=>{
        setManageLotsDialogElement(
            <ManageLotsDialog
                openDialog={true}
                handleClose={handleCloseManageLotsButton}
                openedEvent={props.eventObject}
            />
        );
    }
    const handleCloseManageLotsButton = ()=>{
        setManageLotsDialogElement(<></>);
    }



    //********* FILL SURVEY DIALOG **********//
    const handleClickOpenFillSurveyButton = ()=>{
        setFillSurveyDialogElement(
            <FillSurveyDialog
                openDialog={true}
                handleClose={handleCloseFillSurveyButton}
                handleSubmit={handleSubmitFillSurveyButton}
                event={props.eventObject}
                participant={props.participant}
            />
        );
    }
    const handleCloseFillSurveyButton= ()=>{
        setFillSurveyDialogElement(<></>);
    }
    const handleSubmitFillSurveyButton= (surveyAnswers)=>{
        axios.post("/managesurvey/fillsurvey/"+props.eventObject.uniqueName, surveyAnswers)
            .then((response) => {
                if(response.data===''){
                    props.snackbarOpen("Anket başarı ile dolduruldu!", "success");
                }
                else props.snackbarOpen(response.data, "error");
                createdEventsContext.getAllEvents();
            }).catch(error => {
                if(error.response.status === 400)
                    props.snackbarOpen(error.response.data.errors[0].defaultMessage, "error");
                if(error.response.data.code===500){
                    props.snackbarOpen(error.response.data.message, "error");
                }
        });
        handleCloseFillSurveyButton();
    }


    //********* MANAGE SURVEY DIALOG **********//
    const handleClickOpenManageSurveyButton = ()=>{
        setSurveyDialogElement(
            <SurveyDialog
                openDialog={true}
                handleClose={handleCloseManageSurveyButton}
                handleSubmit={handleSubmitManageSurveyButton}
                event={props.eventObject}
            />
        );
    }
    const handleCloseManageSurveyButton= ()=>{
        setSurveyDialogElement(<></>);
    }
    const handleSubmitManageSurveyButton= (surveyQuestions)=>{
        let headers = {
            'Authorization': `Bearer ${getJwsToken()}`
        };
        axios.post("/managesurvey/createsurvey/"+props.eventObject.uniqueName, surveyQuestions, {
            headers:headers
        }).then((response) => {
            if(response.data==='') {
                props.snackbarOpen("Anket başarı ile güncellendi", "success");
                createdEventsContext.getAllEvents();
            }
            else props.snackbarOpen(response.data, "error");
        }).catch(error => {
            if(error.response.status === 500 || error.response.status === 400)
                props.snackbarOpen(error.response.data.errors[0].defaultMessage, "error");
        });
        handleCloseManageSurveyButton();
    }

    //********* PARTICIPANT DETAILS DIALOG **********//
    const handleCloseParticipantsDetailDialog = (title) => {
        setParticipantsDetailDialogElement(<></>);
    };
    const handleOpenParticipantsDetailDialog = () => {
        setParticipantsDetailDialogElement((
            <ParticipantsDetailDialog
                open={true}
                openedEvent={props.eventObject}
                handleClose={handleCloseParticipantsDetailDialog}
            />
        ));
    }

    const renderEventDetailsIfInManagePage = ()=>{
        if(props.whichPage === MANAGE_EVENT_PAGE)
        return (
            <>
                <Typography style={{marginTop:'5px'}}  variant="body2" component="p" >
                    <b>Etinlik ID: </b> {props.eventObject.uniqueName}
                </Typography>
                <Typography style={{marginTop:'5px'}}  variant="body2" component="p" >
                    <b>Kalan Kota: </b> {props.eventObject.quota}
                </Typography>
                <Typography style={{marginTop:'5px'}} variant="body2" component="p" >
                    <b>Katılımcı Sayısı: </b> {props.eventObject.appliedParticipantSet.length}
                </Typography>
            </>
        );
    }
    //********* PARTICIPANT DETAILS DIALOG**********//


    return (
        <Card className={classes.root} >
            {surveyDialogElement}
            {fillSurveyDialogElement}
            {participantsDetailDialogElement}
            {manageLotsDialogElement}
            {showMapDialogElement}
            {askQuestionDialogElement}
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
            >
                <Grid item md={10}>
                    {renderCardActionAreaAndCardContent()}
                </Grid>
                <Grid item md={2}>
                    <Grid container alignItems="center" justify="center">
                        <CardActions>
                            {selectCardActionButtons()}
                        </CardActions>
                    </Grid>
                </Grid>

            </Grid>
        </Card>
    );
}