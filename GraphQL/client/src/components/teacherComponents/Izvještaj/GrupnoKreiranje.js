import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, Col, CardFooter, Row, Input, Button, Table} from 'reactstrap';

import {getStudents, getHomeworks} from '../../../queries/queries';
import {groupCreateReport} from '../../../mutations/mutations';

import PrikazDetaljaSpirale from '../Spirala/PrikazDetaljaSpirale';

class GrupnoKreiranje extends Component {

    constructor(props) {
        super(props);
        this.state = {
            studenti: [],
            spirala_id: null,
            dodaniStudenti: []
        };
    }

    submitPoints = (e) => {

        this.props.groupCreateReport({
            variables: {
                spirala_id: this.state.spirala_id,
                studenti: this.state.studenti
            }
        })
            .then(function () {
                alert("Uspješno kreirani izvještaji");
                window.location.reload();
            })
            .catch(function (error) {
                alert(error.message);
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

    getHomeworksFn = () => {

        let data = this.props.getHomeworks;

        if (!data.loading) {
            if (data.spirale) {
                return data.spirale.map(s => {
                    return (
                        <option value = {s.id} key = {s.id}>{"Spirala " + s.broj_spirale}</option>
                    );
                });
            } else {
                return null;
            }
        }
    }

    displayStudents() {

        let data = this.props.getStudents;

        if (data && !data.loading) {
            if (data.studenti) {

                return data.studenti.map((student) => {

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
                            {data.error.message}
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                );
            }
        }
    }

    render() {
        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardHeader>
                        <h2>Grupni unos bodova za spiralu</h2>
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
                                        <PrikazDetaljaSpirale id = {this.state.spirala_id}/>
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

export default compose(
    graphql(getStudents,
        {
            name: "getStudents"
        }),
    graphql(getHomeworks,
        {
            name: "getHomeworks"
        }),
    graphql(groupCreateReport,
        {
            name: "groupCreateReport"
        })
)(GrupnoKreiranje);