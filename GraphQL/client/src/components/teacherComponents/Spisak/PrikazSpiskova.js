import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, Button, Col, Row, Input} from 'reactstrap';

import {getHomeworks} from '../../../queries/queries';

import PrikazCijelogSpiska from './PrikazCijelogSpiska';
import PretraziSpiskovePoBrojuSpirale from './PretraziSpiskovePoBrojuSpirale';

class PrikazSpiskova extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spiralaPretraga: null
        };
    };

    displayLists() {

        let data = this.props.data;

        if (data && !data.loading) {
            if (data.spirale) {

                return data.spirale.map((sem) => {
                    return <PrikazCijelogSpiska key = {sem.id} spirala_id = {sem.id}/>;
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
                        <h3>Spiskovi</h3>
                    </CardHeader>
                    <CardBody>
                        <Button
                            color = {"success"}
                            href = {"/kreiranjeSpiska"}>Kreiraj spisak
                        </Button>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        <Input
                            className = {"div-pretraga"}
                            onChange = {(e) => {
                                this.setState({spiralaPretraga: e.target.value})
                            }}
                            placeholder = {"Unesite broj spirale za pretragu"}
                            type = {"number"}/>
                    </CardHeader>
                    <CardBody>
                        <Card>
                            <Row style = {{fontSize: "14pt"}}>
                                <Col>Broj spirale</Col>
                                <Col></Col>
                                <Col></Col>
                                <Col></Col>
                            </Row>
                            {this.state.spiralaPretraga ?
                                <PretraziSpiskovePoBrojuSpirale broj_spirale = {this.state.spiralaPretraga}/>
                                : this.displayLists()
                            }
                        </Card>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default graphql(getHomeworks)(PrikazSpiskova);
