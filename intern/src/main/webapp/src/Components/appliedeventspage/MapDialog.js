import React, {Component} from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import Map from "../Map";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

export default class MapDialog extends Component{

    constructor(props) {
        super(props);
        this.state = {
            assignedEvent:{}
        }
    }

    render() {
        return (
            <Dialog scroll={'paper'}
                    aria-labelledby="scroll-dialog-title"
                    aria-describedby="scroll-dialog-description"
                    open={this.props.openDialog}
                    onClose={this.props.handleClose}
                    fullWidth={true}
                    maxWidth={'sm'}
            >
                <DialogTitle style={{backgroundColor:""}} id="scroll-dialog-title">
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="flex-start"
                    >
                        <Grid item>
                            <Typography variant="h6" gutterBottom>
                                {this.props.assignedEvent.title+" Konumu"}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <IconButton onClick={()=>this.props.handleClose(this.props.title)}>
                                <CloseIcon/>
                            </IconButton>
                        </Grid>

                    </Grid>
                </DialogTitle>

                <DialogContent dividers>
                    <Grid direction="column" container>
                        <Grid item xs>
                            <Map isStatic={true}
                                 staticMarker={{lat: this.props.assignedEvent.latitude,
                                     lng: this.props.assignedEvent.longitude}}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        );
    }
}