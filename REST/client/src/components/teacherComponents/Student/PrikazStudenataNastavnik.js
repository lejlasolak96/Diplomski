import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Col, Row, Input} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

import PrikazJednogStudenta from './PrikazJednogStudenta';

class PrikazStudenataNastavnik extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            studenti: [],
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

        fetch(API_ROOT + '/studenti', options)
            .then(result => result.json())
            .then(data => {
                if (data.studenti) this.setState({studenti: data.studenti});
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

        fetch(API_ROOT + '/search/studenti?username=' + username, options)
            .then(result => result.json())
            .then(data => {
                if (data.student) this.setState({studenti: [data.student]});
                else this.setState({studenti: []});
            })
            .catch(err => {
                console.log(err);
            })
    }

    displayUsers() {

        if (this.state.studenti.length !== 0) {

            return this.state.studenti.map((osoba) => {

                return <PrikazJednogStudenta key = {osoba.id} id = {osoba.id}/>;
            });
        }
        else {
            if (this.state.username !== "") {
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

    changeUsernameSearch(e) {

        this.setState({username: e.target.value});
        if (e.target.value !== "") this.getUserByUsername(e.target.value);
        else this.getUsers();
    }

    render() {
        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardHeader>
                        <h3>Studenti</h3>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <Input
                            className = {"div-pretraga"}
                            onChange = {this.changeUsernameSearch.bind(this)}
                            placeholder = {"Unesite username za pretragu"}
                            type = {"text"}/>
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

export default PrikazStudenataNastavnik;