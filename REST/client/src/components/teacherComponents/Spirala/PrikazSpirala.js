import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Button, Col, Input, Row} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

import PrikazJedneSpirale from './PrikazJedneSpirale';

class PrikazSpirala extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pretraga: "",
            spirale: [],
            error: null
        };
    }

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

    displayHomeworks() {

        if (this.state.spirale.length !== 0) {

            return this.state.spirale.map((sem) => {

                return <PrikazJedneSpirale refetch = {(r) => {
                    if (r === true) this.getHomeworks();
                }} key = {sem.id} id = {sem.id}/>;
            });
        }
        else {
            if (this.state.pretraga !== "") {
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

    searchHomeworksByNumber(broj) {

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
            });
    }

    searchHomeworksByYear(godina) {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/search/spirale/godina/' + godina, options)
            .then(result => result.json())
            .then(data => {
                if (data.spirale) this.setState({spirale: data.spirale});
                else this.setState({spirale: []});
            })
            .catch(err => {
                console.log(err);
            });
    }

    changeSearch(e) {

        this.setState({pretraga: e.target.value});
        this.getHomeworks();
    }

    changeNumberSearch(e) {

        this.setState({pretraga: "broj"});
        this.searchHomeworksByNumber(e.target.value);
    }

    changeYearSearch(e) {

        this.setState({pretraga: "godina"});
        this.searchHomeworksByYear(e.target.value);
    }

    render() {
        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardHeader>
                        <h3>Spirale</h3>
                    </CardHeader>
                    <CardBody>
                        <Button
                            color = {"success"}
                            href = {"/kreiranjeSpirale"}>Kreiraj spiralu
                        </Button>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        <Input type={"select"} onChange = {this.changeSearch.bind(this)}>
                            <option value = {""}>
                                Sve
                            </option>
                            <option value = {"godina"}>
                                Pretraga po akademskoj godini
                            </option>
                            <option value = {"broj"}>
                                Pretraga po broju spirale
                            </option>
                        </Input>
                        {
                            this.state.pretraga === "broj" ?
                                <Input
                                    className = {"div-pretraga"}
                                    onChange = {this.changeNumberSearch.bind(this)}
                                    placeholder = {"Unesite broj spirale za pretragu"}
                                    type = {"number"}/>
                                : null
                        }
                        {
                            this.state.pretraga === "godina" ?
                                <Input
                                    className = {"div-pretraga"}
                                    onChange = {this.changeYearSearch.bind(this)}
                                    placeholder = {"Unesite akadesmku godinu za pretragu"}
                                    type = {"text"}/>
                                : null
                        }
                    </CardHeader>
                    <CardBody>
                        <Row style = {{fontSize: "14pt"}}>
                            <Col>ID</Col>
                            <Col>Broj spirale</Col>
                            <Col>Maximalni broj bodova</Col>
                            <Col>Datum objave</Col>
                            <Col>Rok za predaju</Col>
                            <Col></Col>
                            <Col></Col>
                            <Col></Col>
                        </Row>
                        {this.displayHomeworks()}
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default PrikazSpirala;
