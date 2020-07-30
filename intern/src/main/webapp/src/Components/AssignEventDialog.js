import React, {Component} from 'react';
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import {DialogActions} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Alert from "@material-ui/lab/Alert";
import Map from "./Map";

const CARD_IMAGE_URL='https://images.all-free-download.com/images/graphiclarge/team_meeting_background_table_stationery_gathering_people_icons_6838493.jpg';

export default class AssignEventDialog extends Component{

    constructor(props) {
        super(props);
        this.state = {
            assignedEvent:{},
            participant:{
                ssn:'',
                name:'',
                surname:'',
                mail:''
            },
            questionAnswerMap: {},
            questionAnswerElementArray:[]
        }
    }
    componentDidMount(){
        this.props.assignedEvent.questionSet.forEach(question=> {
            this.questionAnswerJSONCreator(question.content, '');
        });
    }

    componentWillUnmount() {
        console.log("component siliniyor./././//./././././/.//./");
    }

    //validation messages start//
    handleTcIdErrorMessage = ()=>{
        if(!this.isIdNumberRegExValid()) {
            if (this.isValueEmpty(this.state.participant.ssn)) return "This field is required!"
            else return "TC ID isn't valid!";
        }
    }
    handleMailMessage = ()=>{
        if(!this.isValidateEmail()) {
            if (this.isValueEmpty(this.state.participant.mail)) return "This field is required!"
            else return "Email address isn't valid!";
        }
    }
    //validation messages end//

    //***** VALIDATION FUNCTIONS START *****//
    isIdNumberRegExValid = () =>{
        return /^[1-9]{1}[0-9]{9}[02468]{1}$/.test(this.state.participant.ssn);
        /*
        valid: 11111111110
        */
    }
    isValueEmpty=(value)=>{
        if (value === '') return true;
    }
    isValidateEmail=()=>{
        let regexMail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regexMail.test(this.state.participant.mail);
    }
    //***** VALIDATION FUNCTIONS END *****//

    //***** SET STATE VARIABLES START *****//
    handleOnChangeTcID = (event) => {
        const tcId = event.target.value;
        this.setState(
            prevState => ({
                participant:{
                    ...prevState.participant,
                    ssn: tcId
                }
            }))
    }
    handleOnChangeName = (event) => {
        const name = event.target.value;
        this.setState(
            prevState => ({
                participant:{
                    ...prevState.participant,
                    name: name
                }
            }))
    }
    handleOnChangeSurname = (event) => {
        const surname = event.target.value;
        this.setState(
            prevState => ({
                participant:{
                    ...prevState.participant,
                    surname: surname
                }
            }))
    }
    handleOnChangeMail = (event) => {
        const mail = event.target.value;
        this.setState(
            prevState => ({
                participant:{
                    ...prevState.participant,
                    mail: mail
                }
            }))
    }
    //***** SET STATE VARIABLES END *****//

    renderApplicationFormIfQuotaAvailable = ()=>{
        if(this.state.assignedEvent.quota===0){
            return (<Alert severity="warning">Sorry, this event has reached the maximum quota!</Alert>);
        }
        else{
            return(
                <Grid direction="column" container spacing={3}>
                    <Grid item xs>
                        <TextField
                            label={"Tc no."}
                            value={this.state.participant.ssn}
                            onChange={this.handleOnChangeTcID}
                            error={!this.isIdNumberRegExValid()}
                            helperText={this.handleTcIdErrorMessage()}
                            inputProps={{ maxLength: 11}}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField
                            label={"Name"}
                            value={this.state.participant.name}
                            onChange={this.handleOnChangeName}
                            error={this.isValueEmpty(this.state.participant.name)}
                            helperText={"This field is required!"}
                            inputProps={{ maxLength: 11}}

                        />
                        {" "}
                        <TextField
                            label={"Surname"}
                            value={this.state.participant.surname}
                            onChange={this.handleOnChangeSurname}
                            error={this.isValueEmpty(this.state.participant.surname)}
                            helperText={"This field is required!"}
                            inputProps={{ maxLength: 50}}/>
                    </Grid>
                    <Grid item xs>
                        <TextField
                            label={"Email"}
                            value={this.state.participant.mail}
                            onChange={this.handleOnChangeMail}
                            error={!this.isValidateEmail()}
                            helperText={this.handleMailMessage()}
                            inputProps={{ maxLength: 320 }}
                            fullWidth
                        />
                    </Grid>
                    {this.renderIfThereIsQuestion()}
                </Grid>
            );
        }
    }
    renderIfThereIsQuestion = ()=>{
        if(this.props.assignedEvent.questionSet !==[]){
            return this.props.assignedEvent.questionSet.map(question=>{
                return (
                    <Grid key={question.content} item xs>
                        <TextField
                            label={question.content}
                            value={this.state.questionAnswerMap[question.content]}
                            onChange={(event)=>this.questionAnswerJSONCreator(question.content, event.target.value)}
                            error={this.isValueEmpty(this.state.questionAnswerMap[question.content])}
                            helperText={this.isValueEmpty(this.state.questionAnswerMap[question.content])?'This field is required!':''}
                            inputProps={{ maxLength: 50}}
                            fullWidth
                        />
                    </Grid>
                );
            });
        }
    }
    questionAnswerJSONCreator=(question, answer)=>{
        let questionAnswerMapCopy = {
            ...this.state.questionAnswerMap
        };
        questionAnswerMapCopy[question] = answer;
        this.setState(prevState=>({
            questionAnswerMap: {
                ...prevState.questionAnswerMap,
                [question]:answer
            }
        }));
    }

