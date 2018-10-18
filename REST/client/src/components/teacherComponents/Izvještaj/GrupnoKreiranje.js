import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Col, CardFooter, Row, Input, Button, Table} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

import PrikazDetaljaSpirale from '../Spirala/PrikazDetaljaSpirale';

class GrupnoKreiranje extends Component {

    constructor(props) {
        super(props);
        this.state = {
            studenti: [],
            spirale: [],
            spirala_id: null,
            dodaniStudenti: [],
            error: null,
            prikupljeniStudenti: []
        };
    }

    componentDidMount() {
        this.getHomeworks();
        this.getStudents();
    }

    getHomeworks() {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/spirale', options)
            .then(result => result.json())
            .then(data => {
                if (data.spirale) this.setState({spirale: data.spirale});
            })
            .catch(err => {
                console.log(err);
            })
    }

    getStudents() {

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
                if (data.studenti) this.setState({prikupljeniStudenti: data.studenti});
                if (data.error) this.setState({error: data.error});
            })
            .catch(err => {
                console.log(err);
            })
    }

    getHomeworksFn = () => {

        return this.state.spirale.map(s => {
            return (
                <option value = {s.id} key = {s.id}>{"Spirala " + s.broj_spirale}</option>
            );
        });
    }

    submitPoints = (e) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        let variables = {
            spirala_id: this.state.spirala_id,
            studenti: this.state.studenti
        };

        const options = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/izvjestaji/grupno', options)
            .then(result => result.json())
            .then(data => {
                if (data.message) alert(data.message);
                else alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    }

    addStudentClick = (student) => {

        this.setState({
            dodaniStudenti: this.state.dodaniStudenti.concat([student]),
            studenti: this.state.studenti.concat([{student_id: student.id}]),
        });
    }

    removeStudentClick = (idx) => {

        this.setState({
            dodaniStudenti: this.state.dodaniStudenti.filter((s, sidx) => idx !== sidx),
            studenti: this.state.studenti.filter((s, sidx) => idx !== sidx),
        });
    }

    displayStudents() {

        if (this.state.prikupljeniStudenti.length !== 0) {

            return this.state.prikupljeniStudenti.map((student) => {

                return (
                    <tr key = {student.id}>
                        <td>{student.id}</td>
                        <td>{student.ime}</td>
                        <td>{student.prezime}</td>
                        <td>{student.index}</td>
                        <td><Button color = {"primary"}
                                    disabled = {this.state.dodaniStudenti.indexOf(student) !== -1}
                                    onClick = {() => {
                                        this.addStudentClick(student)
                                    }}>+</Button></td>
                    </tr>
                );
            });
        }
        else {
            return (
                <tr>
                    <td>
                        {this.state.error}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            );
        }
    }

    render() {
        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardHeader>
                        <h2>Grupno kreiranje izvještaja</h2>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col>
                                <Card>
                                    <CardHeader>
                                        <h4>Spirala</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <Input
                                            onChange = {(e) => {
                                                this.setState({spirala_id: e.target.value})
                                            }}
                                            style = {{marginBottom: "20px"}} type = {"select"}>
                                            <option selected = {true} default = {true}>Odaberite spiralu</option>
                                            {this.getHomeworksFn()}
                                        </Input>
                                        {this.state.spirala_id ? <PrikazDetaljaSpirale id = {this.state.spirala_id}/> : null}
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col>
                                <Card>
                                    <CardHeader>
                                        <h4>Studenti</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <Table hover = {true} striped = {true}>
                                            <thead style = {{fontSize: "14pt"}}>
                                            <tr>
                                                <td>ID</td>
                                                <td>Ime</td>
                                                <td>Prezime</td>
                                                <td>Index</td>
                                                <td></td>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {this.displayStudents()}
                                            </tbody>
                                        </Table>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card>
                                    <CardHeader>
                                        <h4>Odabrani studenti</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <Table hover = {true} striped = {true}>
                                            <thead style = {{fontSize: "14pt"}}>
                                            <tr>
                                                <td>ID</td>
                                                <td>Ime</td>
                                                <td>Prezime</td>
                                                <td>Index</td>
                                                <td></td>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {this.state.dodaniStudenti.map((student, i) => {
                                                return (
                                                    <tr key = {i + 1}>
                                                        <td>{student.id}</td>
                                                        <td>{student.ime}</td>
                                                        <td>{student.prezime}</td>
                                                        <td>{student.index}</td>
                                                        <td><Button color = {"danger"} onClick = {() => {
                                                            this.removeStudentClick(i)
                                                        }}>-</Button></td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </Table>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter>
                        <Button color = {"success"}
                                disabled = {!this.state.spirala_id}
                                onClick = {this.submitPoints.bind(this)}>Kreiraj izvještaje</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }
}

export default GrupnoKreiranje;