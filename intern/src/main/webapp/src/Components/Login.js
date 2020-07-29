import '../index.css';

import React, { Component } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import { withRouter } from 'react-router-dom';
import {
    getJwsToken,
    setCreatedItems,
    setIsAuthorized,
    setJwsToken,
    setUsername
} from "./authentication/LocalStorageService";
import TextField from "@material-ui/core/TextField";


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        const endpoint = "/login";
        const username = this.state.username;
        const password = this.state.password;

        const body = {
            username: username,
            password: password
        };

        axios.post(endpoint, body).then(response => {
            this.checkValidCredentials(response)
            setUsername(username);
            this.props.snackbarOpen('Logged in succesfully', "success")
            return this.redirectManageEventPage();
        });
    };

    checkValidCredentials= (response)=>{
        if( !(response.data.token === "Username or password is not correct!")){
            setIsAuthorized(true);
            setJwsToken(response.data.token);
        }
        else
            this.props.snackbarOpen(response.data.token, "error")
    }

    redirectManageEventPage = ()=> {
        axios.get("/manageevent/allevents/createdevents",{
            headers: {
                'Authorization': `Bearer ${getJwsToken()}`
            }
        }).then((response) => {
            setCreatedItems(response.data);
            this.props.updateLeftMenuIfAuthorized();
            this.props.history.push("/manageevents");
        });
    }

    handleChangeUsername = (event)=>{
        this.setState({
            username:event.target.value
        });
    }
    handleChangePassword = (event)=>{
        this.setState({
            password:event.target.value
        });
    }

    render() {
        return (
            <Grid item md={7} style={{backgroundColor:'#F0D1AE'}}>
                <Grid container
                      direction="column"
                      justify="center"
                      alignItems="center"
                      style={{ minHeight: '80vh'}}
                >
                    <Grid item md={6} style={{minWidth:'80vh'}}>
                        <ValidatorForm
                            onSubmit={this.handleFormSubmit}
                            // onError={errors => console.log(errors)}
                        >
                            <Card style={{backgroundColor:'#EDEBE9'}}>
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        Login
                                    </Typography>
                                        <TextValidator
                                            label="Username"
                                            onChange={this.handleChangeUsername}
                                            name="username"
                                            value={this.state.username}
                                            validators={['required']}
                                            errorMessages={['This field is required']}
                                            fullWidth
                                            style={{marginTop:'10px'}}
                                            inputProps={{ maxLength: 30 }}
                                        />
                                        <br />
                                        <TextValidator
                                            label="Password"
                                            onChange={this.handleChangePassword}
                                            name="password"
                                            value={this.state.password}
                                            validators={['required']}
                                            errorMessages={['This field is required']}
                                            fullWidth
                                            floatinglabeltext="Password"
                                            type="password"
                                            style={{marginTop:'10px'}}
                                            inputProps={{ maxLength: 128 }}
                                        />
                                        <br />

                                </CardContent>
                                <CardActions>
                                    <Button type="submit" color="primary">Log in</Button>
                                </CardActions>
                            </Card>
                        </ValidatorForm>
                    </Grid>

                </Grid>
            </Grid>
        );
    }
}
export default withRouter(Login);