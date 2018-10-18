import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Input, Button, Col, Row, NavLink} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

import PrikazJedneGrupeStudent from './PrikazJedneGrupeStudent';

class PrikazGrupaStudent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pretraga: "",
            grupe: [],
            error: null
        };
    }

    componentDidMount() {
        this.getGroups();
    }

    getGroups() {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/grupe', options)
            .then(result => result.json())
            .then(data => {
                if (data.grupe) this.setState({grupe: data.grupe});
                if (data.error) this.setState({error: data.error});
            })
            .catch(err => {
                console.log(err);
            });
    }

    getMyGroups() {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/studenti/grupe', options)
            .then(result => result.json())
            .then(data => {
                if (data.grupe) this.setState({grupe: data.grupe});
                if (data.error) this.setState({error: data.error});
            })
            .catch(err => {
                console.log(err);
            });
    }

    searchGroupsByName(naziv) {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/search/grupe?naziv=' + naziv, options)
            .then(result => result.json())
            .then(data => {
                if (data.grupe) this.setState({grupe: data.grupe});
                else this.setState({grupe: []});
            })
            .catch(err => {
                console.log(err);
            })
    }

    searchGroupsByYear(godina) {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/search/grupe/godina/' + godina, options)
            .then(result => result.json())
            .then(data => {
                if (data.grupe) this.setState({grupe: data.grupe});
                else this.setState({grupe: []});
            })
            .catch(err => {
                console.log(err);
            })
    }

    displayGroups() {

        if (this.state.grupe.length !== 0) {

            return this.state.grupe.map((grupa) => {

                return <PrikazJedneGrupeStudent key = {grupa.id} id = {grupa.id}/>;
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

    changeSearch(e) {

        this.setState({pretraga: e.target.value});
        this.getGroups();
    }

    changeNameSearch(e) {

        this.setState({pretraga: "naziv"});
        this.searchGroupsByName(e.target.value);
    }

    changeYearSearch(e) {

        this.searchGroupsByYear(e.target.value);
        this.setState({pretraga: "godina"});
    }

    render() {
        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardHeader>
                        <h3>Grupe</h3>
                    </CardHeader>
                    <CardBody>
                        <Button onClick={this.getMyGroups.bind(this)} color={"primary"}>Moje grupe</Button>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                            <Input type={"select"} style = {{width: "100%"}} onChange = {this.changeSearch.bind(this)}>
                                <option value = {""}>
                                    Sve
                                </option>
                                <option value = {"godina"}>
                                    Pretraga po akademskoj godini
                                </option>
                                <option value = {"naziv"}>
                                    Pretraga po nazivu
                                </option>
                            </Input>
                            {
                                this.state.pretraga === "naziv" ?
                                    <Input
                                        className = {"div-pretraga"}
                                        onChange = {this.changeNameSearch.bind(this)}
                                        placeholder = {"Unesite naziv za pretragu"}
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
                        <div>
                            <Card>
                                <Row style = {{fontSize: "14pt"}}>
                                    <Col>ID</Col>
                                    <Col>Naziv</Col>
                                    <Col>Broj studenata</Col>
                                    <Col>Naziv semestra</Col>
                                    <Col>Redni broj semestra</Col>
                                    <Col>Akademska godina</Col>
                                    <Col></Col>
                                </Row>
                                {this.displayGroups()}
                            </Card>
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default PrikazGrupaStudent;