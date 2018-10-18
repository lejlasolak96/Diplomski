import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Button, Col, Collapse, Row} from 'reactstrap';
import Moment from 'react-moment';
import {API_ROOT} from "../../../api-config";

import PrikazDetaljaIspita from './PrikazDetaljaIspita';

class PrikazJednogIspita extends Component {

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

    deleteExamFn = (id) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'DELETE',
            headers: myHeaders
        };

        fetch(API_ROOT + '/ispiti/' + id, options)
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

    displayExams() {

        const {ispit} = this.state;

        if (ispit) {

            return (
                <Card>
                    <CardHeader>
                        <Row>
                            <Col>{ispit.id}</Col>
                            <Col>{ispit.max_bodova}</Col>
                            <Col>{ispit.vrstaIspita.naziv}</Col>
                            <Col><Moment date = {ispit.datum_odrzavanja} format = {"DD/MM/YYYY"}/></Col>
                            <Col><Button color = {"danger"}
                                         onClick = {() => {
                                             if (window.confirm('Da li ste sigurni da želite obrisati ispit? ' +
                                                     'Akcija nema povratka i brišu se svi vezani podaci za isti.')) this.deleteExamFn(ispit.id)
                                         }}>Obriši</Button></Col>
                            <Col>
                                <a href = {"/uredjivanjeIspita/" + ispit.id}>
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
                            <PrikazDetaljaIspita id = {ispit.id}/>
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

export default PrikazJednogIspita;
