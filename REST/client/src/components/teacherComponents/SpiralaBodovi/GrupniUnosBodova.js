import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Col, CardFooter, Row, Input, Button, Table} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

import PrikazDetaljaSpirale from '../Spirala/PrikazDetaljaSpirale';

class GrupniUnosBodova extends Component {

    constructor(props) {
        super(props);
        this.state = {
            studenti: [],
            spirala_id: null,
            podaci: [],
            dodaniStudenti: [],
            spirale: [],
            dobavljeniStudenti: [],
            error: null
        };
    }

    componentDidMount() {
        this.getHomeworks();
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
            })
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
            podaci: this.state.podaci
        };

        const options = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/spiralaBodovi/grupno', options)
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
            spirala_id: this.state.spirala_id
        };

        const options = {
            method: 'DELETE',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/spiralaBodovi/grupno', options)
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
                                        {this.state.spirala_id ? <PrikazDetaljaSpirale id = {this.state.spirala_id}/> : null}
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

export default GrupniUnosBodova;