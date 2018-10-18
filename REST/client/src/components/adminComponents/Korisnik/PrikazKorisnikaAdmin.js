import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Col, Row, Input} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

import PrikazJednogKorisnika from './PrikazJednogKorisnika';

class PrikazKorisnikaAdmin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapse: [],
            selected: null,
            opened: false,
            pretraga: "",
            users: [],
            error: null
        };
    }

    componentDidMount() {
        this.getUsers();
    }

    getUsers() {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/korisnici', options)
            .then(result => result.json())
            .then(data => {
                if (data.korisnici) this.setState({users: data.korisnici});
                if (data.error) this.setState({error: data.error});
            })
            .catch(err => {
                console.log(err);
            });
    }

    getUserByUsername(username) {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/search/korisnici?username=' + username, options)
            .then(result => result.json())
            .then(data => {
                if (data.korisnik) this.setState({users: [data.korisnik]});
                else this.setState({users: []});
            })
            .catch(err => {
                console.log(err);
            });
    }

    getUsersByType(tip) {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/search/korisnici/' + tip, options)
            .then(result => result.json())
            .then(data => {
                if (data.korisnici) this.setState({users: data.korisnici});
                else this.setState({user: []});
            })
            .catch(err => {
                console.log(err);
            })
    }

    refetch(r) {

        if (r === true) this.getUsers();
    }

    displayUsers() {

        if (this.state.users.length !== 0) {

            return this.state.users.map((osoba) => {

                return <PrikazJednogKorisnika refetch = {this.refetch.bind(this)} key = {osoba.id}
                                              userID = {osoba.id}/>;
            });
        }
        else {
            if (this.state.pretraga !== "") {
                return (
                    <Card>
                        <CardHeader>
                            <Row>Nema rezultata pretrage</Row>
                        </CardHeader>
                    </Card>
                );
            }
            else {
                return (
                    <Card>
                        <CardHeader>
                            <Row>{this.state.error}</Row>
                        </CardHeader>
                    </Card>
                );
            }
        }
    }

    changeSearch(e) {

        this.setState({pretraga: e.target.value});

        if (e.target.value === "student"
            || e.target.value === "nastavnik"
            || e.target.value === "admin")
            this.getUsersByType(e.target.value);

        else this.getUsers();
    }

    changeUsernameSearch(e) {

        this.setState({pretraga: "username"});
        this.getUserByUsername(e.target.value);
    }

    render() {
        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardHeader>
                        <h3>Korisnici</h3>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <Input type={"select"} onChange = {this.changeSearch.bind(this)}>
                            <option value = {""}>
                                Svi
                            </option>
                            <option value = {"student"}>
                                Studenti
                            </option>
                            <option value = {"nastavnik"}>
                                Nastavnici
                            </option>
                            <option value = {"admin"}>
                                Administratori
                            </option>
                            <option value = {"username"}>
                                Pretraga po username-u
                            </option>
                        </Input>
                        {
                            this.state.pretraga === "username" ?
                                <Input
                                    className = {"div-pretraga"}
                                    onChange = {this.changeUsernameSearch.bind(this)}
                                    placeholder = {"Unesite username za pretragu"}
                                    type = {"text"}/>
                                : null
                        }
                    </CardHeader>
                    <CardBody>
                        <div>
                            <Card>
                                <Row style = {{fontSize: "14pt"}}>
                                    <Col>ID</Col>
                                    <Col>Ime</Col>
                                    <Col>Prezime</Col>
                                    <Col>Spol</Col>
                                    <Col>Username</Col>
                                    <Col></Col>
                                    <Col></Col>
                                    <Col></Col>
                                </Row>
                                {this.displayUsers()}
                            </Card>
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default PrikazKorisnikaAdmin;
