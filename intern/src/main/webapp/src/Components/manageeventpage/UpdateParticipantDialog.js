import React, {Component} from 'react';
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import {DialogActions} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

export default class UpdateParticipantDialog extends Component{

    constructor(props) {
        super(props);
        console.log("this.props.updatedParticipant %O",this.props.updatedParticipant);
        this.state = {
            participant:{
                ssn:this.props.updatedParticipant.ssn,
                name:this.props.updatedParticipant.name,
                surname:this.props.updatedParticipant.surname,
                mail:this.props.updatedParticipant.mail
            }
        }

    }
    componentDidMount(){

    }

    componentWillUnmount() {

    }

    //validation messages start//
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


    renderForm = ()=>{
        return(
            <Grid direction="column" container spacing={3}>
                <Grid item xs>
                    <TextField
                        label={"Tc no."}
                        value={this.state.participant.ssn}
                        inputProps={{ maxLength: 11}}
                        fullWidth
                        disabled
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
            </Grid>
        );
    }


    handleSubmit = ()=>{
        if(this.checkIsFormValid()){
            let participantCopy = Object.assign({},this.state.participant);
            participantCopy.name.trim()
            this.props.saveUpdatedParticipant(participantCopy);
        }
    }

    checkIsFormValid = ()=>{
        return this.isValidateEmail()
            && !this.isValueEmpty(this.state.participant.surname)
            && !this.isValueEmpty(this.state.participant.name);
    }

    render() {
        return (
            <Dialog scroll={'paper'}
                    aria-labelledby="scroll-dialog-title"
                    aria-describedby="scroll-dialog-description"
                    open={this.props.open}
                    onClose={this.props.handleClose}
                    fullWidth={true}
                    maxWidth={'sm'}>
                <DialogTitle id="scroll-dialog-title">
                    {"Katılımcıyı güncelle"}
                </DialogTitle>
                <DialogContent>
                    {this.renderForm()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleClose} color="primary">
                        İptal
                    </Button>
                    <Button onClick={this.handleSubmit}
                            color="primary"
                    >
                        Kaydet
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}