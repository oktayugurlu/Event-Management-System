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
import EventQuestion from "./EventQuestion";
import BarChart from "./BarChart";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Alert from "@material-ui/lab/Alert";


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
}));

const SURVEY_RESULTS=2;

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
        this.extractQuestionObjectToQuestionElementFromEventDTO(this.props.event.surveyQuestionSet);

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


    extractQuestionObjectToQuestionElementFromEventDTO = (questionSet) =>{
        let createdQuestionElementObject={};
        let createdQuestionValueObject={};
        questionSet.forEach(
            (questionObject,index)=> {
                let elementFromEventDTO = this.createQuestionElementFromEventDTO(questionObject.content, index);
                createdQuestionElementObject['q_'+this.lastAddedSequenceQuestionId]=elementFromEventDTO;
                createdQuestionValueObject['q_'+this.lastAddedSequenceQuestionId] = questionObject.content;
            });
        this.setState({
            questionElementObject:createdQuestionElementObject,
            questionValueObject:createdQuestionValueObject
        });
    };
    createQuestionElementFromEventDTO = (questionValue, index)=>{
        let id = ++this.lastAddedSequenceQuestionId;
        return (
            <Grid key={'q_'+ id}
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="flex-end"
            >
                <EventQuestion onChange = {this.onChangeQuestion}
                               questionCounter={index+1}
                               updatedQuestion={questionValue}
                               name={'q_'+id}
                />
                <IconButton aria-label="delete" onClick = {()=>this.onClickDeleteQuestion('q_'+id)}>
                    <DeleteIcon style={{color:'red'}}/>
                </IconButton>
            </Grid>
        );
    }
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
            content: item
        };
    }


    renderUpdateEventElementsIfNowIsBeforeEndDate = (classes)=>{
        if(this.checkEndDateIsOutOfDate(new Date()))
            return (
                <>
                    <Grid container direction="column">
                        <Alert severity="info" >
                            Anket, bitiş tarihinden sonra güncellenemez!
                        </Alert>
                        <Card className={classes.root}
                              variant="outlined"
                              style={{backgroundColor:'#F1F3F4',marginTop:'10px'}}
                        >
                            <CardContent>
                                <Typography  variant="h5" component="h2" gutterBottom>
                                    Sorular
                                </Typography>
                                <Divider/>

                                {this.renderQuestionAsList()}

                            </CardContent>
                        </Card>
                    </Grid>
                    <Divider style={{marginTop:'20px'}}/>
                </>
            );
        else
            return (
                <>
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
                </>
            );
    }

    checkEndDateIsOutOfDate = (compareWith)=>{
        return this.props.event.endDateTime < compareWith;
    }

    renderQuestionAsList = () =>{
        return this.props.event.surveyQuestionSet.map(
            (question, index)=>{
                return (
                    <Typography  variant="body1" >
                        &#183;{"Soru "+(index+1)+". "+question.content}
                    </Typography>
                );
            }
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
                    <ValidatorForm
                        onSubmit={this.handleSubmit}
                    >
                        <DialogTitle id="scroll-dialog-title" >
                            {this.props.event.title + " - Anket Yönetimi"}
                        </DialogTitle>
                        <DialogContent dividers={true}>
                            {this.renderUpdateEventElementsIfNowIsBeforeEndDate(classes)}
                            <Grid item>
                                <Divider variant="middle"/>
                            </Grid>
                            <Grid container direction="column" spacing={2}>


                                <Grid item>
                                    <Typography variant="h5" gutterBottom>
                                        {"Sorulara verilen cevaplarin puan ortalamasi"}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Grid container
                                          direction={"row"}
                                          justify="space-between"
                                          alignItems="flex-start"
                                    >
                                        <Grid item md={8} sm={12}>
                                            <BarChart
                                                surveyEvent={this.props.event}
                                                whichChart={SURVEY_RESULTS}
                                                title={"Katılımcı Sayısı:"}
                                            />
                                        </Grid>
                                        <Grid item md={3} sm={12}>
                                            <Card className={classes.root}
                                                  variant="outlined"
                                                  style={{backgroundColor:'#F1F3F4'}}
                                            >
                                                <CardContent>
                                                    <Typography  variant="h5" component="h2" gutterBottom>
                                                        Puanların Karşılıkları
                                                    </Typography>

                                                    <Typography  variant="body2"  component="p">
                                                        &#183;0 Puan: Kesinlikle katılmıyorum
                                                    </Typography>

                                                    <Typography  variant="body2"  component="p">
                                                        &#183;1 Puan: Katılmıyorum
                                                    </Typography>

                                                    <Typography variant="body2"  component="p">
                                                        &#183;2 Puan: Kararsızım
                                                    </Typography>

                                                    <Typography  variant="body2"  component="p">
                                                        &#183;3 Puan: Katılıyorum
                                                    </Typography>

                                                    <Typography  variant="body2"  component="p">
                                                        &#183;4 Puan: Kesinlikle katılıyorum
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Grid>

                            </Grid>

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.props.handleClose} color="primary">
                                İptal
                            </Button>
                            <Button disabled={this.checkEndDateIsOutOfDate(new Date())} type="submit" color="primary">Gönder</Button>
                        </DialogActions>
                    </ValidatorForm>
                </Dialog>
            </div>
        );
    }
}


export default withStyles(useStyles)(CreateSurveyDialog)