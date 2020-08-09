import React, {Component} from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {DialogActions} from "@material-ui/core";
import Button from '@material-ui/core/Button';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import {GlobalStateContext} from "../contexts/GlobalStateContext";
import Alert from "@material-ui/lab/Alert";
import SurveyTableToFill from "./SurveyTableToFill";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
}));

const radioButtonValuesAsNumber = [ 'Katılmıyorum',
                                    'Kısmen Katılmıyorum',
                                    'Kararsızım',
                                    'Kısmen Katılıyorum',
                                    'Katılıyorum' ];

class FillSurveyDialog extends Component{

    static contextType = GlobalStateContext;
    participant={}

    constructor(props) {
        super(props);
        let answerEmpty = {};
        this.props.event.surveyQuestionSet.forEach(question=> {
            answerEmpty[question.content] = '';
        });
        this.state = {
            participant:{},
            questionAnswerMap: {...answerEmpty},
            questionAnswerElementArray:[],
            isParticipantAppliedThisEvent:false,
            isSubmitSSNClicked:false,
            ssn:'',
        }
    }

    renderDialogContent = ()=>{
        if(this.state.isSubmitSSNClicked){
            if(this.state.isParticipantAppliedThisEvent && this.isParticipantDontFillSurveyBefore())
                return (<SurveyTableToFill
                            surveyQuestions={this.props.event.surveyQuestionSet}
                            handleChangeRadioButtons={this.handleChangeRadioButtons}
                            renderRadioButtons={this.renderRadioButtons}
                        />);

            else
                return ( <Grid container>
                            <Grid item md={3}/>
                            <Grid item md={6}>
                                <TextField
                                    id="filled-error-helper-text"
                                    label="TC Kimlik Numarası"
                                    variant="filled"
                                    inputProps={{ maxLength: 11}}
                                    onChange={this.handleOnChangeSSNInput}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item md={3}/>
                        </Grid>);
        }
        else
            return(<Grid container>
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
                   </Grid>);
    }
    handleOnChangeSSNInput = (event)=>{
        this.setState({
            ssn:event.target.value
        });
    }
    renderErrorMessage = ()=>{
        if(this.state.isSubmitSSNClicked && !this.state.isParticipantAppliedThisEvent)
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
        console.log(this.state.isSubmitSSNClicked);
        console.log(this.state.isParticipantAppliedThisEvent);
        console.log(this.isParticipantDontFillSurveyBefore());
        if(this.state.isSubmitSSNClicked
            && this.state.isParticipantAppliedThisEvent
            && !this.isParticipantDontFillSurveyBefore()
        )
            return (
                <Grid container>
                    <Grid item md={3}/>
                    <Grid item md={6}>
                        <Alert style={{marginTop:'8px', marginBottom:'8px'}} severity="error">
                            Anketi doldurmuşsunuz!
                        </Alert>
                    </Grid>
                    <Grid item md={3}/>
                </Grid>);

    }

    isParticipantDontFillSurveyBefore() {
        return this.props.event.appliedParticipantSet.filter(application=>application.participant.ssn === this.participant.ssn)===[];
    }

    chooseSubmitFunction=()=>{
        if(this.state.isSubmitSSNClicked && this.state.isParticipantAppliedThisEvent && this.isParticipantDontFillSurveyBefore()){
            return this.handleSubmitSurvey;
        }
        else
            return this.handleClickSubmitSSN;
    }

    handleClickSubmitSSN = ()=>{
        let isParticipantApplied;
        this.props.event.appliedParticipantSet.forEach(
            application=>{
                if(application.participant.ssn===this.state.ssn){
                    isParticipantApplied=true;
                    this.participant = application.participant;
                }
            }
        );
        if(isParticipantApplied)
            this.setState({
                isParticipantAppliedThisEvent:true,
                isSubmitSSNClicked:true
            });
        else
            this.setState({
                isSubmitSSNClicked:true
            });
    }


    //******* Survey Table Functions ******//
    handleSubmitSurvey=()=>{
        console.log("submit: %O",this.state.questionAnswerMap);
        let surveyAnswerObjectList = Object.keys(this.state.questionAnswerMap).map(
            key=>{
                return this.createSurveyAnswerObject(this.state.questionAnswerMap[key], key);
            }
        );
        this.props.handleSubmit(surveyAnswerObjectList);
    }
    createSurveyAnswerObject = (answerPoint,key)=>{
        let surveyQuestionObject={};
        this.props.event.surveyQuestionSet.forEach(
            question=>{
                if(question.content===key)
                    surveyQuestionObject=question;
            }
        );
        return {
            point:answerPoint,
            participant:this.participant,
            surveyQuestion: {...surveyQuestionObject}
        };
    }
    handleChangeRadioButtons = (event) => {
        console.log(event.target.name);
        let copyQuestionAnswerMap = {...this.state.questionAnswerMap};
        let indexOfValue = radioButtonValuesAsNumber.indexOf(event.target.value);
        copyQuestionAnswerMap[event.target.name] = indexOfValue;
        this.setState({
            radioValue:event.target.value,
            questionAnswerMap: {...copyQuestionAnswerMap}
        });
    };

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
                        maxWidth={'lg'}>
                        <DialogTitle id="scroll-dialog-title">Kullanıcı Anketi</DialogTitle>
                        <DialogContent dividers>
                            <Grid
                                container
                                direction="column"
                            >
                                {this.renderDialogContent()}
                                {this.renderErrorMessage()}
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.props.handleClose} color="primary">
                                İptal
                            </Button>
                            <Button onClick={this.chooseSubmitFunction()} type="submit" color="primary">Gönder</Button>
                        </DialogActions>
                </Dialog>
            </div>
        );
    }
}


export default withStyles(useStyles)(FillSurveyDialog);