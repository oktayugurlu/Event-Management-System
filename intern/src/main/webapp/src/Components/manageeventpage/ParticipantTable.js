import React, {Component} from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import AreYouSureDialog from "../AreYouSureDialog";
import DeleteIcon from '@material-ui/icons/Delete';
import {getJwsToken} from "../authentication/LocalStorageService";
import axios from "axios";
import {AppStateContext} from "../contexts/AppStateContext";
import IconButton from "@material-ui/core/IconButton";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
});

class ParticipantTable extends Component{

    static contextType = AppStateContext;

    constructor(props) {
        super(props);
        this.state = {
            isOpenAreYouSureDialog: false,
            event: {...this.props.openedEvent},
            page:0,
            rowsPerPage:10,
            rows:[],
            deletedParticipantSSN:'',
            isDeletedSuccessfully:false,
            columns:[
                {   id: 'actions',
                    label:'Sil',
                    minWidth: 50,
                    align: 'center',
                },
                {   id: 'name',
                    label: 'Adı',
                    minWidth: 120,
                    align: 'left',
                },
                {   id: 'surname',
                    label: 'Soyadı',
                    minWidth: 100,
                    align: 'left',
                },
                {
                    id: 'email',
                    label: 'Email',
                    minWidth: 170,
                    align: 'left',
                },
                {
                    id: 'ssn',
                    label: 'TC\u00a0Kimlik\u00a0No',
                    minWidth: 170,
                    align: 'left'
                }
            ]
        };
        console.log("CONSTRUCTOR CALISTI");
    }

    componentDidMount() {
        this.createColumnsAndRows(this.state.event.appliedParticipantSet);
    }

    createColumnsAndRows=(applications)=>{
        let columns=[...this.state.columns];
        this.createRows(applications);
        this.addQuestionToColumn(columns);
        this.setState({
            columns:[...columns]
        });
    }
    createRows = (applications)=>{
        let participantObjectList = this.participantRowArrayCreator(applications);
        this.setState({
            rows:[...participantObjectList],
        });
    }
    participantRowArrayCreator = (applications)=>{
        return applications.map((application)=>{
            let newParticipant = this.deleteAnswerSetFromParticipant(application.participant);

            this.state.event.questionSet.forEach(
                (question)=>{
                    this.extractAnswerSetAsQuestionAnswerKeyValueForJSON(newParticipant
                        ,question,application );
                }
            );
            return newParticipant;
        });
    }

    addQuestionToColumn = (columns)=>{
        this.state.event.questionSet.forEach(
            (question)=>{
                columns.push(
                    {
                        id: question.content,
                        label: question.content,
                        minWidth: 170,
                        align: 'left',
                    }
                )
            }
        );
    }

    deleteAnswerSetFromParticipant = (participant)=>{
        return {
            name: participant.name,
            surname: participant.surname,
            email: participant.mail,
            ssn: participant.ssn,
        };
    }
    extractAnswerSetAsQuestionAnswerKeyValueForJSON = (newParticipant, question, application)=>{
        newParticipant[question.content] = this.getParticipantAnswerOfQuestionIfExist(application, question.content);
        return newParticipant;
    }

    getParticipantAnswerOfQuestionIfExist=(application, questionContent)=>{

        return application.participant.answerSet.filter(
            answer=>answer.question.content === questionContent
        )[0];
    }

    handleChangePage = (event, newPage) => {
        this.setState({
           page:newPage
        });
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({
            rowsPerPage:+event.target.value,
            page: 0
        });
    };


    renderEachRowByLookingIsAnswerObjectOrString =(row)=>{
        return (
            <TableRow hover role="checkbox" tabIndex={-1} key={row.ssn}>
                {this.state.columns.map((column) => {
                    if(column.id ==='actions'){
                        return(
                            <TableCell key={'actions'}  align={'center'}>
                                <IconButton aria-label="delete" onClick={()=>{this.openAreYouSureDialog(row.ssn)}} >
                                    <DeleteIcon style={{color:'red'}}/>
                                </IconButton>
                            </TableCell>
                        );
                    }
                    const value = row[column.id];
                    return (
                        <TableCell key={column.id} align={column.align}>
                            {this.handleParticipantInformation(value)}
                        </TableCell>
                    );
                })}
            </TableRow>
        );
    }

    //********* ARE YOU SURE DIALOG *********//
    openAreYouSureDialog = (deletedParticipantSSN)=>{
        this.setState({
            isOpenAreYouSureDialog:true,
            deletedParticipantSSN:deletedParticipantSSN
        });
    }
    closeAreYouSureDialog = ()=>{
        this.setState({
            isOpenAreYouSureDialog:false
        });
    }
    handleClickSureButtonInAreYouSureDialog=()=>{
        this.deleteApplicationFromBackend();
    }
    deleteApplicationFromBackend = ()=>{
        let deletedParticipant={};
        this.state.event.appliedParticipantSet.forEach((application)=>{
            if(application.participant.ssn === this.state.deletedParticipantSSN){
                deletedParticipant=application.participant;
            }
        });
        let headers = {
            'Authorization': `Bearer ${getJwsToken()}`
        };
        axios.post("/manageparticipant/deleteapplication/"+this.state.event.uniqueName,
            deletedParticipant,
            {
                headers:headers
            }
        ).then((response) => {
            console.log(response.data);
            this.setState({
                isOpenAreYouSureDialog:false,
                event: {...response.data},
                isDeletedSuccessfully:true
            },()=>this.createRows(this.state.event.appliedParticipantSet));
        }).catch(error => console.log(error));
    }

    handleParticipantInformation = (value)=>{

        if(value === undefined){ //Question is not answered
            return "";
        }
        else if(value.content === undefined){ //This is not an answer, just another participant information
            return value;
        }
        else { //Question is answered
            return value.content
        }
    }

    render() {
        return (
            <div>
                <AreYouSureDialog
                    runThisFunctionIfYes={this.handleClickSureButtonInAreYouSureDialog}
                    open={this.state.isOpenAreYouSureDialog}
                    handleClose={this.closeAreYouSureDialog}
                    event={this.props.eventObject}
                    message={this.state.deletedParticipantSSN+" TC'sine sahip kişi silinsin mi?"}
                />

                <Paper>
                    <TableContainer >
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {this.state.columns.map((column) => (
                                        <TableCell
                                            key={column.label}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.rows.slice(this.state.page * this.state.rowsPerPage,
                                    this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => {
                                    return this.renderEachRowByLookingIsAnswerObjectOrString(row)
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={this.state.rows.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                </Paper>
                {this.state.isDeletedSuccessfully
                    ?(<Alert severity="success" style={{marginTop:'10px'}}>
                        {this.state.deletedParticipantSSN+" TC'sine sahip kişi başarıyla silindi"}
                    </Alert>)
                    :''
                }
            </div>

        );
    }


}


export default withStyles(useStyles)(ParticipantTable)