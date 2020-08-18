import React, {Component} from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});


class ManageLotsTable extends Component{

    constructor(props) {
        super(props);
        this.state = {
            radioValue:''
        }
    }

    renderRowList = ()=>{
        return this.props.event.lotsSet.map((lots, index)=>{
            return (
                <StyledTableRow key={lots.participant.ssn+lots.giftMessage+index}>
                    <StyledTableCell component="th" scope="row">
                        {lots.participant.ssn}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                        {lots.participant.name}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                        {lots.participant.surname}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                        {lots.participant.mail}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                        {lots.giftMessage}
                    </StyledTableCell>
                </StyledTableRow>
            );
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Kazananın TC'si</StyledTableCell>
                            <StyledTableCell>Kazananın Adı</StyledTableCell>
                            <StyledTableCell>Kazananın Soyadı</StyledTableCell>
                            <StyledTableCell>Kazananın Maili</StyledTableCell>
                            <StyledTableCell>Kazandıkları Hediye</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.renderRowList()}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

}


export default withStyles(useStyles)(ManageLotsTable);