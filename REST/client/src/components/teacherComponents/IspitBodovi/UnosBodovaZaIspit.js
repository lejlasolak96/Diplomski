import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Col, Row, Button, Collapse} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

import PrikazJednogStudentaBodovi from './PrikazJednogStudentaBodovi';

class UnosBodovaZaIspit extends Component {

    constructor(props) {
        super(props);
        this.state = {
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

    displayUsers() {

        if (this.state.studenti.length !== 0) {

            return this.state.studenti.map((osoba) => {

                return <PrikazJednogStudentaBodovi key = {osoba.id} id = {osoba.id}/>;
            });
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

    render() {
        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardHeader>
                        <h3>Pojedinačni unos bodova</h3>
                    </CardHeader>
                    <CardBody>
                        <Button color = {"success"}
                                href = {"/kreiranjeIspitBodova"}>
                            Grupni unos bodova
                        </Button>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div>
                            <Card>
                                <Row style = {{fontSize: "14pt"}}>
                                    <Col>ID</Col>
                                    <Col>Ime</Col>
                                    <Col>Prezime</Col>
                                    <Col>Index</Col>
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

export default UnosBodovaZaIspit;
