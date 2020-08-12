import React, {Component} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import Grid from "@material-ui/core/Grid";
import ParticipantTable from "./ParticipantTable";
import BarChart from "./BarChart";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import CasinoIcon from '@material-ui/icons/Casino';
import Button from "@material-ui/core/Button";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const LAST_TEN_DAY_PARTICIPANTS=1;
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

    castingLots=()=>{
        let numberOfParticipants = this.props.openedEvent.appliedParticipantSet.length;
        let luckyParticipant = this.getRandomInt(0,numberOfParticipants-1);
    }

    getRandomInt = (min, max)=> {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
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
                    <DialogContent dividers>
                        <Grid container direction="column" spacing={5}>
                            <Grid item>
                                <Typography variant="h5" gutterBottom>
                                    Son 10 Günün Başvuru İstatistiği
                                </Typography>
                            </Grid>
                            <Grid item>
                                <BarChart
                                    title={"Katılımcı Sayısı"}
                                    openedEventForUserDetail={this.props.openedEvent}
                                    whichChart={LAST_TEN_DAY_PARTICIPANTS}
                                />
                            </Grid>
                            <Grid item>
                                <Divider variant="middle"/>
                            </Grid>
                            <Grid>
                                <ParticipantTable openedEvent={this.props.openedEvent}/>
                            </Grid>
                            <Grid container direction="row"
                                  justify="center"
                                  alignItems="center">
                                <Button
                                    style={{
                                        marginTop:'22px',
                                        marginBottom:'22px'
                                    }}
                                    variant="contained"
                                    color="primary"
                                    onClick={this.castingLots}
                                    startIcon={<CasinoIcon/>}
                                >
                                    Kura Çek
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }


}
