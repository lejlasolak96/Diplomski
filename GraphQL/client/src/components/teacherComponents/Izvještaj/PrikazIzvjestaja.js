import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, Col, Row, Button, Table} from 'reactstrap';
import Popup from "reactjs-popup";

import {getReports} from '../../../queries/queries';
import {deleteReport} from '../../../mutations/mutations';

import PrikazStudentovihDetalja from '../Student/PrikazStudentovihDetalja';
import PrikazDetaljaSpirale from '../Spirala/PrikazDetaljaSpirale';

class PrikazIzvjestaja extends Component {

    deleteReportFn = async (id) => {

        const message = await this.props.deleteReport({
            variables: {
                id: id
            },
            refetchQueries: [{query: getReports}]
        })
            .catch(function (error) {
                alert(error.message);
            });

        alert(message.data.obrisiIzvjestaj.message);
    };

    displayReports() {

        let data = this.props.getReports;

        if (data && !data.loading) {
            if (data.izvjestaji) {

                return data.izvjestaji.map((i) => {

                    return (
                        <Card>
                            <CardHeader>
                                <Row>
                                    <Col>
                                        <Popup
                                            trigger = {
                                                <Button style = {{width: "100%"}} tag = "button"
                                                        color = {"info"}>
                                                    {i.student.ime + " " + i.student.prezime + " " + i.student.index}
                                                </Button>
                                            }
                                            modal
                                            closeOnDocumentClick>
                                            <div>
                                                <PrikazStudentovihDetalja userID = {i.student.id}/>
                                            </div>
                                        </Popup>
                                    </Col>
                                    <Col>
                                        <Popup
                                            trigger = {
                                                <Button style = {{width: "100%"}} tag = "button"
                                                        color = {"info"}>
                                                    {i.spirala.broj_spirale}
                                                </Button>
                                            }
                                            modal
                                            closeOnDocumentClick>
                                            <div>
                                                <PrikazDetaljaSpirale id = {i.spirala.id}/>
                                            </div>
                                        </Popup>
                                    </Col>
                                    <Col>
                                        <Button color = {"danger"}
                                                onClick = {() => {
                                                    if (window.confirm('Da li ste sigurni da želite obrisati izvještaj?')) this.deleteReportFn(i.id)
                                                }}>Obriši</Button>
                                    </Col>
                                </Row>
                            </CardHeader>
                        </Card>
                    )

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
                        <h3>Izvještaji</h3>
                    </CardHeader>
                    <CardBody>
                        <Button color = {"success"} href = {"/grupnoKreiranjeIzvjestaja"}>Grupno kreiranje
                                                                                          izvještaja</Button>
                        <Button color = {"success"} href = {"/pojedinacnoKreiranjeIzvjestaja"}>Pojedinačno kreiranje
                                                                                               izvještaja</Button>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <Card>
                            <Row>
                                <Col>Student</Col>
                                <Col>Spirala</Col>
                                <Col></Col>
                            </Row>
                            {this.displayReports()}
                        </Card>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default compose(
    graphql(getReports,
        {
            name: "getReports"
        }),
    graphql(deleteReport,
        {
            name: "deleteReport"
        })
)(PrikazIzvjestaja);
