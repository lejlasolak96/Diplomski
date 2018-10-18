import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, CardFooter, Input, Row, Button, Table} from 'reactstrap';
import Moment from 'react-moment';

import {getStudents, getSemesters, getGroup} from '../../../queries/queries';
import {deleteGroupsStudents, editGroupsStudents, editGroup} from '../../../mutations/mutations';

class UredjivanjeGrupe extends Component {

    constructor(props) {
        super(props);
        this.state = {
            studenti: [],
            naziv: null,
            semestar_id: null,
            broj_studenata: null,
            dodaniStudenti: null,
            showStudents: false,
            studentsIDs: []
        };
    }

    editGroupFn = async (id) => {

        let variables = {};

        variables.id = id;
        if (this.state.naziv) variables.naziv = this.state.naziv;
        if (this.state.semestar_id) variables.semestar_id = this.state.semestar_id;

        await this.props.editGroup({
            variables: variables
        })
            .then(function () {
                alert("Uspješno uređena grupa");
                window.location.reload();
            })
            .catch(function (error) {
                console.log(error.message);
            });
    }

    changeStudents = async (id) => {

        await this.props.editGroupsStudents({
            variables: {
                id: id,
                studenti: this.state.studenti
            }
        })
            .catch(function (error) {
                alert(error.message);
            });

        await this.props.editGroup({
            variables: {
                id: id,
                broj_studenata: this.state.studenti.length
            }
        })
            .then(function () {
                alert("Uspješno izmijenjeni studenti");
                window.location.reload();
            })
            .catch(function (error) {
                console.log(error.message);
            });

        this.setState({
            dodaniStudenti: null,
            studenti: [],
            broj_studenata: null,
            studentsIDs: [],
            showStudents: false
        });
    }

    deleteStudents = async (id) => {

        const message = await this.props.deleteGroupsStudents({
            variables: {
                id: id
            }
        })
            .then(function () {
                window.location.reload();
            })
            .catch(function (error) {
                console.log(error.message);
            });

        this.setState({
            dodaniStudenti: null,
            studenti: [],
            broj_studenata: null,
            studentsIDs: [],
            showStudents: false
        });

        alert(message.data.obrisiStudenteGrupe.message);
    };


    addStudentsClick = (studenti) => {

        if (!this.state.dodaniStudenti) this.setState({dodaniStudenti: studenti, broj_studenata: studenti.length});

        studenti.map((student) => {
            this.state.studenti.push({student_id: student.id});
            this.state.studentsIDs.push(student.id);
        });

        this.setState({showStudents: true});
    }

    addStudentClick = (student) => {

        this.setState({
            dodaniStudenti: this.state.dodaniStudenti.concat([student]),
            studenti: this.state.studenti.concat([{student_id: student.id}]),
            broj_studenata: this.state.broj_studenata + 1,
            studentsIDs: this.state.studentsIDs.concat([student.id])
        });
    }

