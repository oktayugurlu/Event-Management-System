import React, {Component} from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export default class SurveyRadioButton extends Component{
    render() {
        return (
            <FormControl component="fieldset">
                <FormLabel component="legend">labelPlacement</FormLabel>
                <RadioGroup row aria-label="position" name="position" defaultValue="top">
                    <FormControlLabel
                        value="top"
                        control={<Radio color="primary" />}
                        label="Top"
                        labelPlacement="top"
                    />
                    <FormControlLabel value="end" control={<Radio color="primary" />} label="End" />
                </RadioGroup>
            </FormControl>
        );
    }
}