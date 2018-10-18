import React, {Component} from 'react';
import {Card, CardBody, CardHeader, CardFooter, Collapse, Input, Row, Col, Button, Table} from 'reactstrap';
import Popup from "reactjs-popup";
import {API_ROOT} from "../../../api-config";

import PrikazStudentovihDetalja from '../Student/PrikazStudentovihDetalja';

class PrikazCijelogSpiska extends Component {

    constructor(props) {
        super(props);
        this.state = {
            start: null,
            opened: false,
            spisak: []
        };
    }

    componentDidMount() {
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

        fetch(API_ROOT + '/search/spiskovi?spirala_id=' + this.props.spirala_id, options)
            .then(result => result.json())
            .then(data => {
                if (data.spisak) this.setState({spisak: data.spisak});
            })
            .catch(err => {
                console.log(err);
            });
    }

    deleteListByHomeworkId = (id) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'DELETE',
            headers: myHeaders
        };

        fetch(API_ROOT + '/spiskovi?spirala_id=' + id, options)
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
    };

    toggle = () => {

        this.setState({opened: !this.state.opened});
    };

    display() {

        let redovi = [];
        let spirala_id = null;

        if (this.state.spisak) {
            this.state.spisak.map(s => {

                spirala_id = s.spirala.id;

                if (redovi[s.ocjenjivac.id] === undefined) redovi[s.ocjenjivac.id] = {};
                redovi[s.ocjenjivac.id].ocjenjivac = s.ocjenjivac;
                if (s.sifra_studenta === "A") redovi[s.ocjenjivac.id].studentA = s.ocjenjeni;
                else if (s.sifra_studenta === "B") redovi[s.ocjenjivac.id].studentB = s.ocjenjeni;
                else if (s.sifra_studenta === "C") redovi[s.ocjenjivac.id].studentC = s.ocjenjeni;
                else if (s.sifra_studenta === "D") redovi[s.ocjenjivac.id].studentD = s.ocjenjeni;
                else if (s.sifra_studenta === "E") redovi[s.ocjenjivac.id].studentE = s.ocjenjeni;
            });
        }

        return (
            <div className = "animated fadeIn">
                {
                    redovi.length === 0 ?
                        null
                        :
                        <Card>
                            <CardHeader>
                                <Row>
                                    <Col>{this.props.spirala_id}</Col>
                                    <Col><Button color = {"danger"}
                                                 onClick = {() => {
                                                     if (window.confirm('Da li ste sigurni da želite obrisati spisak? ' +
                                                             'Akcija nema povratka i brišu se svi vezani podaci za isti.')) this.deleteListByHomeworkId(spirala_id)
                                                 }}>Obriši</Button></Col>
                                    <Col>
                                        <a href = {"/uredjivanjeSpiska/" + this.props.spirala_id}>
                                            <Button color = {"success"}>Uredi</Button>
                                        </a>
                                    </Col>
                                    <Col>
                                        {this.state.opened ?
                                            <Button color = "primary" onClick = {() => {
                                                this.toggle()
                                            }} style = {{marginBottom: '1rem'}}>Sakrij spisak</Button>
                                            : <Button color = "primary" onClick = {() => {
                                                this.toggle()
                                            }} style = {{marginBottom: '1rem'}}>Prikaži spisak</Button>
                                        }
                                    </Col>
                                </Row>
                            </CardHeader>
                            <Collapse isOpen = {this.state.opened}>
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
                                        </tr>
                                        </thead>
                                        <tbody>

                                        {
                                            redovi.map((list, idx) => (
                                                !list || !list.ocjenjivac || !list.studentA || !list.studentB || !list.studentC || !list.studentD || !list.studentE ?
                                                    null
                                                    :
                                                    <tr key = {idx + 1}>
                                                        <td>
                                                            <Popup
                                                                trigger = {
                                                                    <Button style = {{width: "100%"}} tag = "button"
                                                                            color = {"info"}>
                                                                        {list.ocjenjivac.ime + " " + list.ocjenjivac.prezime + " " + list.ocjenjivac.index}
                                                                    </Button>
                                                                }
                                                                modal
                                                                closeOnDocumentClick>
                                                                <div>
                                                                    <PrikazStudentovihDetalja
                                                                        id = {list.ocjenjivac.id}/>
                                                                </div>
                                                            </Popup>
                                                        </td>
                                                        <td>
                                                            <Popup
                                                                trigger = {
                                                                    <Button style = {{width: "100%"}} tag = "button"
                                                                            color = {"info"}>
                                                                        {list.studentA.ime + " " + list.studentA.prezime + " " + list.studentA.index}
                                                                    </Button>
                                                                }
                                                                modal
                                                                closeOnDocumentClick>
                                                                <div>
                                                                    <PrikazStudentovihDetalja
                                                                        id = {list.studentA.id}/>
                                                                </div>
                                                            </Popup>
                                                        </td>
                                                        <td>
                                                            <Popup
                                                                trigger = {
                                                                    <Button style = {{width: "100%"}} tag = "button"
                                                                            color = {"info"}>
                                                                        {list.studentB.ime + " " + list.studentB.prezime + " " + list.studentB.index}
                                                                    </Button>
                                                                }
                                                                modal
                                                                closeOnDocumentClick>
                                                                <div>
                                                                    <PrikazStudentovihDetalja
                                                                        id = {list.studentB.id}/>
                                                                </div>
                                                            </Popup>
                                                        </td>
                                                        <td>
                                                            <Popup
                                                                trigger = {
                                                                    <Button style = {{width: "100%"}} tag = "button"
                                                                            color = {"info"}>
                                                                        {list.studentC.ime + " " + list.studentC.prezime + " " + list.studentC.index}
                                                                    </Button>
                                                                }
                                                                modal
                                                                closeOnDocumentClick>
                                                                <div>
                                                                    <PrikazStudentovihDetalja
                                                                        id = {list.studentC.id}/>
                                                                </div>
                                                            </Popup>
                                                        </td>
                                                        <td>
                                                            <Popup
                                                                trigger = {
                                                                    <Button style = {{width: "100%"}} tag = "button"
                                                                            color = {"info"}>
                                                                        {list.studentD.ime + " " + list.studentD.prezime + " " + list.studentD.index}
                                                                    </Button>
                                                                }
                                                                modal
                                                                closeOnDocumentClick>
                                                                <div>
                                                                    <PrikazStudentovihDetalja
                                                                        id = {list.studentD.id}/>
                                                                </div>
                                                            </Popup>
                                                        </td>
                                                        <td>
                                                            <Popup
                                                                trigger = {
                                                                    <Button style = {{width: "100%"}} tag = "button"
                                                                            color = {"info"}>
                                                                        {list.studentE.ime + " " + list.studentE.prezime + " " + list.studentE.index}
                                                                    </Button>
                                                                }
                                                                modal
                                                                closeOnDocumentClick>
                                                                <div>
                                                                    <PrikazStudentovihDetalja
                                                                        id = {list.studentE.id}/>
                                                                </div>
                                                            </Popup>
                                                        </td>
                                                    </tr>
                                            ))
                                        }
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Collapse>
                        </Card>
                }
            </div>
        );
    }

    render() {
        return (
            <div id = "osoba-details">
                {this.display()}
            </div>
        );
    }
}

export default PrikazCijelogSpiska;