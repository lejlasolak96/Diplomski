import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, CardFooter, Collapse, Input, Row, Col, Button, Table} from 'reactstrap';
import Popup from "reactjs-popup";

import PrikazStudentovihDetalja from '../Student/PrikazStudentovihDetalja';

import {getListByHomeworkNumber} from '../../../queries/queries';
import {deleteList} from '../../../mutations/mutations';

class PrikazCijelogSpiska extends Component {

    constructor(props) {
        super(props);
        this.state = {
            start: null,
            opened: false
        };
    }

    deleteListByHomeworkId = (id) => {

        this.props.deleteList({
            variables: {
                spirala_id: id
            },
            refetchQueries: [{query: getListByHomeworkNumber}]
        })
            .then(function () {
                alert("Uspješno obrisan spisak");
                window.location.reload();
            })
            .catch(function (error) {
                alert(error.message);
            });
    };

    toggle = () => {

        this.setState({opened: !this.state.opened});
    };

    display() {

        let redovi = [];
        let spirala_id = null;

        let data = this.props.data;

        if (!data.loading) {

            if (!data.error && data.pretragaSpiskovaPoSpirali) {
                data.pretragaSpiskovaPoSpirali.map(s => {

                    if (redovi[s.ocjenjivac.id] === undefined) redovi[s.ocjenjivac.id] = {};
                    redovi[s.ocjenjivac.id].ocjenjivac = s.ocjenjivac;
                    if (s.sifra_studenta === "A") redovi[s.ocjenjivac.id].studentA = s.ocjenjeni;
                    else if (s.sifra_studenta === "B") redovi[s.ocjenjivac.id].studentB = s.ocjenjeni;
                    else if (s.sifra_studenta === "C") redovi[s.ocjenjivac.id].studentC = s.ocjenjeni;
                    else if (s.sifra_studenta === "D") redovi[s.ocjenjivac.id].studentD = s.ocjenjeni;
                    else if (s.sifra_studenta === "E") redovi[s.ocjenjivac.id].studentE = s.ocjenjeni;
                });

                spirala_id = data.pretragaSpiskovaPoSpirali[0].spirala.id;
            }
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
                                                                        userID = {list.ocjenjivac.id}/>
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
                                                                        userID = {list.studentA.id}/>
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
                                                                        userID = {list.studentB.id}/>
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
                                                                        userID = {list.studentC.id}/>
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
                                                                        userID = {list.studentD.id}/>
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
                                                                        userID = {list.studentE.id}/>
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

export default compose(
    graphql(getListByHomeworkNumber, {
        options: (props) => {
            return {
                name: "getListByHomeworkNumber",
                variables: {
                    spirala_id: props.spirala_id
                }
            }
        }
    }),
    graphql(deleteList, {
        name: "deleteList"
    })
)(PrikazCijelogSpiska);