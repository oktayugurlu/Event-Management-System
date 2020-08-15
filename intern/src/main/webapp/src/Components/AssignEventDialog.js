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
        let answerEmpty = {};
        this.props.assignedEvent.questionSet.forEach(question=> {
            answerEmpty[question.content] = '';
        });
        this.state = {
            assignedEvent:{},
            participant:{
                ssn:'',
                name:'',
                surname:'',
                mail:''
            },
            questionAnswerMap: {...answerEmpty},
            questionAnswerElementArray:[]
        }

    }
    componentDidMount(){

    }

    componentWillUnmount() {
    }

    //validation messages start//
    handleTcIdErrorMessage = ()=>{
        if(!this.isIdNumberValid()) {
            if (this.isValueEmpty(this.state.participant.ssn)) return "Bu alan gerekli!"
            else return "TC Kimlik No.'su gerçek değil!";
        }
    }
    handleMailMessage = ()=>{
        if(!this.isValidateEmail()) {
            if (this.isValueEmpty(this.state.participant.mail)) return "Bu alan gerekli!";
            else return "Email adresi geçerli değil!";
        }
    }
    handleEmptyCheck = (value)=>{
        if(this.isValueEmpty(value)) return "Bu alan gerekli!";
    }
    //validation messages end//

    //***** VALIDATION FUNCTIONS START *****//
    isIdNumberValid = () =>{
        let tcKimlikNo = this.state.participant.ssn;
        if(tcKimlikNo.length !== 11) {
            return false;
        }
        let sumAllNumbers = 0;
        let sumOdd = 0;
        let sumEven = 0;
        let numbers = [];
        for (let i = 0; i < 11; i++) {
            numbers[i] = parseInt(tcKimlikNo.substring(i, i + 1));
        }
        for (let i = 0; i < 9; i++) {
            sumAllNumbers = sumAllNumbers + numbers[i];
            if (i % 2 !== 0) {
                sumEven = sumEven + numbers[i];
            } else {
                sumOdd = sumOdd + numbers[i];
            }
        }
        if ((sumAllNumbers + numbers[9]) % 10 !== numbers[10]) {
            return false;
        }
        if ((sumOdd * 7 + sumEven * 9) % 10 !== numbers[9]) {
            return false;
        }
        if (((sumOdd) * 8) % 10 !== numbers[10]) {
            return false;
        }
        return true;
    }
    isValueEmpty=(value)=>{
        if (value === '') return true;
    }
    isValidateEmail=()=>{
        let regexMail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
                    ssn: tcId.trim()
                }
            }));
    }
    handleOnChangeName = (event) => {
        const name = event.target.value;
        this.setState(
            prevState => ({
                participant:{
                    ...prevState.participant,
                    name: name
                }
            }));
    }
    handleOnChangeSurname = (event) => {
        const surname = event.target.value;
        this.setState(
            prevState => ({
                participant:{
                    ...prevState.participant,
                    surname: surname.trim()
                }
            }));
    }
    handleOnChangeMail = (event) => {
        const mail = event.target.value;
        this.setState(
            prevState => ({
                participant:{
                    ...prevState.participant,
                    mail: mail.trim()
                }
            }));
    }
    //***** SET STATE VARIABLES END *****//



    renderApplicationFormIfQuotaAvailable = ()=>{
        if(this.props.assignedEvent.quota===0){
            return (<Alert severity="warning">Üzgünüz, bu etkinlik maksimum kotaya erişti!</Alert>);
        }
        else{

            return(
                <Grid direction="column" container spacing={3}>
                    <Grid item xs>
                        <TextField
                            label={"Tc no."}
                            value={this.state.participant.ssn}
                            onChange={this.handleOnChangeTcID}
                            error={!this.isIdNumberValid()}
                            helperText={this.handleTcIdErrorMessage()}
                            inputProps={{ maxLength: 11}}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField
                            label={"Ad"}
                            value={this.state.participant.name}
                            onChange={this.handleOnChangeName}
                            error={this.isValueEmpty(this.state.participant.name)}
                            helperText={this.handleEmptyCheck(this.state.participant.name)}
                            inputProps={{ maxLength: 50}}
                        />
                        {" "}
                        <TextField
                            label={"Soyad"}
                            value={this.state.participant.surname}
                            onChange={this.handleOnChangeSurname}
                            error={this.isValueEmpty(this.state.participant.surname)}
                            helperText={this.handleEmptyCheck(this.state.participant.surname)}
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
                            onChange={
                                (event)=>this.questionAnswerJSONCreator(
                                    question.content,
                                    event.target.value)
                            }
                            error={this.isValueEmpty(this.state.questionAnswerMap[question.content])}
                            helperText={this.isValueEmpty(this.state.questionAnswerMap[question.content])?'Bu alan gerekli!':''}
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
        this.setState({
            questionAnswerMap: questionAnswerMapCopy
        });
    }

    handleSubmit = ()=>{
        if(this.checkIsFormValid()){
            let participantCopy = Object.assign({},this.state.participant);
            participantCopy.name.trim()
            participantCopy['answerSet'] = [...this.setAnswerSetForParticipantDTO()];
            this.props.handleSubmitAssignEvent(participantCopy, this.props.assignedEvent.uniqueName, this.props.assignedEvent);
        }
    }
    setAnswerSetForParticipantDTO=()=>{
        return this.props.assignedEvent.questionSet.map((question)=>{
            return {
                content: this.state.questionAnswerMap[question.content],
                question: question
            };
        })
    }
    checkIsFormValid = ()=>{
        let isDialogStatesValid =
            this.isIdNumberValid()
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
                    maxWidth={'sm'}>
                <DialogTitle style={{backgroundImage:"url("+CARD_IMAGE_URL+")"}} id="scroll-dialog-title">
                    {this.props.assignedEvent.title+" Etkinliğine Başvur"}
                </DialogTitle>
                <DialogContent>
                    <Grid direction="column" container spacing={3}>
                        <Grid item xs>
                            <h3>
                                Bilgiler
                            </h3>
                        </Grid>
                        <Grid item xs>
                            <b>Başlangıç Tarihi: </b>{this.props.assignedEvent.startDateTime.toString().slice(0,21)}
                        </Grid>
                        <Divider/>
                        <Grid item xs>
                            <b>Bitiş Tarihi: </b>{this.props.assignedEvent.endDateTime.toString().slice(0,21)}
                        </Grid>
                        <Divider/>
                        <Grid item xs>
                            <b>Detaylar: </b>{this.props.assignedEvent.notes}
                        </Grid>
                        <Divider/>
                        <Grid item xs>
                            <b>Adres: </b>{this.props.assignedEvent.address}
                        </Grid>
                        <Divider/>
                        <Grid item xs>
                            <b>Konum: </b>
                            <br/>
                            <Map isStatic={true}
                                 staticMarker={{lat: this.props.assignedEvent.latitude,
                                                lng: this.props.assignedEvent.longitude}}
                            />
                        </Grid>
                        <Divider/>
                        <Grid item xs>
                            <h3>
                                Başvuru Formu
                            </h3>
                        </Grid>
                    </Grid>
                    {this.renderApplicationFormIfQuotaAvailable()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleClose} color="primary">
                        İptal
                    </Button>
                    <Button onClick={this.handleSubmit}
                            color="primary"
                            disabled={this.props.assignedEvent.quota===0}
                    >
                        Kaydol
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}