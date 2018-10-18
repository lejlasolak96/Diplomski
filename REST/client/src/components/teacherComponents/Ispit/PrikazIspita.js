import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Input, Button, Col, Row} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

import PrikazJednogIspita from './PrikazJednogIspita';

class PrikazIspita extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pretraga: "",
            ispiti: [],
            error: null
        };
    }

    componentDidMount() {
        this.getExams();
    }

    getExams() {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/ispiti', options)
            .then(result => result.json())
            .then(data => {
                if (data.ispiti) this.setState({ispiti: data.ispiti});
                if (data.error) this.setState({error: data.error});
            })
            .catch(err => {
                console.log(err);
            });
    }

    displayExams() {

        if (this.state.ispiti.length !== 0) {

            return this.state.ispiti.map((sem) => {

                return <PrikazJednogIspita refetch = {(r) => {
                    if (r === true) this.getExams();
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

    searchExamByType(vrsta) {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/search/ispiti/vrsta/' + vrsta, options)
            .then(result => result.json())
            .then(data => {
                if (data.ispiti) this.setState({ispiti: data.ispiti});
                else this.setState({ispiti: []});
            })
            .catch(err => {
                console.log(err);
            });
    }

    searchExamByYear(godina) {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/search/ispiti/godina/' + godina, options)
            .then(result => result.json())
            .then(data => {
                if (data.ispiti) this.setState({ispiti: data.ispiti});
                else this.setState({ispiti: []});
            })
            .catch(err => {
                console.log(err);
            });
    }

    changeSearch(e) {

        this.setState({pretraga: e.target.value});
        this.getExams();
    }

    changeTypeSearch(e) {

        this.setState({pretraga: "tip"});
        this.searchExamByType(e.target.value);
    }

    changeYearSearch(e) {

        this.setState({pretraga: "godina"});
        this.searchExamByYear(e.target.value);
    }

    render() {
        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardHeader>
                        <h3>Ispiti</h3>
                    </CardHeader>
                    <CardBody>
                        <Button
                            color = {"success"}
                            href = {"/kreiranjeIspita"}>Kreiraj ispit
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
                            <option value = {"tip"}>
                                Pretraga po vrsti
                            </option>
                        </Input>
                        {
                            this.state.pretraga === "tip" ?
                                <Input
                                    className = {"div-pretraga"}
                                    onChange = {this.changeTypeSearch.bind(this)}
                                    placeholder = {"Unesite vrstu za pretragu"}
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
                    <CardBody>
                        <Row style = {{fontSize: "14pt"}}>
                            <Col>ID</Col>
                            <Col>Maximalni broj bodova</Col>
                            <Col>Vrsta ispita</Col>
                            <Col>Datum odrzavanja</Col>
                            <Col></Col>
                            <Col></Col>
                            <Col></Col>
                        </Row>
                        {this.displayExams()}
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default PrikazIspita;