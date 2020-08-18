import React, {Component} from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import { ValidatorForm} from 'react-material-ui-form-validator';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {DialogActions} from "@material-ui/core";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import EventQuestion from "../manageeventpage/EventQuestion";


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
}));


class CreateSurveyDialog extends Component{

    lastAddedSequenceQuestionId=0;

    constructor(props) {
        super(props);
        this.state = {
            questionCounter:0,
            questionElementObject:{},
            questionValueObject: {}
        }
    }

    componentDidMount() {
        ValidatorForm.addValidationRule('isContentUnique', (value) => {
            let questionValueObjectRef = this.state.questionValueObject
            let isThereSameContent = Object.keys(questionValueObjectRef).map(function(key) {
                return questionValueObjectRef[key]===value;
            });
            let counts = 0;
            isThereSameContent.forEach(function(isTrue) { if(isTrue) counts += 1;});
            return !(counts>1);
        });
    };

    onClickDeleteQuestion = (deletedId)=>{
        let questionElementObjectToDeleteElement = {...this.state.questionElementObject};
        let questionValueObjectToDeleteValue = {...this.state.questionValueObject};
        delete questionElementObjectToDeleteElement[deletedId];
        delete questionValueObjectToDeleteValue[deletedId];

        this.setState({
            questionCounter: this.state.questionCounter-1,
            questionValueObject: {...questionValueObjectToDeleteValue},
            questionElementObject: {...questionElementObjectToDeleteElement}
        });
    }
    handleAddQuestionButton = () => {
        let documents = {...this.state.questionElementObject};
        let createdElement = this.createEmptyQuestionElement();
        documents['q_'+ this.lastAddedSequenceQuestionId] = createdElement;

        let expandedQuestionValueList = {...this.state.questionValueObject};
        expandedQuestionValueList['q_'+ (this.lastAddedSequenceQuestionId)] = '';

        this.setState({
            questionValueObject: expandedQuestionValueList,
            questionElementObject: documents,
            questionCounter: this.state.questionCounter+1
        });
    };

    createEmptyQuestionElement = () =>{
        let id = ++this.lastAddedSequenceQuestionId;
        return (
            <Grid key={'q_'+ id}
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="flex-end"
            >
                <EventQuestion onChange = {this.onChangeQuestion}
                               questionCounter={this.state.questionCounter+1}
                               name={'q_'+id}
                               updatedQuestion={''}
                />
                <IconButton aria-label="delete" onClick = {()=>this.onClickDeleteQuestion('q_'+id)}>
                    <DeleteIcon style={{color:'red'}}/>
                </IconButton>
            </Grid>
        );
    };

    onChangeQuestion = (event) => {
        let questionValueObjectCopy = {...this.state.questionValueObject};
        let changedId = event.target.name;
        questionValueObjectCopy[changedId] = event.target.value;
        this.setState({
            questionValueObject:questionValueObjectCopy
        });
    };

    exportQuestionElementFromJSONAsArray=()=>{
        let refQuestionElementObject = this.state.questionElementObject;
        return Object.keys(refQuestionElementObject).map(function(key) {
            return refQuestionElementObject[key];
        });
    }

    handleSubmit = () =>{
        let questionSet = Object.keys(this.state.questionValueObject).map((key)=>{
            return this.createQuestionObject(this.state.questionValueObject[key]);
        });

        this.props.handleSubmit(questionSet);
    };


    createQuestionObject = (item) =>{
        return {
            content: item,
            participant: this.props.participant
        };
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
                        <DialogTitle id="scroll-dialog-title" >
                            {this.props.event.title + " için Soru Sor"}
                        </DialogTitle>
                        <DialogContent dividers={true}>
                            <Grid container direction="column" spacing={2}>
                                {this.exportQuestionElementFromJSONAsArray( )}
                                <Grid container direction="row"
                                      justify="center"
                                      alignItems="center">
                                    <Button
                                        style={{
                                            marginTop:'22px',
                                            marginBottom:'22px'
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


export default withStyles(useStyles)(CreateSurveyDialog)