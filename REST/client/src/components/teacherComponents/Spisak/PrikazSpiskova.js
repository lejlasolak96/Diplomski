import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Button, Col, Row, Input} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

import PrikazCijelogSpiska from './PrikazCijelogSpiska';

class PrikazSpiskova extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spiralaPretraga: "",
            spirale: [],
            error: null
        };
    };

    componentDidMount() {
        this.getHomeworks();
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

    getHomeworksByNumber(broj) {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/search/spirale/broj/' + broj, options)
            .then(result => result.json())
            .then(data => {
                if (data.spirale) this.setState({spirale: data.spirale});
                else this.setState({spirale: []});
            })
            .catch(err => {
                console.log(err);
            })
    }

    searchChange(e) {

        this.setState({spiralaPretraga: e.target.value});
        if (e.target.value !== "") this.getHomeworksByNumber(e.target.value);
        else this.getHomeworks(e.target.value);
    }

    displayLists() {

        if (this.state.spirale.length !== 0) {

            return this.state.spirale.map((sem) => {
                return <PrikazCijelogSpiska key = {sem.id} spirala_id = {sem.id}/>;
            });
        }
        else {
            if (this.state.spiralaPretraga !== "") {
                return (
                    <Card>
                        <CardHeader>
                            <Row>Nema rezultata pretrage</Row>
                        </CardHeader>
                    </Card>
                );
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
                            onChange = {this.searchChange.bind(this)}
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
                            {this.displayLists()}
                        </Card>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default PrikazSpiskova;
