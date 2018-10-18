import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Button, Col, Collapse, Row} from 'reactstrap';
import Moment from 'react-moment';
import {API_ROOT} from "../../../api-config";

import PrikazDetaljaSemestra from './PrikazDetaljaSemestra';

class PrikazJednogSemestra extends Component {

    constructor(props) {
        super(props);
        this.state = {
            opened: false,
            edit: null,
            semestar: null
        };
    };

    componentDidMount() {
        this.getSemester();
    }

    async getSemester() {

        let semestar = {};

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        await fetch(API_ROOT + '/semestri/' + this.props.id, options)
            .then(result => result.json())
            .then(data => {
                if (data.semestar) semestar = data.semestar;
            })
            .catch(err => {
                console.log(err);
            });

        await fetch(API_ROOT + '/semestri/' + this.props.id + '/akademskaGodina', options)
            .then(result => result.json())
            .then(data => {
                if (data.akademskaGodina) semestar.akademskaGodina = data.akademskaGodina;
            })
            .catch(err => {
                console.log(err);
            });

        this.setState({semestar: semestar});
    }

    toggle = () => {

        this.setState({opened: !this.state.opened});
    };

    deleteSemesterFn = (id) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'DELETE',
            headers: myHeaders,
        };

        fetch(API_ROOT + '/semestri/' + id, options)
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

    displaySemester() {

        const {semestar} = this.state;

        if (semestar) {

            return (
                <Card>
                    <CardHeader>
                        <Row>
                            <Col>{semestar.id}</Col>
                            <Col>{semestar.naziv}</Col>
                            <Col>{semestar.redni_broj}</Col>
                            <Col><Moment date = {semestar.pocetak} format = {"DD/MM/YYYY"}/></Col>
                            <Col><Moment date = {semestar.kraj} format = {"DD/MM/YYYY"}/></Col>
                            <Col>{semestar.akademskaGodina.naziv}</Col>
                            <Col><Button color = {"danger"}
                                         onClick = {() => {
                                             if (window.confirm('Da li ste sigurni da želite obrisati semestar? ' +
                                                     'Akcija nema povratka i brišu se svi vezani podaci za isti.')) this.deleteSemesterFn(semestar.id)
                                         }}>Obriši</Button></Col>
                            <Col>
                                <a href = {"/uredjivanjeSemestra/" + semestar.id}>
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
                            <PrikazDetaljaSemestra id = {semestar.id}/>
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
                {this.displaySemester()}
            </div>
        );
    }
}

export default PrikazJednogSemestra;
