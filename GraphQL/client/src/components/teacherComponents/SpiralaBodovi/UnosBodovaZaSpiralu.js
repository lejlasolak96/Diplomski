import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {Card, CardBody, CardHeader, Col, Row, Button, Collapse} from 'reactstrap';

import {getStudents} from '../../../queries/queries';

import PrikazJednogStudentaBodovi from './PrikazJednogStudentaBodovi';

class UnosBodovaZaSpiralu extends Component {

    displayUsers() {

        let data = this.props.data;

        if (data && !data.loading) {
            if (data.studenti) {

                return data.studenti.map((osoba) => {

                    return <PrikazJednogStudentaBodovi key = {osoba.id} id = {osoba.id}/>;
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
                        <h3>Pojedinačni unos bodova</h3>
                    </CardHeader>
                    <CardBody>
                        <Button color = {"success"} href = {"/kreiranjeSpiralaBodova"}>Grupni unos bodova</Button>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div>
                            <Card>
                                <Row style = {{fontSize: "14pt"}}>
                                    <Col>ID</Col>
                                    <Col>Ime</Col>
                                    <Col>Prezime</Col>
                                    <Col>Index</Col>
                                    <Col></Col>
                                    <Col></Col>
                                </Row>
                                {this.displayUsers()}
                            </Card>
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default graphql(getStudents)(UnosBodovaZaSpiralu);
