import React, {Component} from 'react';
import {Button, Card, CardFooter, CardBody, CardHeader, Form, Input} from 'reactstrap';
import {
    Link,
    Redirect
} from 'react-router-dom';

import {API_ROOT} from "../api-config";

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null,
            redirect: false
        };
        this.login = this.login.bind(this);
    }

    login = (e) => {

        e.preventDefault();

        let User = {
            username: this.state.username,
            password: this.state.password
        };

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        const options = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(User)
        };

        fetch(API_ROOT + '/login', options)
            .then(res => res.json())
            .then(res => {
                if (res.token) {
                    localStorage.setItem('token', res.token);
                    this.setState({redirect: true});
                    console.log(res.message);
                }
                else {
                    alert(res.error);
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    render() {

        if (this.state.redirect === true) {
            return <Redirect to = "/"/>;
        }

        return (
            <Card style = {{width: "600px", margin: "auto"}}>
                <CardHeader>
                    <h1>Login</h1>
                </CardHeader>
                <CardBody>
                    <Form id = "login" onSubmit = {this.login}>
                        <label>Username: </label>
                        <Input type = "text" onChange = {(e) => this.setState({username: e.target.value})}/>
                        <label>Password: </label>
                        <Input type = "password" onChange = {(e) => this.setState({password: e.target.value})}/>
                        <Button color = {"primary"}>Login</Button>
                    </Form>
                </CardBody>
                <CardFooter>
                    <Link to = "/register">Registruj se</Link>
                </CardFooter>
            </Card>
        );
    }
}

export default Login;
