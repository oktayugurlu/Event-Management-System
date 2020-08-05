import React, {useContext} from 'react';
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
import ParticipantsDetailDialog from "./ParticipantsDetailDialog";
import {GlobalStateContext} from "./contexts/GlobalStateContext";
import AssessmentIcon from '@material-ui/icons/Assessment';
import SurveyDialog from "./SurveyDialog";
import {getJwsToken} from "./authentication/LocalStorageService";
import axios from "axios";
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
    const timer = React.useRef();

    const createdEventsContext = useContext(GlobalStateContext);

    const MANAGE_EVENT_PAGE=1;
    const ALL_EVENTS_PAGE=2;

    const [participantsDetailDialogElement, setParticipantsDetailDialogElement] = React.useState(<></>);
    const [surveyDialogElement, setSurveyDialogElement] = React.useState(<></>);


    React.useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

    const checkIsUpToDate = ()=>{
        return props.eventObject.endDateTime <= new Date();
    }

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
                        <Fab
                            aria-label="edit"
                            color="primary"
                            disabled={checkIsUpToDate()}
                            onClick={()=>props.handleClickOpenUpdateDialog(props.eventObject)}
                        >
                            <EditIcon />
                        </Fab>
                    </div>
                    <div className={classes.wrapper}>
                        <Fab
                            aria-label="delete"
                            color="secondary"
                            onClick={()=>props.handleClickDeleteEventButton(props.eventObject.uniqueName)}
                            disabled={checkIsUpToDate()}
                        >
                            <DeleteIcon/>
                        </Fab>
                    </div>
                    <div className={classes.wrapper}>
                        <Fab
                            aria-label="survey"
                            color="inherit"
                            style={{colorInherit:"#FF7F00"}}
                            onClick={()=>handleClickOpenSurveyButton()}
                            disabled={checkIsUpToDate()}
                        >
                            <AssessmentIcon/>
                        </Fab>
                    </div>
                </Grid>
            );
        }
        else if(props.whichPage===ALL_EVENTS_PAGE){
            if(checkIsUpToDate() && !createdEventsContext.isAuthorized){
                return ('');
            }
            else{
                return (
                    <div className={classes.wrapper}>
                        <Fab
                            aria-label="save"
                            color="primary"
                            onClick={()=>props.handleClickOpenAssignDialog(props.eventObject)}
                            disabled={checkIsUpToDate()}
                        >
                            <AddIcon />
                        </Fab>
                    </div>
                );
            }
        }
    }
    const handleClickOpenSurveyButton = ()=>{
        setSurveyDialogElement(
            <SurveyDialog
                openDialog={true}
                handleClose={handleCloseSurveyButton}
                handleSubmit={handleSubmitSurveyButton}
                event={props.eventObject}
            />
        );
    }
    const handleCloseSurveyButton= ()=>{
        setSurveyDialogElement(<></>);
    }
    const handleSubmitSurveyButton= (surveyQuestions)=>{
        console.log("surveyQuestions: %O", surveyQuestions);
        let headers = {
            'Authorization': `Bearer ${getJwsToken()}`
        };
        axios.post("/managesurvey/createsurvey/"+props.eventObject.uniqueName, surveyQuestions, {
            headers:headers
        })
            .then((response) => {
                if(response.data==='') props.snackbarOpen("Anket başarı ile güncellendi", "success");
                else props.snackbarOpen(response.data, "error");
            }).catch(error => {
                console.log(error);
            if(error.response.status === 500 || error.response.status === 400)
                props.snackbarOpen(error.response.data.errors[0].defaultMessage, "error");
            console.log(error.response);
        });
        handleCloseSurveyButton();
    }

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

    return (
        <Card className={classes.root} >
            {surveyDialogElement}
            {participantsDetailDialogElement}
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
            >
                <Grid item md={10}>
                    <CardActionArea disabled={props.whichPage===ALL_EVENTS_PAGE} onClick={handleOpenParticipantsDetailDialog}>
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
                                        {(props.whichPage === MANAGE_EVENT_PAGE)
                                            ?   (<>
                                                    <Typography variant="body2" component="p" >
                                                        <b>Etinlik ID: </b> {props.eventObject.uniqueName}
                                                    </Typography>
                                                    <Typography variant="body2" component="p" >
                                                        <b>Kalan Kota: </b> {props.eventObject.quota}
                                                    </Typography>
                                                    <Typography variant="body2" component="p" >
                                                        <b>Katılımcı Sayısı: </b> {props.eventObject.appliedParticipantSet.length}
                                                    </Typography>
                                                </>
                                            )
                                            :''
                                        }
                                        <Typography variant="body2" component="p" >
                                            <b>Başlangıç Tarihi: </b> {props.eventObject.startDateTime.toString().slice(0,21)}
                                        </Typography>
                                        <Typography variant="body2" component="p" >
                                            <b>Bitiş Tarihi: </b> {props.eventObject.endDateTime.toString().slice(0,21)}
                                        </Typography>
                                        <br/>
                                        <Typography variant="body2" component="p">
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

                            <Typography className={classes.pos} color="textSecondary">
                            </Typography>

                        </CardContent>
                    </CardActionArea>
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