import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {Card, CardBody, CardHeader, Input, Col, Row} from 'reactstrap';

import {getStudents} from '../../../queries/queries';

import PrikazJednogStudenta from './PrikazJednogStudenta';
import PretraziStudentePoUsernameNastavnik from './PretraziStudentePoUsernameNastavnik';

class PrikazStudenataNastavnik extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: ''
        };
    }

    displayUsers() {

        console.log(this.props);

        let data = this.props.data;

        if (data && !data.loading) {
            if (data.studenti) {

                return data.studenti.map((osoba) => {

                    return <PrikazJednogStudenta key = {osoba.id} userID = {osoba.id}/>;
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
                        <h3>Studenti</h3>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <Input
                            className = {"div-pretraga"}
                            onChange = {(e) => {
                                this.setState({username: e.target.value})
                            }}
                            placeholder = {"Unesite username za pretragu"}
                            type = {"text"}/>
                    </CardHeader>
                    <CardBody>
                        <div>
                            <Card>
                                <Row style = {{fontSize: "14pt"}}>
                                    <Col>ID</Col>
                                    <Col>Ime</Col>
                                    <Col>Prezime</Col>
                                    <Col>Spol</Col>
                                    <Col>Username</Col>
                                    <Col></Col>
                                </Row>
                                {this.state.username !== "" ? <PretraziStudentePoUsernameNastavnik
                                    username = {this.state.username}/> : this.displayUsers()}
                            </Card>
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default graphql(getStudents)(PrikazStudenataNastavnik);
