import React, {Component} from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";

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


class SurveyTableToFill extends Component{

    constructor(props) {
        super(props);
        this.state = {
            radioValue:''
        }
    }

    renderRowListIfThereIsQuestion = ()=>{
        if(this.props.surveyQuestions !==[]){
            return this.props.surveyQuestions.map(question=>{
                return (
                        <StyledTableRow key={question.content}>
                            <StyledTableCell component="th" scope="row">
                                {question.content}
                            </StyledTableCell>
                            <StyledTableCell align="center" key={question.content}>
                            <FormControl component="fieldset">
                                <RadioGroup  row
                                             aria-label="position"
                                             name="position"
                                             onChange={this.props.handleChangeRadioButtons}
                                >
                                    {this.renderRadioButtons(5, question.content)}
                                </RadioGroup>
                            </FormControl>
                            </StyledTableCell>
                        </StyledTableRow>
                );
            });
        }
    }

    renderRadioButtons = (numberOfRadioButtons,questionContent)=>{
        let emptyArray = []
        let radioButtonValues = ['Katılmıyorum',
                                 'Kısmen Katılmıyorum',
                                 'Kararsızım',
                                 'Kısmen Katılıyorum',
                                 'Katılıyorum'];
        for(let i=0;i<numberOfRadioButtons;i++)
            emptyArray.push((
                <FormControlLabel
                    key={radioButtonValues[i]+i}
                    value={radioButtonValues[i]}
                    control={<Radio />}
                    label={radioButtonValues[i]}
                    labelPlacement="top"
                    name={questionContent}
                />
            ));
        return emptyArray;
    }

    isValueEmpty=(value)=>{
        if (value === '') return true;
    }

    render() {
        const { classes } = this.props;

        return (
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Sorular</StyledTableCell>
                            <StyledTableCell align="center">Lütfen Birini Seçiniz</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.renderRowListIfThereIsQuestion()}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

}


export default withStyles(useStyles)(SurveyTableToFill);