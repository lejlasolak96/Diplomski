import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Button, Input, Col, Row, NavLink} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

import PrikazJedneAkademskeGodine from './PrikazJedneAkademskeGodine';

class PrikazAkademskihGodina extends Component {

    constructor(props) {
        super(props);
        this.state = {
            naziv: "",
            prikaziTrenutnu: false,
            akademskeGodine: [],
            error: null
        };
    }

    componentDidMount() {
        this.getYears();
    }

    getYears() {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/akademskeGodine', options)
            .then(result => result.json())
            .then(data => {
                if (data.akademskeGodine) this.setState({akademskeGodine: data.akademskeGodine});
                if (data.error) this.setState({error: data.error});
            })
            .catch(err => {
                console.log(err);
            });
    }

    getCurrentYear() {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/akademskeGodine/trenutna', options)
            .then(result => result.json())
            .then(data => {
                if (data.akademskaGodina) this.setState({akademskeGodine: [data.akademskaGodina]});
                else this.setState({akademskeGodine: []});
            })
            .catch(err => {
                console.log(err);
            });
    }

    searchYearByName(naziv) {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/search/akademskeGodine?naziv=' + naziv, options)
            .then(result => result.json())
            .then(data => {
                if (data.akademskeGodine) this.setState({akademskeGodine: data.akademskeGodine});
                else this.setState({akademskeGodine: []});
            })
            .catch(err => {
                console.log(err);
            });
    }

    refetch(r) {

        if (r === true) this.getYears();
    }

    displayYears() {

        if (this.state.akademskeGodine.length !== 0) {

            return this.state.akademskeGodine.map((godina) => {

                return <PrikazJedneAkademskeGodine refetch = {this.refetch.bind(this)} key = {godina.id}
                                                   id = {godina.id}/>;
            });
        }
        else {
            if (this.state.naziv !== "") {
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

    changeNameSearch(e) {

        this.setState({naziv: e.target.value});
        if (e.target.value === "") this.getYears();
        else this.searchYearByName(e.target.value);
    }

    showAll(e) {

        this.setState({prikaziTrenutnu: false});
        this.getYears();
    }

    showCurrent(e) {

        this.setState({prikaziTrenutnu: true});
        this.getCurrentYear();
    }

    render() {

        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardHeader>
                        <h3>Akademske godine</h3>
                    </CardHeader>
                    <CardBody>
                        <Button
                            color = {"success"}
                            href = {"/kreiranjeAkademskeGodine"}>Kreiraj novu akademsku godinu
                        </Button>
                        {
                            this.state.prikaziTrenutnu ?
                                <Button
                                    color = {"primary"}
                                    onClick = {this.showAll.bind(this)}>Prikaži sve
                                </Button>
                                :
                                <Button
                                    onClick = {this.showCurrent.bind(this)}
                                    color = {"primary"}>Prikaži trenutnu
                                </Button>
                        }
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        <Input
                            className = {"div-pretraga"}
                            onChange = {this.changeNameSearch.bind(this)}
                            placeholder = {"Unesite naziv za pretragu"}
                            type = {"text"}/>
                    </CardHeader>
                    <CardBody>
                        <div>
                            <Card>
                                <Row style = {{fontSize: "14pt"}}>
                                    <Col>ID</Col>
                                    <Col>Naziv</Col>
                                    <Col>Trenutna</Col>
                                    <Col></Col>
                                    <Col></Col>
                                    <Col></Col>
                                </Row>
                                {this.displayYears()}
                            </Card>
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default PrikazAkademskihGodina;