import React, {Component} from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";
import HelpIcon from "@material-ui/icons/Help";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

export default class AskQuestionAndLeftEventButton extends Component{

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
            else if(!this.props.checkEndDateIsUpToDate(new Date()) && this.props.checkStartDateIsNotUpToDate(new Date())){
                this.setState({
                    isButtonHidden:true
                }, ()=>clearInterval( this.state.intervalId ));
            }
        }, 1000);
        this.setState({
            intervalId:intervalId
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    render() {
        return (
            <>
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
                <div className={this.props.classes.wrapper} hidden={!this.state.isButtonHidden || !this.props.checkEndDateIsUpToDate(new Date()) }>
                    <Tooltip title={this.props.checkStartDateIsNotUpToDate( new Date())
                        ? "Etkinlik başlama tarihini geçmişse ayrılamazsınız"
                        : "Etkinlikten Ayrıl"
                    }
                             aria-label="add">
                        <Box component="span" display="block">
                                <span>
                                    <Fab
                                        aria-label="place"
                                        color="secondary"
                                        onClick={()=>this.props.openAreYouSureDialog()}
                                        disabled={this.props.checkStartDateIsNotUpToDate( new Date())}
                                    >
                                        <ExitToAppIcon/>
                                    </Fab>
                                </span>
                        </Box>
                    </Tooltip>
                </div>
            </>

        );
    }
}