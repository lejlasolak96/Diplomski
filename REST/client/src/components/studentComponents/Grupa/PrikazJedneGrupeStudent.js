import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Button, Col, Collapse, Row} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

import PrikazDetaljaGrupeStudent from './PrikazDetaljaGrupeStudent';

class PrikazJedneGrupeStudent extends Component {

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

    displayGroup() {

        if (this.state.grupa) {

            return (
                <Card>
                    <CardHeader>
                        <Row>
                            <Col>{this.state.grupa.id}</Col>
                            <Col>{this.state.grupa.naziv}</Col>
                            <Col>{this.state.grupa.broj_studenata}</Col>
                            <Col>{this.state.grupa.semestar.naziv}</Col>
                            <Col>{this.state.grupa.semestar.redni_broj}</Col>
                            <Col>{this.state.grupa.semestar.akademskaGodina.naziv}</Col>
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
                            <PrikazDetaljaGrupeStudent id = {this.state.grupa.id}/>
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

export default PrikazJedneGrupeStudent;
