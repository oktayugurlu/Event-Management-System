import React, {Component} from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Alert from "@material-ui/lab/Alert";
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';
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
import {DateTimePicker, MuiPickersUtilsProvider,} from '@material-ui/pickers';
import trLocale from "date-fns/locale/tr";


import Map from './Map';
import EventQuestion from "./EventQuestion";


/*function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}*/

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
}));

class AddEventDialog extends Component{

    lastAddedSequenceQuestionId=0;

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
            questionElementObject:{},
            questionValueObject: {},
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
            this.extractQuestionObjectToQuestionElementFromEventDTO(this.props.updatedEvent.questionSet);
            this.setState( {
                uniqueName:this.props.updatedEvent.uniqueName,
                address: this.props.updatedEvent.address,
                title:this.props.updatedEvent.title,
                notes:this.props.updatedEvent.notes,
                selectedStartDateTime:this.props.updatedEvent.startDateTime,
                selectedEndDateTime:this.props.updatedEvent.endDateTime,
                questionCounter:this.props.updatedEvent.questionSet.length,
                quota: this.props.updatedEvent.quota,
                marker:{
                    lat: this.props.updatedEvent.latitude,
                    lng: this.props.updatedEvent.longitude
                }
            });
        }
        ValidatorForm.addValidationRule('isContentUnique', (value) => {
            let questionValueObjectRef = this.state.questionValueObject
            let isThereSameContent = Object.keys(questionValueObjectRef).map(function(key) {
                return questionValueObjectRef[key]===value;
            });
            let counts = 0;
            isThereSameContent.forEach(function(isTrue) { if(isTrue) counts += 1;});
            return !(counts>1);
        });
        ValidatorForm.addValidationRule('isValid', (value) => {
            let regex = RegExp("^(?!.*\\.\\.)(?!.*\\.$)[^\\W][\\w.]{0,29}$");
            return regex.test(value);
        });
    };

    componentWillUnmount() {
        ValidatorForm.removeValidationRule('isTitleUnique');
        ValidatorForm.removeValidationRule('isContentUnique');
        ValidatorForm.removeValidationRule('isValid');
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

    handleChangeQuota = (event) => {
        const quota = event.target.value;
        this.setState({
            quota:quota
        });
    };

    handleSubmit = () =>{
        if(this.state.selectedEndDateTime>this.state.selectedStartDateTime && this.isMarkSelectFromMap()) { // Everything is ok, the form can be submitted.
            let questionSet = Object.keys(this.state.questionValueObject).map(
                (key) =>{
                return this.createQuestionObject(this.state.questionValueObject[key]);
            });
            let updatedObject = {
                uniqueName: this.state.uniqueName,
                title: this.state.title,
                longitude: this.state.marker.lng,
                latitude: this.state.marker.lat,
                startDateTime: this.addHours(this.state.selectedStartDateTime,3).toISOString(),
                endDateTime: this.addHours(this.state.selectedEndDateTime,3).toISOString(),
                quota: this.state.quota,
                notes: this.state.notes,
                address: this.state.address,
                appliedParticipantSet: [],
                questionSet: questionSet
            };
            this.clearStateVariable();
            this.props.handleSubmit(updatedObject);
        }
    };

    addHours = (date,offset) => {
        date.setTime(date.getTime() + (offset*60*60*1000));
        return date;
    }

    clearStateVariable = ()=>{
        this.setState({
                uniqueName:'',
                address: '',
                title: '',
                notes: '',
                selectedStartDateTime: new Date(),
                selectedEndDateTime: new Date(),
                questionCounter: 0,
                questionElementObject: {},
                questionValueObject: {},
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


    isStartDateAndEndDateValid = (selectedStartDateTime, selectedEndDateTime) =>{
        let currentDate = new Date();

        if(selectedEndDateTime <= selectedStartDateTime)
            return this.createAlertForValidation("Başlangıç tarihi bitişten sonra veya aynı olamaz!");
        else if(currentDate > selectedStartDateTime )
            return this.createAlertForValidation("Başlangıç tarihi şimdiden büyük olmalı!");
        else if(currentDate > selectedEndDateTime)
            return this.createAlertForValidation("Bitiş tarihi şimdiden büyük olmalı!");
    }

    isLocationSelect = ()=>{
        if(this.state.marker.lng === 300)
            return this.createAlertForValidation("Lütfen haritadan bir konum seçiniz!");
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
                        <DialogTitle id="scroll-dialog-title">Etkinlik Ekle</DialogTitle>
                        <DialogContent>
                            <TextValidator
                                label="Etkinlik ID"
                                onChange={this.handleChangeUniqueNameInput}
                                name="id"
                                inputProps={{ maxLength: 50 }}
                                value={this.state.uniqueName}
                                validators={!this.props.isEventUpdated ? ['required','isTitleUnique', 'isValid' ]:['required']}
                                errorMessages={!this.props.isEventUpdated ?['Bu alan gerekli','Bu ID ile bir etkinlik mevcut!','Bu isim doğru formatta değil']:['Bu alan gerekli']}
                                fullWidth
                                disabled={this.props.isEventUpdated}
                            />
                            <TextValidator
                                label="Etkinlik İsmi"
                                onChange={this.handleChangeTitleInput}
                                name="title"
                                value={this.state.title}
                                inputProps={{ maxLength: 50 }}
                                validators={['required']}
                                errorMessages={['Bu alan gerekli']}
                                fullWidth
                            />
                            <TextValidator
                                label="Adres"
                                onChange={this.handleChangeAddressInput}
                                name="address"
                                multiline
                                rows={4}
                                inputProps={{ maxLength: 255 }}
                                value={this.state.address}
                                validators={['required']}
                                errorMessages={['Bu alan gerekli']}
                                fullWidth
                            />
                            <TextValidator
                                label="Detaylar"
                                onChange={this.handleChangeNotesInput}
                                name="notes"
                                multiline
                                rows={4}
                                inputProps={{ maxLength: 255 }}
                                value={this.state.notes}
                                validators={['required']}
                                errorMessages={['Bu alan gerekli']}
                                fullWidth
                            />
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={trLocale}>
                                <Grid container justify="space-between">
                                    <DateTimePicker
                                        id="datetime-local"
                                        label="Başlangıç Tarihi"
                                        margin="normal"
                                        ampm={false}
                                        value={this.state.selectedStartDateTime}
                                        onChange={this.handleStartDateChangeInput}
                                        dateFormat={"YYYY-MM-DDThh:mm:ss.s"}
                                    />
                                </Grid>
                                <br/>
                                <Grid container justify="space-between">
                                    <DateTimePicker
                                        id="datetime-local"
                                        label="Bitiş Tarihi"
                                        margin="normal"
                                        ampm={false}
                                        value={this.state.selectedEndDateTime}
                                        onChange={this.handleEndDateChangeInput}
                                        dateFormat={"YYYY-MM-DDThh:mm:ss.s"}
                                    />
                                </Grid>
                            </MuiPickersUtilsProvider>
                            {this.isStartDateAndEndDateValid(this.state.selectedStartDateTime, this.state.selectedEndDateTime)}
                            <TextValidator
                                id="standard-number"
                                label="Kota"
                                type="number"
                                onChange={this.handleChangeQuota}
                                name="quota"
                                value={this.state.quota}
                                validators={['required', 'minNumber:0', 'maxNumber:9223372036854775807']}
                                errorMessages={['Bu alan gerekli','Değer 1\'den büyük olmalı.', 'Değer 9223372036854775807\'den küçük olmalı.']}

                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            {this.exportQuestionElementFromJSONAsArray()}
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
                            <Grid item style={{marginTop:'10px',}}>
                                <h4>Konumu Seç</h4>
                                <Map onClick={this.onChangeMarkerInput}
                                     updatedMarker={this.state.marker}
                                />
                            </Grid>
                            {this.isLocationSelect()}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.props.handleClose} color="primary">
                                İptal
                            </Button>
                            <Button type="submit" color="primary">Gönder</Button>
                        </DialogActions>
                    </ValidatorForm>
                </Dialog>
                {/* ADD EVENT MODAL END*/}
            </div>
        );
    }
}


export default withStyles(useStyles)(AddEventDialog)