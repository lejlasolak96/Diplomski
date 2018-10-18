import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Button, Col, Collapse, Row} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

import PrikazDetaljaGrupe from './PrikazDetaljaGrupe';

class PrikazJedneGrupe extends Component {

    constructor(props) {
        super(props);
        this.state = {
            opened: false,
            edit: null,
            grupa: null
        };
    };

    componentDidMount() {
        this.getGroup();
    }

    async getGroup() {

        let grupa = {};

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        await fetch(API_ROOT + '/grupe/' + this.props.id, options)
            .then(result => result.json())
            .then(data => {
                if (data.grupa) grupa = data.grupa;
            })
            .catch(err => {
                console.log(err);
            });

        await fetch(API_ROOT + '/grupe/' + this.props.id + '/semestar', options)
            .then(result => result.json())
            .then(data => {
                if (data.semestar) grupa.semestar = data.semestar;
            })
            .catch(err => {
                console.log(err);
            });

        await fetch(API_ROOT + '/semestri/' + grupa.semestar.id + '/akademskaGodina', options)
            .then(result => result.json())
            .then(data => {
                if (data.akademskaGodina) grupa.semestar.akademskaGodina = data.akademskaGodina;
            })
            .catch(err => {
                console.log(err);
            });

        this.setState({grupa: grupa});
    }

    toggle = () => {

        this.setState({opened: !this.state.opened});
    };

    deleteGroupFn = (id) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'DELETE',
            headers: myHeaders
        };

        fetch(API_ROOT + '/grupe/' + id, options)
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

    displayGroup() {

        const {grupa} = this.state;

        if (grupa) {

            return (
                <Card>
                    <CardHeader>
                        <Row>
                            <Col>{grupa.id}</Col>
                            <Col>{grupa.naziv}</Col>
                            <Col>{grupa.broj_studenata}</Col>
                            <Col>{grupa.semestar.naziv}</Col>
                            <Col>{grupa.semestar.redni_broj}</Col>
                            <Col>{grupa.semestar.akademskaGodina.naziv}</Col>
                            <Col><Button color = {"danger"}
                                         onClick = {() => {
                                             if (window.confirm('Da li ste sigurni da želite obrisati grupu? ' +
                                                     'Akcija nema povratka i brišu se svi vezani podaci za grupu.')) this.deleteGroupFn(grupa.id)
                                         }}>Obriši</Button></Col>
                            <Col>
                                <a href = {"/uredjivanjeGrupe/" + grupa.id}>
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
                            <PrikazDetaljaGrupe id = {grupa.id}/>
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
                {this.displayGroup()}
            </div>
        );
    }
}

export default PrikazJedneGrupe;
