import React, {Component} from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";

export default class DeleteEventButton extends Component{

    constructor(props) {
        super(props);
        this.state={
            isButtonHidden:true,
            intervalId:true
        }
    }

    componentDidMount(){
        let intervalId = setInterval(()=>{
            if(!this.props.checkStartDateIsNotUpToDate(new Date())){
                this.setState({
                    isButtonHidden:false
                });
            }
            else if( this.props.checkStartDateIsNotUpToDate(new Date())){
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
                <div className={this.props.classes.wrapper}>
                    <Tooltip title={
                        this.state.isButtonHidden
                            ? "Etkinlik bitiş tarihinden sonra silinemez!"
                            : "Sil"} aria-label="add"
                    >
                        <Box component="span" display="block">
                                <span>
                                    <Fab
                                        aria-label="delete"
                                        color="secondary"
                                        onClick={this.props.openAreYouSureDialog}
                                        disabled={this.state.isButtonHidden }
                                    >
                                        <DeleteIcon/>
                                    </Fab>
                                </span>
                        </Box>
                    </Tooltip>
                </div>
            </>

        );
    }
}