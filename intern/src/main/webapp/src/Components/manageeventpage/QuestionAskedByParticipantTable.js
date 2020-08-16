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

class QuestionAskedByParticipantTable extends Component{

    constructor(props) {
        super(props);
        this.state = {
            page:0,
            rowsPerPage:10,
            rows:[],
            columns:[
                {
                    id: 'ssn',
                    label: 'TC\u00a0Kimlik\u00a0No',
                    minWidth: 170,
                },
                { id: 'name', label: 'Adı', minWidth: 170 },
                { id: 'surname', label: 'Soyadı', minWidth: 100 },
                {
                    id: 'question',
                    label: 'Sorusu',
                    minWidth: 170,
                }
            ]
        };
    }

    componentDidMount() {
        this.createRows(this.props.openedEvent.questionAskedByParticipantSet);
    }

    createRows=(questionAskedByParticipantSet)=>{
        let rowList = questionAskedByParticipantSet.map(question=>{
            return {
                ssn:question.participant.ssn,
                name:question.participant.name,
                surname:question.participant.surname,
                question:question.content
            }
        })
        this.setState({
            rows:[...rowList]
        });
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
                            {this.state.rows.slice(this.state.page * this.state.rowsPerPage,
                                this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => {
                                return (
                                    <TableRow key={row.ssn}>
                                        <TableCell component="th" scope="row" align="left">
                                            {row.ssn}
                                        </TableCell>
                                        <TableCell align="left">{row.name}</TableCell>
                                        <TableCell align="left">{row.surname}</TableCell>
                                        <TableCell align="left">{row.question}</TableCell>
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


export default withStyles(useStyles)(QuestionAskedByParticipantTable)