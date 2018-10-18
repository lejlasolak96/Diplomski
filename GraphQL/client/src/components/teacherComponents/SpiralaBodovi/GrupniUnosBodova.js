import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, Col, CardFooter, Row, Input, Button, Table} from 'reactstrap';

import {getStudents, getHomeworks} from '../../../queries/queries';
import {groupCreateHomeworkPoints, groupDeleteHomeworkPoints} from '../../../mutations/mutations';

import PrikazDetaljaSpirale from '../Spirala/PrikazDetaljaSpirale';

class GrupniUnosBodova extends Component {

    constructor(props) {
        super(props);
        this.state = {
            studenti: [],
            spirala_id: null,
            podaci: [],
            dodaniStudenti: []
        };
    }

    submitPoints = (e) => {

        this.props.groupCreateHomeworkPoints({
            variables: {
                spirala_id: this.state.spirala_id,
                podaci: this.state.podaci
            }
        })
            .then(function () {
                alert("Uspješno kreirani bodovi");
                window.location.reload();
            })
            .catch(function (error) {
                alert(error.message);
            });
    }

    deletePoints = (e) => {

        this.props.groupDeleteHomeworkPoints({
            variables: {
                spirala_id: this.state.spirala_id
            }
        })
            .then(function () {
                alert("Uspješno obrisani bodovi");
                window.location.reload();
            })
            .catch(function (error) {
                alert(error.message);
            });
    }

    addStudentClick = (student) => {

        this.setState({
            dodaniStudenti: this.state.dodaniStudenti.concat([
                {
                    id: student.id,
                    ime: student.ime,
                    prezime: student.prezime,
                    index: student.index,
                    bodovi: student.bodovi
                }
            ]),
            studenti: this.state.studenti.concat([student.id]),
            podaci: this.state.podaci.concat([{student_id: student.id, bodovi: null}])
        });
    }

    removeStudentClick = (idx) => {

        this.setState({
            dodaniStudenti: this.state.dodaniStudenti.filter((s, sidx) => idx !== sidx),
            studenti: this.state.studenti.filter((s, sidx) => idx !== sidx),
            podaci: this.state.podaci.filter((s, sidx) => idx !== sidx)
        });
    }

    handlePointsValueChange = (idx) => (evt) => {
        const point = this.state.dodaniStudenti.map((e, sidx) => {
            if (idx !== sidx) return e;
            return {...e, bodovi: evt.target.value};
        });

        const point1 = this.state.podaci.map((e, sidx) => {
            if (idx !== sidx) return e;
            return {...e, bodovi: evt.target.value};
        });

        this.setState({dodaniStudenti: point, podaci: point1});
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
                                        disabled = {this.state.studenti.indexOf(student.id) !== -1}
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
                                            <option selected = {true} disabled = {true}>Odaberite spiralu</option>
                                            {this.getHomeworksFn()}
                                        </Input>
                                        <PrikazDetaljaSpirale id = {this.state.spirala_id}/>
                                    </CardBody>
                                    <CardFooter>
                                        <Button color = {"danger"}
                                                disabled = {!this.state.spirala_id}
                                                onClick = {this.deletePoints.bind(this)}
                                        >Obriši sve bodove za odabranu spiralu</Button>
                                    </CardFooter>
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
                                                        <td>
                                                            <Input
                                                                type = "number"
                                                                placeholder = {"Unesite osvojene bodove"}
                                                                value = {student.bodovi}
                                                                onChange = {this.handlePointsValueChange(i)}
                                                            />
                                                        </td>
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
                                onClick = {this.submitPoints.bind(this)}>Kreiraj bodove</Button>
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
    graphql(groupCreateHomeworkPoints,
        {
            name: "groupCreateHomeworkPoints"
        }),
    graphql(groupDeleteHomeworkPoints,
        {
            name: "groupDeleteHomeworkPoints"
        })
)(GrupniUnosBodova);