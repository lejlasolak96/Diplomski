import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {Button, Card, CardBody, CardFooter, CardHeader, Form, Input} from 'reactstrap';
import {
    Link,
    Redirect
} from 'react-router-dom';

import {loginMutation} from '../mutations/mutations';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null,
            redirect: false
        };
    }

    login = (e) => {

        e.preventDefault();

        this.props.mutate({
            variables: {
                username: this.state.username,
                password: this.state.password
            }
        })
            .then(res => {

                const {token} = res.data.prijavaKorisnika;
                localStorage.setItem('token', token);
                this.setState({redirect: true});
            })
            .catch(function (error) {
                alert(error.message);
            });
    };

    render() {

        if (this.state.redirect === true) {
            return <Redirect to="/" />;
        }

        return (
            <Card style = {{width: "600px", margin: "auto"}}>
                <CardHeader>
                    <h1>Login</h1>
                </CardHeader>
                <CardBody>
                    <Form id = "login" onSubmit = {this.login.bind(this)}>
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

export default graphql(loginMutation)(Login);
