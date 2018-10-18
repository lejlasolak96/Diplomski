import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {Card, CardBody, CardHeader, Col, Row, Input} from 'reactstrap';

import {getUsers} from '../../../queries/queries';

import PrikazJednogKorisnika from './PrikazJednogKorisnika';
import PretragaOsobaPoUsernameAdmin from './PretraziOsobePoUsernameAdmin';
import PretragaOsobaPoTipuadmin from './PretraziOsobePoTipuAdmin';

class PrikazKorisnikaAdmin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapse: [],
            selected: null,
            opened: false,
            pretraga: '',
            username: ''
        };
    }

    displayUsers() {

        let data = this.props.data;

        if (data && !data.loading) {
            if (data.osobe) {

                return data.osobe.map((osoba) => {

                    return <PrikazJednogKorisnika key = {osoba.id} userID = {osoba.id}/>;
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

    changeSearch(e) {

        this.setState({pretraga: e.target.value});
    }

    changeUsernameSearch(e) {

        this.setState({username: e.target.value});
        this.setState({pretraga: "username"});
    }

    render() {
        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardHeader>
                        <h3>Korisnici</h3>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <Input type={"select"} onChange = {this.changeSearch.bind(this)}>
                            <option value = {""}>
                                Svi
                            </option>
                            <option value = {"student"}>
                                Studenti
                            </option>
                            <option value = {"nastavnik"}>
                                Nastavnici
                            </option>
                            <option value = {"admin"}>
                                Administratori
                            </option>
                            <option value = {"username"}>
                                Pretraga po username-u
                            </option>
                        </Input>
                        {
                            this.state.pretraga === "username" ?
                                <Input
                                    className = {"div-pretraga"}
                                    onChange = {this.changeUsernameSearch.bind(this)}
                                    placeholder = {"Unesite username za pretragu"}
                                    type = {"text"}/>
                                : null
                        }
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
                                    <Col></Col>
                                    <Col></Col>
                                </Row>
                                {this.state.pretraga === "" ? this.displayUsers() : null}
                                {this.state.pretraga === "username" && this.state.username !== "" ?
                                    <PretragaOsobaPoUsernameAdmin username = {this.state.username}/> : null}
                                {this.state.pretraga === "student"
                                || this.state.pretraga === "nastavnik"
                                || this.state.pretraga === "admin" ?
                                    <PretragaOsobaPoTipuadmin tip = {this.state.pretraga}/>
                                    : null
                                }
                            </Card>
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default graphql(getUsers)(PrikazKorisnikaAdmin);
