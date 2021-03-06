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
import QuestionAskedByParticipantTable from "./QuestionAskedByParticipantTable";

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
    }
    componentWillUnmount() {
    }




    render() {
        return (
            <div>
                <Dialog
                    scroll={'paper'}
                    fullWidth={true}
                    maxWidth={'lg'}
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
                                {this.props.openedEvent.title+ " - Katılımcı Detayları"}
                            </Grid>
                            <Grid item>
                                <IconButton onClick={()=>this.props.handleClose(this.props.title)}>
                                    <CloseIcon/>
                                </IconButton>
                            </Grid>

                        </Grid>

                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container direction="column" spacing={4}>
                            <Grid item>
                                <Typography variant="h5" gutterBottom>
                                    Son 15 Günün Başvuru İstatistiği
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
                            <Grid item>
                                <Typography variant="h5" gutterBottom>
                                    Katılımcı Bilgileri
                                </Typography>
                            </Grid>
                            <Grid item>
                                <ParticipantTable openedEvent={this.props.openedEvent}/>
                            </Grid>
                            <Grid item>
                                <Divider variant="middle"/>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5" gutterBottom>
                                    Katılımcılardan Gelen Sorular
                                </Typography>
                            </Grid>
                            <Grid item>
                                <QuestionAskedByParticipantTable openedEvent={this.props.openedEvent}/>
                            </Grid>

                        </Grid>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}
