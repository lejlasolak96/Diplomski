import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Col, Row, Button, Table} from 'reactstrap';
import Popup from "reactjs-popup";
import {API_ROOT} from "../../../api-config";

import PrikazStudentovihDetalja from '../Student/PrikazStudentovihDetalja';
import PrikazDetaljaSpirale from '../Spirala/PrikazDetaljaSpirale';

class PrikazIzvjestaja extends Component {

    constructor(props) {
        super(props);
        this.state = {
            izvjestaji: [],
            error: null
        };
    }

    componentDidMount() {
        this.getReports();
    }

    getReports() {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/izvjestaji', options)
            .then(result => result.json())
            .then(data => {
                if (data.izvjestaji) this.setState({izvjestaji: data.izvjestaji});
                if (data.error) this.setState({error: data.error});
            })
            .catch(err => {
                console.log(err);
            });
    }

    deleteReportFn = (id) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'DELETE',
            headers: myHeaders
        };

        fetch(API_ROOT + '/izvjestaji/' + id, options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    this.getReports();
                    alert(data.message);
                }
                else alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    };

    displayReports() {

        if (this.state.izvjestaji.length !== 0) {

            return this.state.izvjestaji.map((i) => {

                return (
                    <Card key = {i.id}>
                        <CardHeader>
                            <Row>
                                <Col>
                                    <Popup
                                        trigger = {
                                            <Button style = {{width: "100%"}} tag = "button"
                                                    color = {"info"}>
                                                {i.student.ime + " " + i.student.prezime + " " + i.student.index}
                                            </Button>
                                        }
                                        modal
                                        closeOnDocumentClick>
                                        <div>
                                            <PrikazStudentovihDetalja id = {i.student.id}/>
                                        </div>
                                    </Popup>
                                </Col>
                                <Col>
                                    <Popup
                                        trigger = {
                                            <Button style = {{width: "100%"}} tag = "button"
                                                    color = {"info"}>
                                                {i.spirala.broj_spirale}
                                            </Button>
                                        }
                                        modal
                                        closeOnDocumentClick>
                                        <div>
                                            <PrikazDetaljaSpirale id = {i.spirala.id}/>
                                        </div>
                                    </Popup>
                                </Col>
                                <Col>
                                    <Button color = {"danger"}
                                            onClick = {() => {
                                                if (window.confirm('Da li ste sigurni da želite obrisati izvještaj?')) this.deleteReportFn(i.id)
                                            }}>Obriši</Button>
                                </Col>
                            </Row>
                        </CardHeader>
                    </Card>
                )

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
                        <h3>Izvještaji</h3>
                    </CardHeader>
                    <CardBody>
                        <Button color = {"success"} href = {"/grupnoKreiranjeIzvjestaja"}>Grupno kreiranje izvještaja</Button>
                        <Button color = {"success"} href = {"/pojedinacnoKreiranjeIzvjestaja"}>Pojedinačno kreiranje izvještaja</Button>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <Card>
                            <Row>
                                <Col>Student</Col>
                                <Col>Spirala</Col>
                                <Col></Col>
                            </Row>
                            {this.displayReports()}
                        </Card>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default PrikazIzvjestaja;