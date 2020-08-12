import React, {Component} from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {DialogActions} from "@material-ui/core";
import Button from '@material-ui/core/Button';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import {AppStateContext} from "../contexts/AppStateContext";
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

    static contextType = AppStateContext;
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

    //******* Survey Table Functions ******//
    handleSubmitSurvey=()=>{
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
            participant:this.props.participant,
            surveyQuestion: {...surveyQuestionObject}
        };
    }
    handleChangeRadioButtons = (event) => {
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
                                <SurveyTableToFill
                                    surveyQuestions={this.props.event.surveyQuestionSet}
                                    handleChangeRadioButtons={this.handleChangeRadioButtons}
                                    renderRadioButtons={this.renderRadioButtons}
                                />
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.props.handleClose} color="primary">
                                İptal
                            </Button>
                            <Button onClick={this.handleSubmitSurvey} type="submit" color="primary">Gönder</Button>
                        </DialogActions>
                </Dialog>
            </div>
        );
    }
}


export default withStyles(useStyles)(FillSurveyDialog);