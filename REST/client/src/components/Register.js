import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Input, CardFooter, Form, Button} from 'reactstrap';
import {Redirect, Link} from 'react-router-dom';
import {API_ROOT} from "../api-config";

class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            vrsta_korisnika_id: null,
            ime: null,
            prezime: null,
            index: null,
            spol: null,
            username: null,
            password: null,
            confirmedPassword: null,
            emails: [],
            fakultetskiEmail: null,
            emailFields: [],
            redirect: false,
            vrsteKorisnika: []
        };
        this.submitForm = this.submitForm.bind(this);
    }

    componentDidMount() {
        this.getUserTypes();
    }

    handleEmailValueChange = (idx) => (evt) => {
        const email = this.state.emailFields.map((e, sidx) => {
            if (idx !== sidx) return e;
            return {...e, adresa: evt.target.value};
        });

        this.setState({emailFields: email});

        this.setState({
            emails: this.state.emailFields.concat([this.state.fakultetskiEmail])
        });
    }

    setEmail(adresa) {

        this.setState({fakultetskiEmail: {adresa: adresa, fakultetska: true}});
        this.setState({emails: this.state.emailFields.concat([this.state.fakultetskiEmail])});
    }

    handleAddEmailField = () => {
        this.setState({
            emailFields: this.state.emailFields.concat([{
                adresa: '',
                fakultetska: false
            }])
        });
    }

    handleRemoveEmailField = (idx) => () => {
        this.setState({
            emailFields: this.state.emailFields.filter((s, sidx) => idx !== sidx)
        });
    }

    getUserTypes() {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        let request = new Request(API_ROOT + '/vrsteKorisnika', options);

        fetch(request)
            .then(res => res.json())
            .then((data) => {
                this.setState({
                    vrsteKorisnika: data.vrsteKorisnika
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    displayUserTypes() {

        return this.state.vrsteKorisnika.map(vrsta => {
            if (vrsta.naziv !== "admin")
                return (
                    <option value = {vrsta.id} key = {vrsta.id}>{vrsta.naziv}</option>
                );
        });
    }

    submitForm = (e) => {

        e.preventDefault();

        if (this.state.password !== this.state.confirmedPassword)
        {
            alert("Passwordi se ne podudaraju");
            return;
        }

        let newUser = {
            ime: this.state.ime,
            prezime: this.state.prezime,
            vrsta_korisnika_id: this.state.vrsta_korisnika_id,
            username: this.state.username,
            password: this.state.password,
            index: this.state.index,
            spol: this.state.spol,
            emails: this.state.emails
        };

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        const options = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(newUser)
        };

        let myRequest = new Request(API_ROOT + '/register', options);

        fetch(myRequest)
            .then(res => res.json())
            .then(res => {
                if (res.message) {
                    this.setState({redirect: true});
                    alert(res.message);
                }
                else alert(res.error);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {

        if (this.state.redirect === true) return <Redirect to = '/login'/>;

        return (
            <Card style = {{width: "600px", margin: "auto"}}>
                <CardHeader>
                    <h1>Register</h1>
                </CardHeader>
                <CardBody>
                    <Form id = "register-user" onSubmit = {this.submitForm.bind(this)}>
                        <Input placeholder = "Ime" type = "text"
                               onChange = {(e) => this.setState({ime: e.target.value})}/>
                        <Input placeholder = "Prezime" type = "text"
                               onChange = {(e) => this.setState({prezime: e.target.value})}/>
                        <Input placeholder = "Broj indexa" type = "number"
                               onChange = {(e) => this.setState({index: e.target.value})}/>
                        <Input placeholder = "Username" type = "text"
                               onChange = {(e) => this.setState({username: e.target.value})}/>
                        <Input placeholder = "Password" type = "password"
                               onChange = {(e) => this.setState({password: e.target.value})}/>
                        <Input placeholder = "Potvrdi password" type = "password"
                               onChange = {(e) => this.setState({confirmedPassword: e.target.value})}/>
                        <div className = {"newEmails"}>
                            <Input className = {"email"} placeholder = "Fakultetski e-mail" type = "email"
                                   onChange = {(e) => this.setEmail(e.target.value)}/>
                            <Button className = {"minus"} color = {"primary"} onClick = {this.handleAddEmailField}>
                                + </Button>
                        </div>
                        {this.state.emailFields.map((email, idx) => (
                            <div key = {idx + 1} className = {"newEmails"}>
                                <Input
                                    type = "email"
                                    className = {"email"}
                                    placeholder = {`Alternativni e-mail #${idx + 1} `}
                                    value = {email.adresa}
                                    onChange = {this.handleEmailValueChange(idx)}
                                />
                                <Button className = {"minus"} color = {"danger"}
                                        onClick = {this.handleRemoveEmailField(idx)}> - </Button>
                            </div>
                        ))}
                        <div>
                            <Input type = {"select"}
                                   onChange = {(e) => this.setState({vrsta_korisnika_id: e.target.value})}>
                                <option disabled = {true} selected = {true}>Odaberite tip korisnika</option>
                                {this.displayUserTypes()}
                            </Input>
                        </div>
                        <div>
                            <label className = {"vrsta-label"}>Spol: </label>
                            <div className = {"vrsta-label"}>
                                <Input type = "radio" name = "spol" value = "M"
                                       onChange = {(e) => this.setState({spol: e.target.value})}/>
                                <label>Muški</label>
                            </div>
                            <div className = {"vrsta-label"}>
                                <Input type = "radio" name = "spol" value = "Z"
                                       onChange = {(e) => this.setState({spol: e.target.value})}/>
                                <label>Ženski</label>
                            </div>
                        </div>
                        <Button color = {"primary"}
                                disabled={
                                    !this.state.ime ||
                                    !this.state.prezime ||
                                    !this.state.vrsta_korisnika_id ||
                                    !this.state.username ||
                                    !this.state.password ||
                                    !this.state.spol ||
                                    !this.state.password
                                }>Register</Button>
                    </Form>
                </CardBody>
                <CardFooter>
                    <Link to = "/login">Prijavi se</Link>
                </CardFooter>
            </Card>
        );
    }
}

export default Register;