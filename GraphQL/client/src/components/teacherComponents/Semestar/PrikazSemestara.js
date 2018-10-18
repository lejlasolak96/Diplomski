import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, Button, Col, Row} from 'reactstrap';

import {getSemesters} from '../../../queries/queries';

import PrikazJednogSemestra from './PrikazJednogSemestra';

class PrikazSemestara extends Component {

    displaySemesters() {

        let data = this.props.data;

        if (data && !data.loading) {
            if (data.semestri) {

                return data.semestri.map((sem) => {

                    return <PrikazJednogSemestra key = {sem.id} id = {sem.id}/>;
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
                        <h3>Semestri</h3>
                    </CardHeader>
                    <CardBody>
                        <Button
                            color = {"success"}
                            href = {"/kreiranjeSemestra"}>Kreiraj semestar
                        </Button>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <Card>
                            <Row style = {{fontSize: "14pt"}}>
                                <Col>ID</Col>
                                <Col>Naziv</Col>
                                <Col>Redni broj</Col>
                                <Col>Početak</Col>
                                <Col>Kraj</Col>
                                <Col>Akademska godina</Col>
                                <Col></Col>
                                <Col></Col>
                                <Col></Col>
                            </Row>
                            {this.displaySemesters()}
                        </Card>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default graphql(getSemesters)(PrikazSemestara);
