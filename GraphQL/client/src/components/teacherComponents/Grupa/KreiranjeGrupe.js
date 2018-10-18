import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, Input, Col, CardFooter, Row, Button, Table} from 'reactstrap';
import Moment from 'react-moment';

import {getStudents, getSemesters} from '../../../queries/queries';
import {createGroup} from '../../../mutations/mutations';

class KreiranjeGrupe extends Component {

    constructor(props) {
        super(props);
        this.state = {
            studenti: [],
            naziv: null,
            semestar_id: null,
            broj_studenata: 0,
            dodaniStudenti: []
        };
    }

    submitGroup = async (e) => {

        if (!this.state.semestar_id || !this.state.naziv) alert("Niste popunili sva polja");

        else {
            await this.props.createGroup({
                variables: {
                    naziv: this.state.naziv,
                    broj_studenata: this.state.broj_studenata,
                    studenti: this.state.studenti,
                    semestar_id: this.state.semestar_id
                }
            })
                .then(function () {
                    alert("Uspješno kreirana grupa");
                    window.location.reload();
                })
                .catch(function (error) {
                    alert(error.message);
                });
        }
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

        let data = this.props.getSemesters;

        if (data && !data.loading) {
            if (data.semestri) {

                return data.semestri.map((semestar) => {

                    return (
                        <tr key = {semestar.id}>
                            <td>{semestar.id}</td>
                            <td>{semestar.naziv}</td>
                            <td>{semestar.redni_broj}</td>
                            <td><Moment date = {semestar.pocetak} format = {"DD/MM/YYYY"}/></td>
                            <td><Moment date = {semestar.kraj} format = {"DD/MM/YYYY"}/></td>
                            <td>{semestar.akademskaGodina.naziv}</td>
                            {
                                !this.state.semestar_id || this.state.semestar_id != semestar.id ?
                                    <td><Button color = {"primary"}
                                                disabled = {this.state.semestar_id && this.state.semestar_id != semestar.id}
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
                    <Card>
                        <CardHeader>
                            <Row>{data.error.message}</Row>
                        </CardHeader>
                    </Card>
                );
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
                                        }}>Dodaj</Button></td>
                        </tr>
                    );
                });
            }
            else {
                return (
                    <Card>
                        <CardHeader>
                            <Row>{data.error.message}</Row>
                        </CardHeader>
                    </Card>
                );
            }
        }
    }

    render() {
        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardHeader>
                        <h1>Nova grupa</h1>
                    </CardHeader>
                    <CardBody>
                        <h4>Podaci o grupi</h4>
                        <Card>
                            <CardBody>
                                <div style = {{marginBottom: "20px"}}>
                                    <label style = {{marginRight: "20px"}}>Naziv grupe: </label>
                                    <Input onChange = {(e) => {
                                        this.setState({naziv: e.target.value})
                                    }}/>
                                </div>
                                <div>
                                    <label>Semestar: </label>
                                    <Table hover = {true} bordered = {true} responsive={true}>
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
                            <CardBody>
                                <h4>Studenti</h4>
                                <Table hover = {true} striped = {true} responsive={true}>
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
                            <CardBody>
                                <h4>Dodani studenti</h4>
                                <Table hover = {true} striped = {true} responsive={true}>
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

export default compose(
    graphql(createGroup,
        {
            name: "createGroup"
        }),
    graphql(getStudents,
        {
            name: "getStudents"
        }),
    graphql(getSemesters,
        {
            name: "getSemesters"
        })
)(KreiranjeGrupe);