import React, {Component} from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import MuiAlert from '@material-ui/lab/Alert';
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
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider, DateTimePicker,
} from '@material-ui/pickers';

import Map from './Map';
import EventQuestion from "./EventQuestion";


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
}));

class AddEventDialog extends Component{


    constructor(props) {
        super(props);
        this.state = {
            uniqueName:'',
            address: '',
            title:'',
            notes:'',
            selectedStartDateTime:new Date(),
            selectedEndDateTime:new Date(),
            questionCounter:0,
            questionElementList:[],
            questionValueList:[],
            quota: 1,
            marker:{
                lat: 300,
                lng: 300
            }
        }
    }

    componentDidMount() {
        ValidatorForm.addValidationRule('isTitleUnique', (value) => {
            let isThereSameUniqueNameArray =  this.props.allEvents.map((event)=> event.uniqueName===value );
            return !isThereSameUniqueNameArray.includes(true);
        });
        if (this.props.isEventUpdated){
            this.setState( {
                uniqueName:this.props.updatedEvent.uniqueName,
                address: this.props.updatedEvent.address,
                title:this.props.updatedEvent.title,
                notes:this.props.updatedEvent.notes,
                selectedStartDateTime:this.props.updatedEvent.startDateTime,
                selectedEndDateTime:this.props.updatedEvent.endDateTime,
                questionCounter:this.props.updatedEvent.questionSet.length,
                questionElementList:(this.props.updatedEvent.questionSet).map((questionObject,index)=>this.createQuestionElementFromEventDTO(questionObject,index)),
                questionValueList:this.extractQuestionObjectToQuestionValueFromEventDTO(this.props.updatedEvent.questionSet),
                quota: this.props.updatedEvent.quota,
                marker:{
                    lat: this.props.updatedEvent.latitude,
                    lng: this.props.updatedEvent.longitude
                }
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
        console.log("component siliniyor./././//./././././/.//./")
        ValidatorForm.removeValidationRule('isTitleUnique');
        ValidatorForm.removeValidationRule('isContentUnique');
    };



    createQuestionElementFromEventDTO = (questionValue, index)=>{
        return (
            <EventQuestion onChange = {this.onChangeQuestion}
                           key={index}
                           questionCounter={index+1}
                           updatedQuestion={questionValue.content}
                           name={index}
                           disabled={this.props.isEventUpdated}
            />
        );
    }

    extractQuestionObjectToQuestionValueFromEventDTO = (questionSet) =>{
        return questionSet.map((questionObject)=> questionObject.content);
    };


    onClickDeleteQuestion = (index)=>{
        let questionElementListToDeleteElement = [...this.state.questionElementList];
        let questionValueListToDeleteValue = [...this.state.questionValueList];
        console.log('null check-----> %O',questionValueListToDeleteValue);
        questionElementListToDeleteElement.splice(index,index+1);
        questionValueListToDeleteValue.splice(index,index+1);
        console.log('null check-----> %O',questionValueListToDeleteValue);
        this.setState({
            questionCounter: this.state.questionCounter-1,
            questionValueList: questionValueListToDeleteValue,
            questionElementList: questionElementListToDeleteElement
        });
        console.log('id:'+' ' +index+'- counter:'+this.state.questionCounter);
    }

    handleAddQuestionButton = () => {
        const documents = this.state.questionElementList.concat(
            this.createEmptyQuestionElement()
        );
        let expandedQuestionValueList = [...this.state.questionValueList];
        expandedQuestionValueList[this.state.questionCounter] = '';
        console.log("expandedQuestionValueList: %O",expandedQuestionValueList);
        console.log("this.state.questionCounter: %O",this.state.questionCounter);
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
        console.log( event.target.name+ '---'+event.target.value);
        let questionValueListCopy = [...this.state.questionValueList];
        questionValueListCopy[event.target.name] = event.target.value;
        console.log( questionValueListCopy);
        this.setState({
            questionValueList:questionValueListCopy
        });
    };

    handleChangeQuota = (event) => {
        const quota = event.target.value;
        this.setState({
            quota:quota
        });
    };

    handleSubmit = () =>{
        if(this.state.selectedEndDateTime>this.state.selectedStartDateTime && this.isMarkSelectFromMap()) { // Everything is ok, the form can be submitted.
            let updatedObject = {
                uniqueName: this.state.uniqueName,
                title: this.state.title,
                longitude: this.state.marker.lng,
                latitude: this.state.marker.lat,
                startDateTime: this.state.selectedStartDateTime,
                endDateTime: this.state.selectedEndDateTime,
                quota: this.state.quota,
                notes: this.state.notes,
                address: this.state.address,
                appliedParticipantSet: [],
                questionSet: this.state.questionValueList.map((item)=>this.createQuestionObject(item))
            };
            this.clearStateVariable();
            this.props.handleSubmit(updatedObject);
        }
    };

    clearStateVariable = ()=>{
        this.setState({
                uniqueName:'',
                address: '',
                title: '',
                notes: '',
                selectedStartDateTime: new Date(),
                selectedEndDateTime: new Date(),
                questionCounter: 0,
                questionElementList: [],
                questionValueList: [],
                quota: 1,
                marker: {
                    lat: 300,
                    lng: 300
                },
                updatedEvent:{}
            }
        );
    }

    isMarkSelectFromMap=()=> !(this.state.marker.lng === 300);

    createQuestionObject = (item) =>{
        return {
            content: item
        };
    }

    extractQuestionElements = () => {
            return this.state.questionElementList.map((value, i) => {
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

    isStartDateAndEndDateValid = (selectedStartDateTime, selectedEndDateTime) =>{
        let currentDate = new Date();

        if(selectedEndDateTime <= selectedStartDateTime)
            return this.createAlertForValidation("Start date can't be bigger than or equal to end time!");
        else if(currentDate > selectedStartDateTime )
            return this.createAlertForValidation("Start date should be bigger than now!");
        else if(currentDate > selectedEndDateTime)
            return this.createAlertForValidation("End date should be bigger than now!");
    }

    isLocationSelect = ()=>{
        if(this.state.marker.lng === 300)
            return this.createAlertForValidation("Please pick a location from map!");
    }


    createAlertForValidation = (message)=>{
        return (<Alert style={{marginTop:'8px', marginBottom:'8px'}} severity="error">{message}</Alert>);
    }



    /*
     *
     *
     * FOR FORM VALIDATION start
     *
     *
     */
    handleChangeUniqueNameInput = (event) => {
        const uniqueName = event.target.value;
        this.setState({
            uniqueName: uniqueName
        });
    }
    handleChangeAddressInput = (event) => {
        const address = event.target.value;
        this.setState({
            address: address
        });
    }
    handleChangeNotesInput = (event) => {
        const notes = event.target.value;
        this.setState({
            notes: notes
        });
    }
    handleChangeTitleInput = (event) => {
        const title = event.target.value;
        this.setState({
            title: title
        });
    }
    onChangeMarkerInput = (location ) => {
        console.log( location );
        this.setState({
            marker: location
        })
    };
    handleStartDateChangeInput = (date) => {
        this.setState({
            selectedStartDateTime: date
        });
    };
    handleEndDateChangeInput = (date) => {
        this.setState({
            selectedEndDateTime: date
        })
    };

    /*
     *
     *
     * FOR FORM VALIDATION end
     *
     *
     */

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root} id='updateDialog'>
                {/* ADD EVENT MODAL START*/}

                <Dialog scroll={'paper'}
                        aria-labelledby="scroll-dialog-title"
                        aria-describedby="scroll-dialog-description"
                        open={this.props.openAddEventDialog}
                        onClose={this.props.handleClose}
                        fullWidth={true}
                        maxWidth={'md'}>
                    <ValidatorForm
                        onSubmit={this.handleSubmit}
                        // onError={errors => console.log(errors)}
                    >
                        <DialogTitle id="scroll-dialog-title">Add Event</DialogTitle>
                        <DialogContent>
                            <TextValidator
                                label="Event ID"
                                onChange={this.handleChangeUniqueNameInput}
                                name="id"
                                inputProps={{ maxLength: 50 }}
                                value={this.state.uniqueName}
                                validators={!this.props.isEventUpdated ? ['required','isTitleUnique' ]:['required']}
                                errorMessages={!this.props.isEventUpdated ?['This field is required','There is an entity with this ID! Please pick another one.']:['This field is required']}
                                fullWidth
                                disabled={this.props.isEventUpdated}
                            />
                            <TextValidator
                                label="Event Name"
                                onChange={this.handleChangeTitleInput}
                                name="title"
                                value={this.state.title}
                                inputProps={{ maxLength: 50 }}
                                validators={['required']}
                                errorMessages={['This field is required']}
                                fullWidth
                            />
                            <TextValidator
                                label="Address"
                                onChange={this.handleChangeAddressInput}
                                name="address"
                                multiline
                                rows={4}
                                inputProps={{ maxLength: 255 }}
                                value={this.state.address}
                                validators={['required']}
                                errorMessages={['This field is required']}
                                fullWidth
                            />
                            <TextValidator
                                label="Description"
                                onChange={this.handleChangeNotesInput}
                                name="notes"
                                multiline
                                rows={4}
                                inputProps={{ maxLength: 255 }}
                                value={this.state.notes}
                                validators={['required']}
                                errorMessages={['This field is required']}
                                fullWidth
                            />
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid container justify="space-between">
                                    <DateTimePicker
                                        id="datetime-local"
                                        label="Start Date"
                                        margin="normal"
                                        ampm={false}
                                        value={this.state.selectedStartDateTime}
                                        onChange={this.handleStartDateChangeInput} />
                                </Grid>
                                <br/>
                                <Grid container justify="space-between">
                                    <DateTimePicker
                                        id="datetime-local"
                                        label="End Date"
                                        margin="normal"
                                        ampm={false}
                                        value={this.state.selectedEndDateTime}
                                        onChange={this.handleEndDateChangeInput}/>
                                </Grid>
                            </MuiPickersUtilsProvider>
                            {this.isStartDateAndEndDateValid(this.state.selectedStartDateTime, this.state.selectedEndDateTime)}
                            <TextValidator
                                id="standard-number"
                                label="Quota"
                                type="number"
                                onChange={this.handleChangeQuota}
                                name="quota"
                                value={this.state.quota}
                                validators={['required', 'minNumber:1', 'maxNumber:9223372036854775807']}
                                errorMessages={['This field is required','The value should be bigger than 1', 'The value should be less than 9223372036854775807.']}

                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            {this.extractQuestionElements()}

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
                                    Add Question
                                </Button>
                            </Grid>
                            <Grid item style={{marginTop:'10px',}}>
                                <h4>Mark Location</h4>
                                <Map onClick={this.onChangeMarkerInput}
                                     updatedMarker={this.state.marker}
                                />
                            </Grid>
                            {this.isLocationSelect()}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.props.handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button type="submit" color="primary">Submit</Button>
                        </DialogActions>
                    </ValidatorForm>
                </Dialog>
                {/* ADD EVENT MODAL END*/}
            </div>
        );
    }
}


export default withStyles(useStyles)(AddEventDialog)