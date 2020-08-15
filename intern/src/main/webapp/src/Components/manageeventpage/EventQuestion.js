import React from "react";
import {TextValidator} from "react-material-ui-form-validator";

export default class EventQuestion extends React.Component{
    state = {
        questionCounter:0,
        question:''
    }
    componentDidMount() {
        this.setState({
            questionCounter: this.props.questionCounter,
            question:this.props.updatedQuestion
        });
    }

    handleChange = (event) => {
        const question = event.target.value;
        this.setState({
            question:question
        });
        this.props.onChange(event);
    }
    render(){
        return (
            <TextValidator
                label={"Soru-"+this.props.name.slice(2,3)}
                onChange={this.handleChange}
                name={this.props.name.toString()}
                value={this.state.question}
                validators={['required', 'isContentUnique']}
                errorMessages={['Bu alan gerekli', "Aynı soruyu ekleyemezsin!"]}
                style={{
                    marginTop:'8px',
                    minWidth: '95vh'
                }}
                multiline
                rowsMax={4}
                disabled={this.props.disabled}
            />
        );
    }
}