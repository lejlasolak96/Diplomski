import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Button, Col, Collapse, Row} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

import PrikazKorisnikovihDetalja from './PrikazKorisnikoviDetalja';

class PrikazJednogKorisnika extends Component {

    constructor(props) {
        super(props);
        this.state = {
            opened: false,
            user: null
        };
    };

    componentDidMount() {
        this.getUser();
    }

    async getUser() {

        let user = {};

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        await fetch(API_ROOT + '/korisnici/' + this.props.userID, options)
            .then(result => result.json())
            .then(data => {
                if (data.korisnik) user = data.korisnik;
            })
            .catch(err => {
                console.log(err);
            });

        await fetch(API_ROOT + '/korisnici/' + this.props.userID + "/nalog", options)
            .then(result => result.json())
            .then(data => {
                if (data.nalog) {
                    user.nalog = data.nalog;
                    this.setState({user: user});
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    toggle = () => {

        this.setState({opened: !this.state.opened});
    };

    verify(id, verify) {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'PUT',
            headers: myHeaders
        };

        if (verify) verify = "verify";
        else verify = "unverify";

        fetch(API_ROOT + '/korisnici/' + id + "/verifikacija?verifikacija=" + verify, options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    this.getUser();
                }
                else alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    };

    deleteUser = (id) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'DELETE',
            headers: myHeaders
        };

        fetch(API_ROOT + '/korisnici/' + id, options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    this.props.refetch(true);
                }
                else alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    };

    displayUser() {

        if (this.state.user) {
            return (
                <Card>
                    <CardHeader>
                        <Row>
                            <Col>{this.state.user.id}</Col>
                            <Col>{this.state.user.ime}</Col>
                            <Col>{this.state.user.prezime}</Col>
                            <Col>{this.state.user.spol}</Col>
                            <Col>{this.state.user.nalog.username}</Col>
                            <Col>{this.state.user.nalog.verified ?
                                <Button onClick = {() => {
                                    this.verify(this.state.user.id, false)
                                }}>Unverify</Button>
                                :
                                <Button color = "warning" onClick = {() => {
                                    this.verify(this.state.user.id, true)
                                }}>Verify</Button>
                            }
                            </Col>
                            <Col>
                                <Button color = "danger"
                                        onClick = {() => {
                                            if (window.confirm('Da li ste sigurni da želite obrisati korisnika? ' +
                                                    'Akcija nema povratka i brišu se svi vezani podaci za osobu.')) this.deleteUser(this.state.user.id)
                                        }}>Obriši</Button>
                            </Col>
                            <Col>
                                {this.state.opened ?
                                    <Button color = "primary" onClick = {() => {
                                        this.toggle()
                                    }} style = {{marginBottom: '1rem'}}>Sakrij detalje</Button>
                                    : <Button color = "primary" onClick = {() => {
                                        this.toggle()
                                    }} style = {{marginBottom: '1rem'}}>Prikaži detalje</Button>
                                }
                            </Col>
                        </Row>
                    </CardHeader>
                    <Collapse isOpen = {this.state.opened}>
                        <CardBody>
                            <PrikazKorisnikovihDetalja userID = {this.state.user.id}/>
                        </CardBody>
                    </Collapse>
                </Card>
            );
        }

        else {
            return null;
        }
    }

    render() {
        return (
            <div>
                {this.displayUser()}
            </div>
        );
    }
}

export default PrikazJednogKorisnika;