    handleSubmit = ()=>{
        if(this.checkIsFormValid()){
            let participantCopy = Object.assign({},this.state.participant);
            participantCopy['answerSet'] = [...this.setAnswerSetForParticipantDTO()];
            this.props.handleSubmitAssignEvent(participantCopy, this.props.assignedEvent.uniqueName);
        }
    }
    setAnswerSetForParticipantDTO=()=>{
        console.log("sssss");
        console.log(this.props.assignedEvent.questionSet);
        return this.props.assignedEvent.questionSet.map((question)=>{
            return {
                content: this.state.questionAnswerMap[question.content],
                question: question
            };
        })
    }
    checkIsFormValid = ()=>{
        let isDialogStatesValid =
            this.isIdNumberRegExValid()
            && this.isValidateEmail()
            && !this.isValueEmpty(this.state.participant.surname)
            && !this.isValueEmpty(this.state.participant.name);
        this.props.assignedEvent.questionSet.forEach(question=>
        { isDialogStatesValid = isDialogStatesValid
            && !this.isValueEmpty(this.state.questionAnswerMap[question.content])
        });
        return isDialogStatesValid;
    }

    render() {
        return (
            <Dialog scroll={'paper'}
                    aria-labelledby="scroll-dialog-title"
                    aria-describedby="scroll-dialog-description"
                    open={this.props.isOpenAssignEventForm}
                    onClose={this.props.handleClose}
                    fullWidth={true}
                    maxWidth={'md'}>
                <DialogTitle style={{backgroundImage:"url("+CARD_IMAGE_URL+")"}} id="scroll-dialog-title">
                    Assign to {this.props.assignedEvent.title}
                </DialogTitle>
                <DialogContent>
                    <Grid direction="column" container spacing={3}>
                        <Grid item xs>
                            <h3>
                                Informations
                            </h3>
                        </Grid>
                        <Grid item xs>
                            <b>Start Date: </b>{this.props.assignedEvent.startDateTime.toString().slice(0,21)}
                        </Grid>
                        <Divider/>
                        <Grid item xs>
                            <b>End Date: </b>{this.props.assignedEvent.endDateTime.toString().slice(0,21)}
                        </Grid>
                        <Divider/>
                        <Grid item xs>
                            <b>Notes: </b>{this.props.assignedEvent.notes}
                        </Grid>
                        <Divider/>
                        <Grid item xs>
                            <b>Address: </b>{this.props.assignedEvent.address}
                        </Grid>
                        <Divider/>
                        <Grid item xs>
                            <b>You can see the location of event: </b>
                            <br/>
                            <Map isStatic={true}
                                 staticMarker={{lat: this.props.assignedEvent.latitude,
                                                lng: this.props.assignedEvent.longitude}}
                            />
                        </Grid>
                        <Divider/>
                        <Grid item xs>
                            <h3>
                                Application Form
                            </h3>
                        </Grid>
                    </Grid>
                    {this.renderApplicationFormIfQuotaAvailable()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleSubmit} color="primary">Submit</Button>
                </DialogActions>
            </Dialog>
        );
    }
}