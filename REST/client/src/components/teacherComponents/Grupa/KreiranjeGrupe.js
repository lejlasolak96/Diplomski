import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Input, Col, CardFooter, Row, Button, Table} from 'reactstrap';
import Moment from 'react-moment';
import {API_ROOT} from "../../../api-config";

class KreiranjeGrupe extends Component {

    constructor(props) {
        super(props);
        this.state = {
            studenti: [],
            naziv: null,
            semestar_id: null,
            broj_studenata: 0,
            dodaniStudenti: [],
            dobavljeniStudenti: [],
            error: null,
            semError: null,
            semestri: []
        };
    }

    componentDidMount() {
        this.getStudents();
        this.getSemesters();
    }

    async getSemesters() {

        let semestri = [];

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        await fetch(API_ROOT + '/semestri', options)
            .then(result => result.json())
            .then(data => {
                if (data.semestri) semestri = data.semestri;
                if (data.error) this.setState({semError: data.error});
            })
            .catch(err => {
                console.log(err);
            });

        let promises = [];

        semestri.map(semestar => {

            promises.push(
                fetch(API_ROOT + '/semestri/' + semestar.id + '/akademskaGodina', options)
                    .then(result => result.json())
                    .then(data => {
                        if (data.akademskaGodina) semestar.akademskaGodina = data.akademskaGodina;
                    })
                    .catch(err => {
                        console.log(err);
                    })
            );
        });

        await Promise.all(promises)
            .then(() => {
                this.setState({semestri: semestri});
            });
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

    submitGroup = (e) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        let variables = {
            naziv: this.state.naziv,
            broj_studenata: this.state.broj_studenata,
            studenti: this.state.studenti,
            semestar_id: this.state.semestar_id
        };

        const options = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/grupe', options)
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
            dodaniStudenti: this.state.dodaniStudenti.concat([student]),
            studenti: this.state.studenti.concat([{student_id: student.id}]),
            broj_studenata: this.state.broj_studenata + 1
        });
    }

    removeStudentClick = (idx) => () => {
        this.setState({
            dodaniStudenti: this.state.dodaniStudenti.filter((s, sidx) => idx !== sidx),
            studenti: this.state.studenti.filter((s, sidx) => idx !== sidx),
            broj_studenata: this.state.broj_studenata - 1
        });
    }

    displaySemesters() {

        if (this.state.semestri.length !== 0) {

            return this.state.semestri.map((semestar, i) => {

                return (
                    <tr key = {semestar.id}>
                        <td>{semestar.id}</td>
                        <td>{semestar.naziv}</td>
                        <td>{semestar.redni_broj}</td>
                        <td><Moment date = {semestar.pocetak} format = {"DD/MM/YYYY"}/></td>
                        <td><Moment date = {semestar.kraj} format = {"DD/MM/YYYY"}/></td>
                        <td>{semestar.akademskaGodina.naziv}</td>
                        {
                            !this.state.semestar_id || this.state.semestar_id !== semestar.id ?
                                <td><Button color = {"primary"}
                                            disabled = {this.state.semestar_id && this.state.semestar_id !== semestar.id}
                                            onClick = {() => {
                                                this.setState({semestar_id: semestar.id})
                                            }}>Odaberi</Button></td>
                                :
                                <td><Button onClick = {() => {
                                    this.setState({semestar_id: null})
                                }}>Poništi</Button></td>
                        }
                    </tr>
                );
            });
        }
        else {
            return (
                <tr>
                    <td>{this.state.semError}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            );
        }
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
                                    disabled = {this.state.dodaniStudenti.indexOf(student) !== -1}
                                    onClick = {() => {
                                        this.addStudentClick(student)
                                    }}>Dodaj</Button></td>
                    </tr>
                );
            });
        }
        else {
            return (
                <tr>
                    <td>{this.state.semError}</td>
                    <td></td>
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
                        <h3>Nova grupa</h3>
                    </CardHeader>
                    <CardBody>
                        <Card>
                            <CardHeader>
                                <h4>Podaci o grupi</h4>
                            </CardHeader>
                            <CardBody>
                                <div style = {{marginBottom: "20px"}}>
                                    <label style = {{marginRight: "20px"}}>Naziv grupe: </label>
                                    <Input onChange = {(e) => {
                                        this.setState({naziv: e.target.value})
                                    }}/>
                                </div>
                                <div>
                                    <label>Semestar: </label>
                                    <Table
                                        hover = {true}
                                        responsive={true}
                                        bordered = {true}>
                                        <thead style = {{fontSize: "14pt"}}>
                                        <tr>
                                            <td>ID</td>
                                            <td>Naziv</td>
                                            <td>Redni broj</td>
                                            <td>Početak</td>
                                            <td>Kraj</td>
                                            <td>Akademska godina</td>
                                            <td></td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.displaySemesters()}
                                        </tbody>
                                    </Table>
                                </div>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardHeader>
                                <h4>Studenti</h4>
                            </CardHeader>
                            <CardBody>
                                <Table
                                    hover = {true}
                                    striped = {true}
                                    responsive={true}>
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
                        <Card>
                            <CardHeader>
                                <h4>Dodani studenti</h4>
                            </CardHeader>
                            <CardBody>
                                <Table
                                    hover = {true}
                                    striped = {true}
                                    responsive={true}>
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
                                                <td><Button color = {"danger"} onClick = {this.removeStudentClick(i)}>Ukloni</Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </Table>
                                <label>Broj studenata: {this.state.broj_studenata}</label>
                            </CardBody>
                        </Card>
                    </CardBody>
                    <CardFooter>
                        <Button color = {"success"} onClick = {this.submitGroup.bind(this)}>Kreiraj grupu</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }
}

export default KreiranjeGrupe;