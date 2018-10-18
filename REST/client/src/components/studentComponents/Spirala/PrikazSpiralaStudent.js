import React, {Component} from 'react';
import {Card, CardBody, Input, CardHeader, Button, Col, Row} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

import PrikazJedneSpiraleStudent from './PrikazJedneSpiraleStudent';

class PrikazSpiralaStudent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spirale: [],
            error: null,
            pretraga: "",
            godina: "",
            broj: ""
        };
    };

    changeSearch(e) {

        this.setState({pretraga: e.target.value});
        this.gtHomeworks();
    }

    changeNumberSearch(e) {

        this.setState({pretraga: "broj"});
        this.searchHomeworksByNumber(e.target.value);
    }

    changeYearSearch(e) {

        this.setState({pretraga: "godina"});
        this.searchHomeworksByYear(e.target.value);
    }

    componentDidMount() {
        this.gtHomeworks();
    }

    gtHomeworks() {

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

    displayHomeworks() {

            return (
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
                                Pretraga po rednom broju
                            </option>
                        </Input>
                        {
                            this.state.pretraga === "broj" ?
                                <Input
                                    className = {"div-pretraga"}
                                    onChange = {this.changeNumberSearch.bind(this)}
                                    placeholder = {"Unesite redni broj za pretragu"}
                                    type = {"text"}/>
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

                    {
                        this.state.spirale.length !== 0 ?
                            <CardBody>
                                <Card>
                                    <Row style = {{fontSize: "14pt"}}>
                                        <Col>ID</Col>
                                        <Col>Broj spirale</Col>
                                        <Col>Maximalni broj bodova</Col>
                                        <Col>Datum objave</Col>
                                        <Col>Rok za predaju</Col>
                                    </Row>
                                    {
                                        this.state.spirale.map((sem) => (
                                            <PrikazJedneSpiraleStudent key = {sem.id} id = {sem.id}/>
                                        ))
                                    }
                                </Card>
                            </CardBody>
                            :
                            <CardBody>
                                <Card>
                                {
                                    this.state.pretraga !== "" ?
                                        <Card>
                                            <CardHeader>
                                                <Row>Nema rezultata pretrage</Row>
                                            </CardHeader>
                                        </Card>
                                        :
                                        <Card>
                                            <CardHeader>
                                                <Row>{this.state.error}</Row>
                                            </CardHeader>
                                        </Card>
                                }
                                </Card>
                            </CardBody>
                    }
                </Card>
            );
    }

    render() {
        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardHeader>
                        <h3>Spirale</h3>
                    </CardHeader>
                </Card>
                {this.displayHomeworks()}
            </div>
        );
    }
}

export default PrikazSpiralaStudent;