import React, {Component} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const QR_CODE_COMPONENT = 0;
const WEBSOCKET_COMPONENT = 1;

export default class QrCodeWebSocketDialog extends Component{


    constructor(props) {
        super(props);
        this.state={
            image:'',
        }
    }

    componentDidMount() {
    }
    componentWillUnmount() {
    }

    renderDialogContent = ()=>{
        if(QR_CODE_COMPONENT===this.props.whichDialogContent)
            return(
                <>
                    <p color="#8298BC">
                        *Kodunuz emailinize gönderildi, lütfen kontrol ediniz.
                    </p>
                    <br/>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="center"
                    >
                        <img src={URL.createObjectURL(this.props.qrCodeImage)}  alt={'qr-code'}/>
                    </Grid>
                </>
            );
        else if(WEBSOCKET_COMPONENT===this.props.whichDialogContent){
            return (
                <Grid direction="column" container spacing={1}>
                    <Grid item>
                        <Grid container direction={"row"} justify="space-between">
                            <Box fontWeight="fontWeightBold">
                                <Typography variant="body1" display={"inline"} align="left">
                                    Katılımcının Adı:
                                </Typography>
                            </Box>
                            <Typography variant="body1" display={"inline"} align="right">
                                {this.props.message.name}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid item>
                        <Grid container direction={"row"} justify="space-between">
                            <Box fontWeight="fontWeightBold">
                                <Typography variant="body1" display={"inline"} align="left">
                                    Katılımcının Soyadı:
                                </Typography>
                            </Box>
                            <Typography variant="body1" display={"inline"} align="right">
                                {this.props.message.surname}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid item>
                        <Grid container direction={"row"} justify="space-between">
                            <Box fontWeight="fontWeightBold">
                                <Typography variant="body1" display={"inline"} align="left">
                                    TC Kimlik No.su:
                                </Typography>
                            </Box>
                            <Typography fontWeight="fontWeightBold" variant="body1" display={"inline"} align="left">

                            </Typography>
                            <Typography variant="body1" display={"inline"} align="right">
                                {this.props.message.ssn}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid item>
                        <Grid container direction={"row"} justify="space-between">
                            <Box fontWeight="fontWeightBold">
                                <Typography variant="body1" display={"inline"} align="left">
                                    Etkinlik Adı:
                                </Typography>
                            </Box>
                            <Typography variant="body1" display={"inline"} align="right">
                                {this.props.message.eventTitle}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction={"row"} justify="space-between">
                            <Box fontWeight="fontWeightBold">
                                <Typography variant="body1" display={"inline"} align="left">
                                    Etkinlik ID:
                                </Typography>
                            </Box>
                            <Typography variant="body1" display={"inline"} align="right">
                                {this.props.message.eventUniqueName}
                            </Typography>
                        </Grid>
                    </Grid>

                </Grid>
            )
        }
    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={()=>this.props.handleClose(this.props.title)}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                    maxWidth={"xs"}
                >
                    <DialogTitle id="customized-dialog-title" >

                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="flex-start"
                        >
                            <Grid item>
                                <p>{this.props.dialogTitle}</p>
                            </Grid>
                            <Grid item>
                                <IconButton onClick={()=>this.props.handleClose(this.props.title)}>
                                    <CloseIcon/>
                                </IconButton>
                            </Grid>

                        </Grid>
                    </DialogTitle>
                    <DialogContent dividers>
                        {this.renderDialogContent()}
                    </DialogContent>
                </Dialog>
            </div>
        );
    }


}
