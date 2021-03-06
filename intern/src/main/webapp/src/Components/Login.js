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
    setJwsToken, setUsername
} from "./authentication/LocalStorageService";
import {AppStateContext} from "./contexts/AppStateContext";


class Login extends Component {
    static contextType = AppStateContext;

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
            console.log("error: %O",response);
            this.checkValidCredentials(response);
        }).catch(error=>{
        });
    };

    checkValidCredentials= (response)=>{
        if( !(response.data.token === "Kullanıcı adı veya şifre yanlış!")){
            this.context.setIsAuthorized(true);
            this.context.setUsername(this.state.username);
            setUsername(this.state.username);
            setJwsToken(response.data.token);
            this.props.snackbarOpen('Giriş başarılı', "success");
            this.redirectManageEventPage();
        }
        else
            this.props.snackbarOpen(response.data.token, "error");
    }

    redirectManageEventPage = ()=> {
        axios.get("/manageevent/allevents/createdevents",{
            headers: {
                'Authorization': `Bearer ${getJwsToken()}`
            }
        }).then((response) => {
            this.context.setCreatedEvents(response.data);
            this.props.history.push("/manageevents");
            this.context.connectWebSocket();
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
            <Grid container
                  direction="column"
                  justify="center"
                  alignItems="center"
                  style={{ minHeight: '100vh',
                      backgroundColor: '#F9B769',
                  }}
            >
                <Grid item md={6} style={{minWidth:'80vh'}}>
                    <ValidatorForm
                        onSubmit={this.handleFormSubmit}
                        // onError={errors => console.log(errors)}
                    >
                        <Card style={{
                            backgroundColor:'#EDEBE9',
                            borderStyle: 'solid',
                            borderWidth: '2px',
                            borderColor:'#F6931E'
                        }}>
                            <CardContent>
                                <Grid
                                    direction="column"
                                    container
                                    spacing={3}
                                >
                                    <Grid item>
                                        <Typography variant="h5">
                                            Kurum Üyesi Girişi
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <TextValidator
                                            label="Kullanıcı Adı"
                                            onChange={this.handleChangeUsername}
                                            name="username"
                                            value={this.state.username}
                                            validators={['required']}
                                            errorMessages={['Bu alan gerekli']}
                                            fullWidth
                                            style={{marginTop:'10px'}}
                                            inputProps={{ maxLength: 30 }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextValidator
                                            label="Şifre"
                                            onChange={this.handleChangePassword}
                                            name="password"
                                            value={this.state.password}
                                            validators={['required']}
                                            errorMessages={['Bu alan gerekli']}
                                            fullWidth
                                            floatinglabeltext="Password"
                                            type="password"
                                            style={{marginTop:'10px'}}
                                            inputProps={{ maxLength: 128 }}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <CardActions>
                                <Button type="submit" color="primary">GİRİŞ Yap</Button>
                            </CardActions>
                        </Card>
                    </ValidatorForm>
                </Grid>

            </Grid>
        );
    }
}

export default withRouter(Login);