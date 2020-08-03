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

const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
    {
        id: 'population',
        label: 'Population',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'size',
        label: 'Size\u00a0(km\u00b2)',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'density',
        label: 'Density',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2),
    },
];

function createData(name, code, population, size) {
    const density = population / size;
    return { name, code, population, size, density };
}

const rows = [
    createData('India', 'IN', 1324171354, 3287263),
    createData('China', 'CN', 1403500365, 9596961),
    createData('Italy', 'IT', 60483973, 301340),
    createData('United States', 'US', 327167434, 9833520),
    createData('Canada', 'CA', 37602103, 9984670),
    createData('Australia', 'AU', 25475400, 7692024),
    createData('Germany', 'DE', 83019200, 357578),
    createData('Ireland', 'IE', 4857000, 70273),
    createData('Mexico', 'MX', 126577691, 1972550),
    createData('Japan', 'JP', 126317000, 377973),
    createData('France', 'FR', 67022000, 640679),
    createData('United Kingdom', 'GB', 67545757, 242495),
    createData('Russia', 'RU', 146793744, 17098246),
    createData('Nigeria', 'NG', 200962417, 923768),
    createData('Brazil', 'BR', 210147125, 8515767),
];

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
                (question,index)=>{
                    this.extractAnswerSetAsQuestionAnswerKeyValueForJSON(newParticipant
                        ,question,application,index );
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
    extractAnswerSetAsQuestionAnswerKeyValueForJSON = (newParticipant, question, application, index)=>{
        newParticipant[question.content] = application.participant.answerSet[index].content;
        return newParticipant;
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
                            {this.state.rows.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.ssn}>
                                        {this.state.columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === 'number' ? column.format(value) : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
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