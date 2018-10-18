import React, {Component} from 'react';
import {Card, CardBody, CardHeader, CardFooter, Input, Row, Col, Button, Table} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

class UredjivanjeSpiska extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listFields: [],
            spirala_id: null,
            spirale: [],
            studenti: [],
            spisak: []
        };
    }

    componentDidMount() {
        this.getHomeworks();
        this.getStudents();
        this.getList();
    }

    getList() {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/search/spiskovi?spirala_id=' + this.props.match.params.spirala_id, options)
            .then(result => result.json())
            .then(data => {
                if (data.spisak) this.setState({spisak: data.spisak});
            })
            .catch(err => {
                console.log(err);
            });
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
                if (data.studenti) this.setState({studenti: data.studenti});
            })
            .catch(err => {
                console.log(err);
            })
    }

    getStudentsFn = (id) => {

        return this.state.studenti.map(s => {
            return (
                <option value = {s.id} selected = {s.id === id}
                        key = {s.id}>{s.ime + " " + s.prezime + " " + s.index}</option>
            );
        });
    }

    handleReviewerValueChange = (idx) => (evt) => {

        const list = this.state.listFields.map((e, sidx) => {
            if (idx !== sidx) return e;
            return {...e, ocjenjivac: evt.target.value};
        });

        this.setState({listFields: list});
    }

    handleReviewedAValueChange = (idx) => (evt) => {

        const list = this.state.listFields.map((e, sidx) => {
            if (idx !== sidx) return e;
            return {...e, studentA: evt.target.value};
        });

        this.setState({listFields: list});
    }

    handleReviewedBValueChange = (idx) => (evt) => {

        const list = this.state.listFields.map((e, sidx) => {
            if (idx !== sidx) return e;
            return {...e, studentB: evt.target.value};
        });

        this.setState({listFields: list});
    }

    handleReviewedCValueChange = (idx) => (evt) => {

        const list = this.state.listFields.map((e, sidx) => {
            if (idx !== sidx) return e;
            return {...e, studentC: evt.target.value};
        });

        this.setState({listFields: list});
    }

    handleReviewedDValueChange = (idx) => (evt) => {

        const list = this.state.listFields.map((e, sidx) => {
            if (idx !== sidx) return e;
            return {...e, studentD: evt.target.value};
        });

        this.setState({listFields: list});
    }

    handleReviewedEValueChange = (idx) => (evt) => {

        const list = this.state.listFields.map((e, sidx) => {
            if (idx !== sidx) return e;
            return {...e, studentE: evt.target.value};
        });

        this.setState({listFields: list});
    }

    handleAddListField = () => {

        this.setState({
            listFields: this.state.listFields.concat([{
                ocjenjivac: null,
                studentA: null,
                studentB: null,
                studentC: null,
                studentD: null,
                studentE: null
            }])
        });
    }

    handleRemoveListField = (idx) => () => {
        this.setState({
            listFields: this.state.listFields.filter((s, sidx) => idx !== sidx)
        });
    }

    submitList = async (e) => {

        let redovi = [];

        this.setState({
            listFields: this.state.listFields.filter((s) => s)
        });

        await this.state.listFields.map((red) => {

            redovi = redovi.concat([
                {
                    ocjenjivac_id: red.ocjenjivac,
                    ocjenjeni_id: red.studentA,
                    sifra_studenta: "A",
                    spirala_id: this.state.spirala_id
                },
                {
                    ocjenjivac_id: red.ocjenjivac,
                    ocjenjeni_id: red.studentB,
                    sifra_studenta: "B",
                    spirala_id: this.state.spirala_id
                },
                {
                    ocjenjivac_id: red.ocjenjivac,
                    ocjenjeni_id: red.studentC,
                    sifra_studenta: "C",
                    spirala_id: this.state.spirala_id
                },
                {
                    ocjenjivac_id: red.ocjenjivac,
                    ocjenjeni_id: red.studentD,
                    sifra_studenta: "D",
                    spirala_id: this.state.spirala_id
                },
                {
                    ocjenjivac_id: red.ocjenjivac,
                    ocjenjeni_id: red.studentE,
                    sifra_studenta: "E",
                    spirala_id: this.state.spirala_id
                }
            ]);
        });

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        let variables = {
            spisak: redovi,
            spirala_id: this.state.spirala_id
        };

        const options = {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/spiskovi', options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    this.getList();
                    alert(data.message);
                }
                else alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    }

    getData = async () => {

        let redovi = [];

        if (this.state.spisak.length !== 0) {
            await this.state.spisak.map(s => {

                if (redovi[s.ocjenjivac.id] === undefined) redovi[s.ocjenjivac.id] = {};
                redovi[s.ocjenjivac.id].ocjenjivac = s.ocjenjivac.id;
                if (s.sifra_studenta === "A") redovi[s.ocjenjivac.id].studentA = s.ocjenjeni.id;
                else if (s.sifra_studenta === "B") redovi[s.ocjenjivac.id].studentB = s.ocjenjeni.id;
                else if (s.sifra_studenta === "C") redovi[s.ocjenjivac.id].studentC = s.ocjenjeni.id;
                else if (s.sifra_studenta === "D") redovi[s.ocjenjivac.id].studentD = s.ocjenjeni.id;
                else if (s.sifra_studenta === "E") redovi[s.ocjenjivac.id].studentE = s.ocjenjeni.id;
            });

            this.setState({spirala_id: this.state.spisak[0].spirala.id, listFields: redovi});
        }
    }

    display() {

        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardBody>
                        {
                            this.state.listFields.length === 0 ?
                                <Button color = {"primary"}
                                        onClick = {this.getData.bind(this)}
                                >Učitaj spisak</Button>
                                :
                                <Button onClick = {this.getData.bind(this)}
                                >Poništi promjene</Button>
                        }
                        <Table
                            responsive = {true}
                            bordered = {true}
                            striped = {true}
                            hover = {true}>
                            <thead>
                            <tr>
                                <td>Ocjenjivač</td>
                                <td>Student A</td>
                                <td>Student B</td>
                                <td>Student C</td>
                                <td>Student D</td>
                                <td>Student E</td>
                                <td><Button color = "primary"
                                            onClick = {() => {
                                    this.handleAddListField()
                                }}>+</Button></td>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.listFields.map((list, idx) => (
                                <tr key = {idx + 1}>
                                    <td>
                                        <Input type = {"select"} onChange = {this.handleReviewerValueChange(idx)}>
                                            {!list.ocjenjivac ?
                                                <option selected = {true} disabled = {true}>Odaberite studenta</option>
                                                :
                                                null
                                            }
                                            {this.getStudentsFn(list.ocjenjivac)}
                                        </Input>
                                    </td>
                                    <td>
                                        <Input type = {"select"} onChange = {this.handleReviewedAValueChange(idx)}>
                                            {!list.studentA ?
                                                <option selected = {true} disabled = {true}>Odaberite studenta</option>
                                                :
                                                null
                                            }
                                            {this.getStudentsFn(list.studentA)}
                                        </Input>
                                    </td>
                                    <td>
                                        <Input type = {"select"} onChange = {this.handleReviewedBValueChange(idx)}>
                                            {!list.studentB ?
                                                <option selected = {true} disabled = {true}>Odaberite studenta</option>
                                                :
                                                null
                                            }
                                            {this.getStudentsFn(list.studentB)}
                                        </Input>
                                    </td>
                                    <td>
                                        <Input type = {"select"} onChange = {this.handleReviewedCValueChange(idx)}>
                                            {!list.studentC ?
                                                <option selected = {true} disabled = {true}>Odaberite studenta</option>
                                                :
                                                null
                                            }
                                            {this.getStudentsFn(list.studentC)}
                                        </Input>
                                    </td>
                                    <td>
                                        <Input type = {"select"} onChange = {this.handleReviewedDValueChange(idx)}>
                                            {!list.studentD ?
                                                <option selected = {true} disabled = {true}>Odaberite studenta</option>
                                                :
                                                null
                                            }
                                            {this.getStudentsFn(list.studentD)}
                                        </Input>
                                    </td>
                                    <td>
                                        <Input type = {"select"} onChange = {this.handleReviewedEValueChange(idx)}>
                                            {!list.studentE ?
                                                <option selected = {true} disabled = {true}>Odaberite studenta</option>
                                                :
                                                null
                                            }
                                            {this.getStudentsFn(list.studentE)}
                                        </Input>
                                    </td>
                                    <td><Button color = "danger" onClick = {this.handleRemoveListField(idx)}>-</Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                        <Input type = "select" style = {{backgroundColor: "#eee"}} onChange = {(e) => {
                            this.setState({spirala_id: e.target.value})
                        }}>
                            {this.getHomeworksFn(this.state.spirala_id)}
                        </Input>
                    </CardBody>
                    <CardFooter>
                        <Button color = "success"
                                disabled = {this.state.listFields.length === 0}
                                onClick = {this.submitList.bind(this)}
                        >Sačuvaj promjene</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    render() {
        return (
            <div id = "osoba-details">
                <Card>
                    <CardBody>
                        {this.display()}
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default UredjivanjeSpiska;