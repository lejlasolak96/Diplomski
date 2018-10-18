import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Input, CardFooter, Row, Button, Table} from 'reactstrap';
import Moment from 'react-moment';
import {API_ROOT} from "../../../api-config";

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
            studentsIDs: [],
            grupa: null,
            semestri: [],
            error: null,
            semError: null,
            dobavljeniStudenti: []
        };
    }

    componentDidMount() {
        this.getStudents();
        this.getSemesters();
        this.getGroup();
    }

    async getGroup() {

        let grupa = {};

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        await fetch(API_ROOT + '/grupe/' + this.props.match.params.id, options)
            .then(result => result.json())
            .then(data => {
                if (data.grupa) grupa = data.grupa;
            })
            .catch(err => {
                console.log(err);
            });

        await fetch(API_ROOT + '/grupe/' + this.props.match.params.id + '/semestar', options)
            .then(result => result.json())
            .then(data => {
                if (data.semestar) grupa.semestar = data.semestar;
            })
            .catch(err => {
                console.log(err);
            });

        await fetch(API_ROOT + '/semestri/' + grupa.semestar.id + '/akademskaGodina', options)
            .then(result => result.json())
            .then(data => {
                if (data.akademskaGodina) grupa.semestar.akademskaGodina = data.akademskaGodina;
            })
            .catch(err => {
                console.log(err);
            });

        await fetch(API_ROOT + '/grupe/' + this.props.match.params.id + '/studenti', options)
            .then(result => result.json())
            .then(data => {
                console.log(data);
                if (data.studenti) grupa.studenti = data.studenti;
            })
            .catch(err => {
                console.log(err);
            });

        this.setState({grupa: grupa});
        console.log(grupa);
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

    editGroupFn = (id) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        let variables = {};

        if (this.state.naziv) variables.naziv = this.state.naziv;
        if (this.state.semestar_id) variables.semestar_id = this.state.semestar_id;

        const options = {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/grupe/' + id, options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    this.getGroup();
                    alert(data.message);
                }
                else alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    }

    changeStudents = (id) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        //promjena studenata grupe

        let variables = {
            studenti: this.state.studenti
        };

        let options = {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/grupe/' + id + '/studenti', options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    this.setState({
                        dodaniStudenti: null,
                        studenti: [],
                        broj_studenata: null,
                        studentsIDs: [],
                        showStudents: false
                    });
                    this.getGroup();
                    alert(data.message);
                }
                else alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });

        //promjena broja studenata grupe

        variables = {
            broj_studenata: this.state.studenti.length
        };

        options.body = JSON.stringify(variables);

        fetch(API_ROOT + '/grupe/' + id, options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    console.log(data.message);
                }
                else console.log(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    }

    deleteStudents = (id) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        //brisanje studenata

        let options = {
            method: 'DELETE',
            headers: myHeaders
        };

        fetch(API_ROOT + '/grupe/' + id + '/studenti', options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    this.setState({
                        dodaniStudenti: null,
                        studenti: [],
                        broj_studenata: null,
                        studentsIDs: [],
                        showStudents: false
                    });
                    this.getGroup();
                    alert(data.message);
                }
                else alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });

        //promjena broja studenata grupe na 0

        let variables = {
            broj_studenata: 0
        };

        options = {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/grupe/' + id, options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    console.log(data.message);
                }
                else console.log(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    }

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

        if (this.state.dobavljeniStudenti.length !== 0) {

            return this.state.dobavljeniStudenti.map((student) => {

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
                        <Row>{this.state.error}</Row>
                    </CardHeader>
                </Card>
            );
        }
    }

    displaySemesters(grupa) {

        if (this.state.semestri.length !== 0) {

            return this.state.semestri.map((semestar) => {

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
                        <Row>{this.state.semError}</Row>
                    </CardHeader>
                </Card>
            );
        }
    }

    displayGroup() {

        const {grupa} = this.state;

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

export default UredjivanjeGrupe;