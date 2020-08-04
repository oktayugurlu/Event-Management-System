import React, {Component} from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Alert from "@material-ui/lab/Alert";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {DialogActions} from "@material-ui/core";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import EventQuestion from "./EventQuestion";


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
}));

class SurveyDialog extends Component{


    constructor(props) {
        super(props);
        this.state = {
            questionCounter:0,
            questionElementList:[],
            questionValueList:[]
        }
    }

    componentDidMount() {
        if (this.props.event.surveyQuestionSet.length>0){
            this.setState( {
                questionCounter:this.props.event.surveyQuestionSet.length,
                questionElementList:(this.props.event.surveyQuestionSet).map((questionObject,index)=>this.createQuestionElementFromEventDTO(questionObject.content,index)),
                questionValueList:this.extractQuestionObjectToQuestionValueFromEventDTO(this.props.event.surveyQuestionSet),
            });
        }
        ValidatorForm.addValidationRule('isContentUnique', (value) => {
            let isThereSameContent =  this.state.questionValueList.map(questionValue=>questionValue===value);
            let counts = 0;
            isThereSameContent.forEach(function(isTrue) { if(isTrue) counts += 1;});
            return !(counts>1);
        });
    };

    componentWillUnmount() {
        ValidatorForm.removeValidationRule('isContentUnique');
    };

    createQuestionElementFromEventDTO = (questionValue, index)=>{
        return (
            <EventQuestion onChange = {this.onChangeQuestion}
                           key={index}
                           questionCounter={index+1}
                           updatedQuestion={questionValue}
                           name={index}
            />
        );
    }

    extractQuestionObjectToQuestionValueFromEventDTO = (questionSet) =>{
        return questionSet.map((questionObject)=> questionObject.content);
    };

    onClickDeleteQuestion = (index)=>{
        let questionValueListToDeleteValue = [...this.state.questionValueList];
        questionValueListToDeleteValue.splice(index,1);
        let refreshedQuestionElementList = questionValueListToDeleteValue.map((value, index)=>{
            return this.createQuestionElementFromEventDTO(value, index);
        });
        this.setState({
            questionCounter: this.state.questionCounter-1,
            questionValueList: questionValueListToDeleteValue,
            questionElementList: refreshedQuestionElementList
        });
    }

    handleAddQuestionButton = () => {
        const documents = this.state.questionElementList.concat(
            this.createEmptyQuestionElement()
        );
        let expandedQuestionValueList = [...this.state.questionValueList];
        expandedQuestionValueList[this.state.questionCounter] = '';
        this.setState({
            questionValueList: expandedQuestionValueList,
            questionElementList: documents,
            questionCounter: this.state.questionCounter+1
        });
    };

    createEmptyQuestionElement = () =>{
        return (
            <EventQuestion onChange = {this.onChangeQuestion}
                           key={(this.state.questionCounter+1)}
                           questionCounter={this.state.questionCounter+1}
                           name={this.state.questionCounter}
                           updatedQuestion={''}
            />
        );
    };

    onChangeQuestion = (event) => {
        let questionValueListCopy = [...this.state.questionValueList];
        questionValueListCopy[event.target.name] = event.target.value;
        console.log( questionValueListCopy);
        this.setState({
            questionValueList:questionValueListCopy
        });
    };

    handleSubmit = () =>{
        console.log(this.props.event);
        let questionSet = this.state.questionValueList.map((item)=>{
            this.createQuestionObject(item,[]);
        });
        this.props.handleSubmit(questionSet);
    };
    createQuestionObject = (item, surveyAnswerSet) =>{
        return {
            content: item,
            surveyAnswerSet: surveyAnswerSet
        };
    }

    extractQuestionElements = (questionElementList) => {
        return questionElementList.map((value, i) => {
            return (
                <Grid key={i}
                      container
                      direction="row"
                      justify="space-between"
                      alignItems="flex-end">
                    {value}
                    <IconButton aria-label="delete" onClick = {() =>{this.onClickDeleteQuestion(i)}}>
                        <DeleteIcon style={{color:'red'}}/>
                    </IconButton>
                </Grid>
            );
        })
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
                    <ValidatorForm
                        onSubmit={this.handleSubmit}
                    >
                        <DialogTitle id="scroll-dialog-title">Add Event</DialogTitle>
                        <DialogContent>
                            {this.extractQuestionElements(this.state.questionElementList)}

                            <Grid container direction="row"
                                  justify="center"
                                  alignItems="center">
                                <Button
                                    style={{
                                        marginTop:'22px'
                                    }}
                                    variant="contained"
                                    color="default"
                                    className={classes.button}
                                    onClick={this.handleAddQuestionButton}
                                    startIcon={<AddIcon />}
                                >
                                    Soru Ekle
                                </Button>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.props.handleClose} color="primary">
                                İptal
                            </Button>
                            <Button type="submit" color="primary">Gönder</Button>
                        </DialogActions>
                    </ValidatorForm>
                </Dialog>
            </div>
        );
    }
}


export default withStyles(useStyles)(SurveyDialog)