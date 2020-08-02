import React, {Component} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import Grid from "@material-ui/core/Grid";
import ParticipantTable from "./ParticipantTable";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default class ParticipantsDetailDialog extends Component{

    constructor(props) {
        super(props);
        this.state={
            image:'',
        }
    }

    componentDidMount() {
        console.log("QR COMPONENT AYAGA KALKTI!!!!");
    }
    componentWillUnmount() {
        console.log("QR COMPONENT AYAGA KALKTI!!!!");
    }

    render() {
        return (
            <div>
                <Dialog
                    scroll={'paper'}
                    fullWidth={true}
                    maxWidth={'md'}
                    open={this.props.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={()=>this.props.handleClose(this.props.title)}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="customized-dialog-title" >

                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="flex-start"
                        >
                            <Grid item>
                                {this.props.openedEvent.title+ " - Başvuranların Bilgileri"}
                            </Grid>
                            <Grid item>
                                <IconButton onClick={()=>this.props.handleClose(this.props.title)}>
                                    <CloseIcon/>
                                </IconButton>
                            </Grid>

                        </Grid>

                    </DialogTitle>
                    <DialogContent>
                        <ParticipantTable openedEvent={this.props.openedEvent}/>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }


}
