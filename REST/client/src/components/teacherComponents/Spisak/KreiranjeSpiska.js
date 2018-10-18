import React, {Component} from 'react';
import {Card, CardBody, CardHeader, CardFooter, Input, Row, Col, Button, Table} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

class KreiranjeSpiska extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listFields: [],
            spirala_id: null,
            studenti: [],
            spirale: []
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
                if (data.error) this.setState({error: data.error});
            })
            .catch(err => {
                console.log(err);
            });
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
            });
    }

    getStudentsFn = () => {

        return this.state.studenti.map(s => {
            return (
                <option value = {s.id} key = {s.id}>{s.ime + " " + s.prezime + " " + s.index}</option>
            );
        });
    }

    handleReviewerValueChange = (idx) => (evt) => {

        const list = this.state.listFields.map((e, sidx) => {
            if (idx !== sidx) return e;
            return {...e, ocjenjivac_id: evt.target.value};
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
                ocjenjivac_id: null,
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

        await this.state.listFields.map((red) => {

            redovi = redovi.concat([
                {
                    ocjenjivac_id: red.ocjenjivac_id,
                    ocjenjeni_id: red.studentA,
                    sifra_studenta: "A",
                    spirala_id: this.state.spirala_id
                },
                {
                    ocjenjivac_id: red.ocjenjivac_id,
                    ocjenjeni_id: red.studentB,
                    sifra_studenta: "B",
                    spirala_id: this.state.spirala_id
                },
                {
                    ocjenjivac_id: red.ocjenjivac_id,
                    ocjenjeni_id: red.studentC,
                    sifra_studenta: "C",
                    spirala_id: this.state.spirala_id
                },
                {
                    ocjenjivac_id: red.ocjenjivac_id,
                    ocjenjeni_id: red.studentD,
                    sifra_studenta: "D",
                    spirala_id: this.state.spirala_id
                },
                {
                    ocjenjivac_id: red.ocjenjivac_id,
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
            spisak: redovi
        };

        const options = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/spiskovi', options)
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

    display() {

        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardHeader>
                        <h1>Novi spisak</h1>
                    </CardHeader>
                    <CardBody>
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
                                <td><Button color = "primary" onClick = {this.handleAddListField}>+</Button></td>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.listFields.map((list, idx) => (
                                <tr key = {idx + 1}>
                                    <td>
                                        <Input type = {"select"} onChange = {this.handleReviewerValueChange(idx)}>
                                            <option disabled = {true} selected = {true}>Odaberite studenta</option>
                                            {this.getStudentsFn()}
                                        </Input>
                                    </td>
                                    <td>
                                        <Input type = {"select"} onChange = {this.handleReviewedAValueChange(idx)}>
                                            <option disabled = {true} selected = {true}>Odaberite studenta</option>
                                            {this.getStudentsFn()}
                                        </Input>
                                    </td>
                                    <td>
                                        <Input type = {"select"} onChange = {this.handleReviewedBValueChange(idx)}>
                                            <option disabled = {true} selected = {true}>Odaberite studenta</option>
                                            {this.getStudentsFn()}
                                        </Input>
                                    </td>
                                    <td>
                                        <Input type = {"select"} onChange = {this.handleReviewedCValueChange(idx)}>
                                            <option disabled = {true} selected = {true}>Odaberite studenta</option>
                                            {this.getStudentsFn()}
                                        </Input>
                                    </td>
                                    <td>
                                        <Input type = {"select"} onChange = {this.handleReviewedDValueChange(idx)}>
                                            <option disabled = {true} selected = {true}>Odaberite studenta</option>
                                            {this.getStudentsFn()}
                                        </Input>
                                    </td>
                                    <td>
                                        <Input type = {"select"} onChange = {this.handleReviewedEValueChange(idx)}>
                                            <option disabled = {true} selected = {true}>Odaberite studenta</option>
                                            {this.getStudentsFn()}
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
                            <option disabled = {true} selected = {true}>Odaberite spiralu</option>
                            {this.getHomeworksFn()}
                        </Input>
                    </CardBody>
                    <CardFooter>
                        <Button color = "success"
                                disabled = {this.state.listFields.length === 0 || !this.state.spirala_id}
                                onClick = {this.submitList.bind(this)}>Kreiraj spisak</Button>
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

export default KreiranjeSpiska;