    removeStudentClick = (idx) => () => {
        this.setState({
            dodaniStudenti: this.state.dodaniStudenti.filter((s, sidx) => idx !== sidx),
            studentsIDs: this.state.studentsIDs.filter((s, sidx) => idx !== sidx),
            studenti: this.state.studenti.filter((s, sidx) => idx !== sidx),
            broj_studenata: this.state.broj_studenata - 1
        });
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
                            <td>
                                <Button color = {"primary"}
                                        disabled = {this.state.studentsIDs.indexOf(student.id) !== -1}
                                        onClick = {() => {
                                            this.addStudentClick(student)
                                        }}>Dodaj
                                </Button>
                            </td>
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

    displaySemesters(grupa) {

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
                                semestar.id === grupa.semestar.id && this.state.semestar_id === null ?
                                    <td><Button color = {"success"}
                                                disabled = {true}
                                                onClick = {() => {
                                                    this.setState({semestar_id: semestar.id})
                                                }}>Trenutni</Button></td>
                                    :
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
                    <Card>
                        <CardHeader>
                            <Row>{data.error.message}</Row>
                        </CardHeader>
                    </Card>
                );
            }
        }
    }

    displayGroup() {

        const {grupa} = this.props.getGroup;

        if (grupa) {

            return (
                <Card>
                    <CardBody>
                        <Card>
                            <CardHeader>
                                <h4>Podaci o grupi</h4>
                            </CardHeader>
                            <CardBody>
                                <div style = {{marginBottom: "20px"}}>
                                    <label style = {{marginRight: "20px"}}>Naziv grupe: </label>
                                    <Input
                                        value = {this.state.naziv ? this.state.naziv : grupa.naziv}
                                        onChange = {(e) => {
                                            this.setState({naziv: e.target.value})
                                        }}/>
                                </div>
                                <div>
                                    <label>Semestar: </label>
                                    <Table hover = {true} bordered = {true} responsive = {true}>
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
                                        {this.displaySemesters(grupa)}
                                        </tbody>
                                    </Table>
                                </div>
                            </CardBody>
                            <CardFooter>
                                <Button color = {"success"}
                                        onClick = {() => {
                                            this.editGroupFn(grupa.id)
                                        }}
                                        disabled = {!this.state.naziv && !this.state.semestar_id}>Sačuvaj
                                                                                                  promjene</Button>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader>
                                <h4>Studenti grupe</h4>
                            </CardHeader>
                            <CardBody>
                                <Table hover = {true} striped = {true} responsive = {true}>
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
                                    {
                                        !this.state.dodaniStudenti ?
                                            grupa.studenti.map((student, i) => {
                                                return (
                                                    <tr key = {i + 1}>
                                                        <td>{student.id}</td>
                                                        <td>{student.ime}</td>
                                                        <td>{student.prezime}</td>
                                                        <td>{student.index}</td>
                                                    </tr>
                                                );
                                            })
                                            :
                                            this.state.dodaniStudenti.map((student, i) => {
                                                return (
                                                    <tr key = {i + 1}>
                                                        <td>{student.id}</td>
                                                        <td>{student.ime}</td>
                                                        <td>{student.prezime}</td>
                                                        <td>{student.index}</td>
                                                        <td>
                                                            <Button color = {"danger"}
                                                                    onClick = {this.removeStudentClick(i)}>Ukloni
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                    }
                                    </tbody>
                                </Table>
                                <div>
                                    <label>Broj studenata: {!this.state.broj_studenata ?
                                        grupa.broj_studenata : this.state.broj_studenata}
                                    </label>
                                </div>
                                <div>
                                    <Button color = {"danger"}
                                            onClick = {() => {
                                                if (window.confirm('Da li ste sigurni da želite obrisati sve studente iz grupe? '))
                                                    this.deleteStudents(grupa.id)
                                            }}>Obriši sve studente</Button>
                                    {
                                        this.state.showStudents ?
                                            <Button onClick = {() => {
                                                this.setState({showStudents: false})
                                            }}>Odustani</Button>
                                            :
                                            <Button color = {"primary"} onClick = {() => {
                                                this.addStudentsClick(grupa.studenti)
                                            }}>Dodaj nove studente</Button>
                                    }
                                </div>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                {this.state.showStudents ?
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
                                    : null}
                            </CardBody>
                            <CardFooter>
                                <Button color = {"success"}
                                        onClick = {() => {
                                            this.changeStudents(grupa.id)
                                        }}
                                        disabled = {!this.state.dodaniStudenti}>Sačuvaj promjene</Button>
                            </CardFooter>
                        </Card>
                    </CardBody>
                </Card>
            );
        }
    }

    render() {
        return (
            <div className = "animated fadeIn">
                {this.displayGroup()}
            </div>
        );
    }
}

export default compose(
    graphql(getGroup,
        {
            name: "getGroup",
            options: (props) => {
                return {
                    variables: {
                        id: props.match.params.id
                    }
                }
            }
        }
    ),
    graphql(getStudents,
        {
            name: "getStudents"
        }),
    graphql(getSemesters,
        {
            name: "getSemesters"
        }),
    graphql(deleteGroupsStudents,
        {
            name: "deleteGroupsStudents"
        }
    ),
    graphql(editGroupsStudents,
        {
            name: "editGroupsStudents"
        }
    ),
    graphql(editGroup,
        {
            name: "editGroup"
        }
    )
)(UredjivanjeGrupe);