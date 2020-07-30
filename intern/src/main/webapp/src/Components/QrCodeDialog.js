import React, {Component} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/core/IconButton";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default class QrCodeDialog extends Component{

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
                    open={this.props.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={()=>this.props.handleClose(this.props.title)}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="customized-dialog-title" >
                        <IconButton aria-label="close" onClick={this.props.handleClose}>
                            <CloseIcon />
                        </IconButton>
                        Başvuru Bilgilerinizi İçeren QR Kod
                    </DialogTitle>
                    <DialogContent>
                        <p color="#8298BC">
                            *Kodunuz emailinize gönderildi, lütfen kontrol ediniz.
                        </p>
                        <br/>
                        <img src={URL.createObjectURL(this.props.qrCodeImage)} />
                    </DialogContent>
                </Dialog>
            </div>
        );
    }


}
