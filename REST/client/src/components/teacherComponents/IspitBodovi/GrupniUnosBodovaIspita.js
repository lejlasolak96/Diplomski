import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Col, CardFooter, Row, Input, Button, Table} from 'reactstrap';
import Moment from 'react-moment';
import {API_ROOT} from "../../../api-config";

import PrikazDetaljaIspita from '../Ispit/PrikazDetaljaIspita';

class GrupniUnosBodovaIspita extends Component {

    constructor(props) {
        super(props);
        this.state = {
            studenti: [],
            ispit_id: null,
            podaci: [],
            dodaniStudenti: [],
            ispiti: [],
            dobavljeniStudenti: [],
            error: null,
            ispit: null
        };
    }

    componentDidMount() {
        this.getExams();
        this.getStudents();
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
                if (data.studenti) this.setState({dobavljeniStudenti: data.studenti});
                if (data.error) this.setState({error: data.error});
            })
            .catch(err => {
                console.log(err);
            });
    }

    async getExams() {

        let ispiti = [];

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        await fetch(API_ROOT + '/ispiti', options)
            .then(result => result.json())
            .then(data => {
                if (data.ispiti) ispiti = data.ispiti;
            })
            .catch(err => {
                console.log(err);
            });

        let promises = [];

        await ispiti.map(ispit => {

            promises.push(
                fetch(API_ROOT + '/ispiti/' + ispit.id + '/vrstaIspita', options)
                    .then(result => result.json())
                    .then(data => {
                        if (data.vrstaIspita) ispit.vrstaIspita = data.vrstaIspita;
                    })
                    .catch(err => {
                        console.log(err);
                    })
            );
        });

        await Promise.all(promises)
            .then(() => {
                this.setState({ispiti: ispiti});
            });
    }

    getExamsFn = () => {

        return this.state.ispiti.map(s => {
            return (
                <option value = {s.id} key = {s.id}>{s.vrstaIspita.naziv + " " + s.datum_odrzavanja}</option>
            );
        });
    }

    submitPoints = (e) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        let variables = {
            ispit_id: this.state.ispit_id,
            podaci: this.state.podaci
        };

        const options = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/ispitBodovi/grupno', options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                }
                else alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    }

    deletePoints = (e) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        let variables = {
            ispit_id: this.state.ispit_id
        };

        const options = {
            method: 'DELETE',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/ispitBodovi/grupno', options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                }
                else alert(data.error);
            })
            .catch(err => {
                console.log(err);
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
                    bodovi: student.bodovi,
                    ocjena: student.ocjena
                }
            ]),
            studenti: this.state.studenti.concat([student.id]),
            podaci: this.state.podaci.concat([{student_id: student.id, bodovi: null, ocjena: null}])
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

    handleMarkValueChange = (idx) => (evt) => {
        const point = this.state.dodaniStudenti.map((e, sidx) => {
            if (idx !== sidx) return e;
            return {...e, ocjena: evt.target.value};
        });

        const point1 = this.state.podaci.map((e, sidx) => {
            if (idx !== sidx) return e;
            return {...e, ocjena: evt.target.value};
        });

        this.setState({dodaniStudenti: point, podaci: point1});
    }

    displayStudents() {

        if (this.state.dobavljeniStudenti.length !== 0) {

            return this.state.dobavljeniStudenti.map((student) => {
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
                        {this.state.error}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            );
        }
    }

    chooseExam(e) {

        this.setState({ispit_id: e.target.value});
    }

    render() {
        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardHeader>
                        <h2>Grupni unos bodova za ispit</h2>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col>
                                <Card>
                                    <CardHeader>
                                        <h4>Ispit</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <Input
                                            onChange = {this.chooseExam.bind(this)}
                                            style = {{marginBottom: "20px"}} type = {"select"}>
                                            <option selected = {true} disabled = {true}>Odaberite ispit</option>
                                            {this.getExamsFn()}
                                        </Input>
                                        {this.state.ispit_id ? <PrikazDetaljaIspita id = {this.state.ispit_id}/> : null}
                                    </CardBody>
                                    <CardFooter>
                                        <Button color = {"danger"}
                                                disabled = {!this.state.ispit_id}
                                                onClick = {this.deletePoints.bind(this)}
                                        >Obriši sve bodove za odabrani ispit</Button>
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
                                                        <td>
                                                            <Input
                                                                type = "number"
                                                                placeholder = {"Unesite osvojenu ocjenu (opcionalno)"}
                                                                value = {student.ocjena}
                                                                onChange = {this.handleMarkValueChange(i)}
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
                                disabled = {!this.state.ispit_id}
                                onClick = {this.submitPoints.bind(this)}>Kreiraj bodove</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }
}

export default GrupniUnosBodovaIspita;