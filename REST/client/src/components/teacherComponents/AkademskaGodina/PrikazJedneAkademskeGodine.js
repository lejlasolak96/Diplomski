import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Button, Col, Collapse, Row} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

import PrikazDetaljaGodine from './PrikazDetaljaGodine';

class PrikazJedneAkademskeGodine extends Component {

    constructor(props) {
        super(props);
        this.state = {
            opened: false,
            edit: null,
            akademskaGodina: null
        };
    };

    toggle = () => {

        this.setState({opened: !this.state.opened});
    };

    componentDidMount() {
        this.getYear();
    }

    getYear() {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/akademskeGodine/' + this.props.id, options)
            .then(result => result.json())
            .then(data => {
                if (data.akademskaGodina) this.setState({akademskaGodina: data.akademskaGodina});
            })
            .catch(err => {
                console.log(err);
            });
    }

    deleteYear = (id) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'DELETE',
            headers: myHeaders
        };

        fetch(API_ROOT + '/akademskeGodine/' + id, options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    this.props.refetch(true);
                    alert(data.message);
                }
                else alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    };

    display() {

        const {akademskaGodina} = this.state;

        if (akademskaGodina) {

            return (
                <Card>
                    <CardHeader>
                        <Row>
                            <Col>{akademskaGodina.id}</Col>
                            <Col>{akademskaGodina.naziv}</Col>
                            <Col>{akademskaGodina.trenutna ? "Da" : "Ne"}</Col>
                            <Col><Button color = {"danger"}
                                         onClick = {() => {
                                             if (window.confirm('Da li ste sigurni da želite obrisati akademsku godinu? ' +
                                                     'Akcija nema povratka i brišu se svi vezani podaci za istu.')) this.deleteYear(akademskaGodina.id)
                                         }}>Obriši</Button></Col>
                            <Col>
                                <a href = {"/uredjivanjeAkademskeGodine/" + akademskaGodina.id}>
                                    <Button color = {"success"}>Uredi</Button>
                                </a>
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
                            <PrikazDetaljaGodine id = {akademskaGodina.id}/>
                        </CardBody>
                    </Collapse>
                </Card>
            );
        } else {
            return null;
        }
    }

    render() {
        return (
            <div>
                {this.display()}
            </div>
        );
    }
}

export default PrikazJedneAkademskeGodine;