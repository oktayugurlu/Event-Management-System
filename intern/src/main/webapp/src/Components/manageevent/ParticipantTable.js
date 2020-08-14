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

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
});

class ParticipantTable extends Component{

    constructor(props) {
        super(props);
        this.state = {
            page:0,
            rowsPerPage:10,
            rows:[],
            columns:[
                { id: 'name', label: 'Adı', minWidth: 170 },
                { id: 'surname', label: 'Soyadı', minWidth: 100 },
                {
                    id: 'email',
                    label: 'Email',
                    minWidth: 170,
                    align: 'right',
                },
                {
                    id: 'ssn',
                    label: 'TC\u00a0Kimlik\u00a0No',
                    minWidth: 170,
                    align: 'right'
                }
            ]
        };
    }

    componentDidMount() {
        this.createColumnsAndRows(this.props.openedEvent.appliedParticipantSet);
    }

    createColumnsAndRows=(applications)=>{
        let columns=[...this.state.columns];
        let participantObjectList = this.participantRowArrayCreator(applications);

        this.addQuestionToColumn(columns);
        this.setState({
            rows:[...participantObjectList],
            columns:[...columns]
        });
    }
    participantRowArrayCreator = (applications)=>{
        return applications.map((application)=>{
            let newParticipant = this.deleteAnswerSetFromParticipant(application.participant);

            this.props.openedEvent.questionSet.forEach(
                (question)=>{
                    this.extractAnswerSetAsQuestionAnswerKeyValueForJSON(newParticipant
                        ,question,application );
                }
            );
            return newParticipant;
        });
    }

    addQuestionToColumn = (columns)=>{
        this.props.openedEvent.questionSet.forEach(
            (question)=>{
                columns.push(
                    {
                        id: question.content,
                        label: question.content,
                        minWidth: 170,
                        align: 'right',
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
        console.log(application.participant.answerSet);
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
                    const value = row[column.id];
                    console.log("value: %O",column.format);
                    return (
                        <TableCell key={column.id} align={column.align}>
                            {typeof value === "string" ? value : value.content}
                        </TableCell>
                    );
                })}
            </TableRow>
        );
    }

    render() {
        return (
            <Paper>
                <TableContainer >
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {this.state.columns.map((column) => (
                                    <TableCell
                                        key={column.id}
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
        );
    }


}


export default withStyles(useStyles)(ParticipantTable)