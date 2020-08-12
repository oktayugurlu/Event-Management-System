import React, {Component} from "react";
import Main from "./Components/Main";
import {BackdropContext} from "./Components/contexts/BackdropContext";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import {withStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

const styles = theme =>  ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    backgroundColor:'#F9B769'
  },
});

class App extends Component{

  constructor(props) {
    super(props);
    this.state={
      openBackdropScreen:false,
      setOpenBackdropScreen:this.setOpenBackdropScreen
    }
  }

  setOpenBackdropScreen=()=>{
    this.setState({
      openBackdropScreen:true
    });
    setTimeout(this.setCloseBackdropScreen, 2000);
  }
  setCloseBackdropScreen=()=>{
    this.setState({
      openBackdropScreen:false
    });
  }

  render(){
    const { classes } = this.props;
    return (
        <BackdropContext.Provider value={this.state}>
          <Main/>
          <Backdrop className={classes.backdrop}
                    open={this.state.openBackdropScreen}
                    transitionDuration={300}
                    onClose={this.setCloseBackdropScreen}
          >
            <Grid container
                  direction={"column"}
                  alignItems="center"
            >
              <Grid item style={{marginBottom:"20px"}}>
                <Typography variant="h5" gutterBottom>
                  Yükleniyor...
                </Typography>
              </Grid>
              <CircularProgress color="inherit" />
            </Grid>
          </Backdrop>
        </BackdropContext.Provider>
    );
  }
}

export default withStyles(styles)(App);