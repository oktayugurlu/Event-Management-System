import React, {Component} from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import {AppStateContext} from "../contexts/AppStateContext";
import ManageLotsTable from "./ManageLotsTable";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Divider from "@material-ui/core/Divider";
import CasinoIcon from '@material-ui/icons/Casino';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";
import SendIcon from '@material-ui/icons/Send';
import axios from "axios";
import {getJwsToken} from "../authentication/LocalStorageService";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
}));


class ManageLotsDialog extends Component{

    static contextType = AppStateContext;
    participant={}

    constructor(props){
        super(props);
        this.state = {
            luckyParticipantString:'',
            luckyParticipantObject:{},
            giftMessage:'',
            giftSentSuccessfully:false,
            isSubmitClicked:false,
            alertMessage:'',
            isLoading:false,
            openedEvent: {...this.props.openedEvent}
        }
    }

    renderDrawingLotsComponent = ()=>{
        return (
            <Grid container
                  direction="column"
                  justify="center"
                  spacing={4}
            >
                {this.renderIfThereIsParticipant()}
            </Grid>

        );
    }


    renderIfThereIsParticipant = ()=>{

        if(this.state.openedEvent.appliedParticipantSet.length>0)
            return (
                <>
                    <Grid container
                          direction="row"
                          justify="center"
                          alignItems="center"
                          spacing={4}
                          style={{marginTop:'20px'}}
                    >
                        <Grid item md={9}>
                            <TextField
                                id="outlined-read-only-input"
                                variant="outlined"
                                label="Kazanan"
                                value={this.state.luckyParticipantString}
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth={true}
                                error={this.isValueEmpty(this.state.luckyParticipantString)}
                                helperText={this.handleEmptyCheck(this.state.luckyParticipantString)}
                            />
                        </Grid>
                        <Grid item md={3}>
                            <Button
                                style={{
                                    marginTop:'22px',
                                    marginBottom:'22px'
                                }}
                                variant="contained"
                                color="primary"
                                onClick={this.drawingLots}
                                startIcon={<CasinoIcon/>}
                                fullWidth={true}
                            >
                                Kura Çek
                            </Button>
                        </Grid>
                    </Grid>
                    {this.componentsToSendGiftToLuckyParticipant()}
                </>
            );
        else{
            return (<Alert severity="info">Şuanda katılımcı bulunmamakta!</Alert>);
        }
    }

    componentsToSendGiftToLuckyParticipant =() =>{
        return (
            <>
                <Grid container
                      direction="row"
                      justify="center"
                      alignItems="center"
                      spacing={4}
                >
                    <Grid item md={9}>
                        <TextField
                            id="outlined-read-only-input"
                            variant="outlined"
                            label="Kazanılan Hediye"
                            value={this.state.giftMessage}
                            error={this.isValueEmpty(this.state.giftMessage)}
                            helperText={this.handleEmptyCheck(this.state.giftMessage)}
                            fullWidth={true}
                            onChange={this.handleGiftMessage}
                            inputProps={{ maxLength: 25}}
                        />
                    </Grid>
                    <Grid item md={3}>
                        <Button
                            style={{
                                marginTop:'22px',
                                marginBottom:'22px'
                            }}
                            variant="contained"
                            color="primary"
                            onClick={this.submitLots}
                            startIcon={<SendIcon/>}
                            fullWidth={true}
                        >
                            Hediyeyi Gönder
                        </Button>
                    </Grid>
                </Grid>
            </>

        );
    };

    drawingLots = ()=>{
        let numberOfParticipants = this.state.openedEvent.appliedParticipantSet.length;
        let luckyParticipantIndex = this.getRandomInt(0,numberOfParticipants-1);

        let luckApplicationObject = this.state.openedEvent.appliedParticipantSet[luckyParticipantIndex];
        let luckyParticipantString = luckApplicationObject.participant.ssn
                                    +' / '+luckApplicationObject.participant.name
                                    +' '+luckApplicationObject.participant.surname;
        this.setState({
            luckyParticipantString: luckyParticipantString,
            luckyParticipantObject: {...luckApplicationObject.participant},
            giftSentSuccessfully:false,
        });
    }
    getRandomInt = (min, max)=> {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }



    //*** handle inputs ***//
    handleGiftMessage = (event) => {
        this.setState({
            giftMessage:event.target.value
        });
    }


    //*** Functions after submit lots result ***//
    submitLots = ()=>{
        if(!this.isValueEmpty(this.state.giftMessage) && !this.isValueEmpty(this.state.giftMessage)){

            let lotsDTO = this.createLotsDTO();
            let headers = {
                'Authorization': `Bearer ${getJwsToken()}`
            };
            this.setState({
                isLoading:true
            }, ()=>{
                    axios.post("/manageparticipant/drawinglots/"+this.state.openedEvent.uniqueName, lotsDTO, {
                        headers:headers
                    }).then((response) => {
                        let copyOpenedEvent = {...this.state.openedEvent};
                        copyOpenedEvent.lotsSet.push(response.data);
                        this.setState({
                            giftSentSuccessfully:true,
                            isSubmitClicked:true,
                            openedEvent: copyOpenedEvent,
                            isLoading:false
                        });
                    }).catch(error => {});
            });

        }
    }
    createLotsDTO = ()=>{

        return {
            giftMessage: this.state.giftMessage,
            participant: {...this.state.luckyParticipantObject},
        };
    }

    //**** FOR VALIDATION ****//
    handleEmptyCheck = (value) => {
        if(this.isValueEmpty(value)) return "Bu alan gerekli!";
    }
    isValueEmpty = (value) => {
        if (value === '') return true;
    }
    alertForLotsSentSuccesfully = ()=>{
        if(this.state.giftSentSuccessfully && this.state.isSubmitClicked)
            return(
                <Alert severity="success" style={{marginTop:'20px',marginBottom:'20px'}}>
                    {'Hediye '+this.state.luckyParticipantString+' kullanıcısına mail ile bildirildi!'}
                </Alert>
            );
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root} id='updateDialog'>
                <Dialog scroll={'paper'}
                        aria-labelledby="scroll-dialog-title"
                        aria-describedby="scroll-dialog-description"
                        open={this.props.openDialog}
                        onClose={this.props.handleClose}
                        fullWidth={true}
                        maxWidth={'md'}>
                    <DialogTitle id="scroll-dialog-title">
                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="flex-start"
                        >
                            <Grid item>
                                {this.state.openedEvent.title+" - Çekiliş Yönetimi"}
                            </Grid>
                            <Grid item>
                                <IconButton onClick={()=>this.props.handleClose(this.props.title)}>
                                    <CloseIcon/>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid
                            container
                            direction="column"
                            spacing={2}
                        >
                            <Grid item>
                                {this.renderDrawingLotsComponent()}
                            </Grid>
                            <Grid item>
                                <Divider/>
                            </Grid>
                            <Grid item>
                                {this.state.isLoading
                                    ?(<Grid container
                                            direction={"column"}
                                            justify="center"
                                            alignItems="center"
                                    >
                                        <Grid item>
                                            <CircularProgress/>
                                        </Grid>
                                    </Grid>)
                                    :(  <>
                                            {this.alertForLotsSentSuccesfully()}
                                            <ManageLotsTable
                                                event={this.state.openedEvent}
                                            />
                                        </>
                                     )
                                }
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}


export default withStyles(useStyles)(ManageLotsDialog);