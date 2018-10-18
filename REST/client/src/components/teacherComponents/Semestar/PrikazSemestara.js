import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Button, Col, Row} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

import PrikazJednogSemestra from './PrikazJednogSemestra';

class PrikazSemestara extends Component {

    constructor(props) {
        super(props);
        this.state = {
            semestri: [],
            error: null
        };
    }

    componentDidMount() {
        this.getSemesters();
    }

    getSemesters() {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/semestri', options)
            .then(result => result.json())
            .then(data => {
                if (data.semestri) this.setState({semestri: data.semestri});
                if (data.error) this.setState({error: data.error});
            })
            .catch(err => {
                console.log(err);
            })
    }

    displaySemesters() {

        if (this.state.semestri.length !== 0) {

            return this.state.semestri.map((sem) => {

                return <PrikazJednogSemestra refetch = {(r) => {
                    if (r === true) this.getSemesters();
                }} key = {sem.id} id = {sem.id}/>;
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
                        <h3>Semestri</h3>
                    </CardHeader>
                    <CardBody>
                        <Button
                            color = {"success"}
                            href = {"/kreiranjeSemestra"}>Kreiraj semestar
                        </Button>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <Card>
                            <Row style = {{fontSize: "14pt"}}>
                                <Col>ID</Col>
                                <Col>Naziv</Col>
                                <Col>Redni broj</Col>
                                <Col>Početak</Col>
                                <Col>Kraj</Col>
                                <Col>Akademska godina</Col>
                                <Col></Col>
                                <Col></Col>
                                <Col></Col>
                            </Row>
                            {this.displaySemesters()}
                        </Card>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default PrikazSemestara;