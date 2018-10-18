import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Button, Col, Collapse, Row} from 'reactstrap';
import Moment from 'react-moment';
import {API_ROOT} from "../../../api-config";

import PrikazDetaljaIspitaStudent from './PrikazDetaljaIspitaStudent';

class PrikazJednogIspitaStudent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            opened: false,
            edit: null,
            ispit: null
        };
    };

    componentDidMount() {
        this.getExam();
    }

    async getExam() {

        let ispit = {};

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        await fetch(API_ROOT + '/ispiti/' + this.props.id, options)
            .then(result => result.json())
            .then(data => {
                if (data.ispit) ispit = data.ispit;
            })
            .catch(err => {
                console.log(err);
            });

        await fetch(API_ROOT + '/ispiti/' + this.props.id + '/vrstaIspita', options)
            .then(result => result.json())
            .then(data => {
                if (data.vrstaIspita) ispit.vrstaIspita = data.vrstaIspita;
            })
            .catch(err => {
                console.log(err);
            });

        this.setState({ispit: ispit});
    }

    toggle = () => {

        this.setState({opened: !this.state.opened});
    };

    displayExams() {

        if (this.state.ispit) {

            return (
                <Card>
                    <CardHeader>
                        <Row>
                            <Col>{this.state.ispit.id}</Col>
                            <Col>{this.state.ispit.max_bodova}</Col>
                            <Col>{this.state.ispit.vrstaIspita.naziv}</Col>
                            <Col><Moment date = {this.state.ispit.datum_odrzavanja} format = {"DD/MM/YYYY"}/></Col>
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
                            <PrikazDetaljaIspitaStudent id = {this.state.ispit.id}/>
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
                {this.displayExams()}
            </div>
        );
    }
}

export default PrikazJednogIspitaStudent;