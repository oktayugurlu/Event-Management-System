import React, {Component} from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";
import HelpIcon from "@material-ui/icons/Help";

export default class AskQuestionButton extends Component{

    constructor(props) {
        super(props);
        this.state={
            isButtonHidden:true,
            intervalId:true
        }
    }

    componentDidMount(){
        let intervalId = setInterval(()=>{
            if(this.props.checkEndDateIsUpToDate(new Date())
                && this.props.checkStartDateIsNotUpToDate(new Date())){
                this.setState({
                    isButtonHidden:false
                });
            }
        }, 1000);
        this.setState({
            intervalId:intervalId
        });
    }

    componentWillUnmount() {
        console.log("componentWillUnmount interval");
        clearInterval(this.state.intervalId);
    }

    showAskQuestionToInstructionButtonIfEventStarts = ()=>{

    }

    render() {
        return (
            <div className={this.props.classes.wrapper} hidden={this.state.isButtonHidden}>
                <Tooltip title={"Eğitmene Soru Sor"} aria-label="add">
                    <Box component="span" display="block">
                    <span>
                        <Fab
                            aria-label="place"
                            color="primary"
                            onClick={()=>this.props.handleClickOpenAskQuestionDialogButton()}
                        >
                            <HelpIcon/>
                        </Fab>
                    </span>
                    </Box>
                </Tooltip>
            </div>
        );
    }
}