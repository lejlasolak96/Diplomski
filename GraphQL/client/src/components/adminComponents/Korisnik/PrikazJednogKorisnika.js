import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, Button, Col, Collapse, Row} from 'reactstrap';

import {verifyUserMutation} from '../../../mutations/mutations';
import {deleteUser} from '../../../mutations/mutations';
import {getUser, getUsers} from '../../../queries/queries';

import PrikazKorisnikovihDetalja from './PrikazKorisnikoviDetalja';

class PrikazJednogKorisnika extends Component {

    constructor(props) {
        super(props);
        this.state = {
            opened: false
        };
    };

    toggle = () => {

        this.setState({opened: !this.state.opened});
    };

    verify(id, verify) {

        this.props.verifyUserMutation({
            variables: {
                id: id,
                verify: verify
            }
        })
            .catch(function (error) {
                console.log(error.message);
            });
    };

    deleteUser = async (id) => {

        const message = await this.props.deleteUser({
            variables: {
                id: id
            },
            refetchQueries: [{query: getUsers}]
        })
            .catch(function (error) {
                console.log(error.message);
            });

        alert(message.data.obrisiOsobu.message);
    };

    displayUser() {

        const {osoba} = this.props.getUser;

        if (osoba) {
            return (
                <Card>
                    <CardHeader>
                        <Row>
                            <Col>{osoba.id}</Col>
                            <Col>{osoba.ime}</Col>
                            <Col>{osoba.prezime}</Col>
                            <Col>{osoba.spol}</Col>
                            <Col>{osoba.nalog.username}</Col>
                            <Col>{osoba.nalog.verified ?
                                <Button onClick = {() => {
                                    this.verify(osoba.id, false)
                                }}>Unverify</Button>
                                :
                                <Button color = "warning" onClick = {() => {
                                    this.verify(osoba.id, true)
                                }}>Verify</Button>
                            }
                            </Col>
                            <Col>
                                <Button color = "danger"
                                        onClick = {() => {
                                            if (window.confirm('Da li ste sigurni da želite obrisati korisnika? ' +
                                                    'Akcija nema povratka i brišu se svi vezani podaci za osobu.')) this.deleteUser(osoba.id)
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
                            <PrikazKorisnikovihDetalja userID = {osoba.id}/>
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

export default compose(
    graphql(verifyUserMutation,
        {
            name: "verifyUserMutation"
        }),
    graphql(deleteUser,
        {
            name: "deleteUser"
        }),
    graphql(getUser,
        {
            name: "getUser",
            options: (props) => {
                return {
                    variables: {
                        id: props.userID
                    }
                }
            }
        }
    )
)(PrikazJednogKorisnika);
