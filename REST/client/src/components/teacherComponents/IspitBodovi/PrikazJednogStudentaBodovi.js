import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Button, Col, Collapse, Row} from 'reactstrap';
import Popup from "reactjs-popup";
import {API_ROOT} from "../../../api-config";

import PrikazSvihStudentovihBodova from './PrikazSvihStudentovihBodova';
import UnosJednihBodova from './UnosJednihBodova';

class PrikazJednogStudentaBodovi extends Component {

    constructor(props) {
        super(props);
        this.state = {
            opened: false,
            student: null,
            ispiti: []
        };
    };

    componentDidMount() {
        this.getStudent();
        this.getExams();
    }

    async getExams() {

        let ispiti = [];

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        await fetch(API_ROOT + '/ispiti', options)
            .then(result => result.json())
            .then(data => {
                if (data.ispiti) ispiti = data.ispiti;
            })
            .catch(err => {
                console.log(err);
            });

        let promises = [];

        ispiti.map(ispit => {

            promises.push(
                fetch(API_ROOT + '/ispiti/' + ispit.id + '/vrstaIspita', options)
                    .then(result => result.json())
                    .then(data => {
                        if (data.vrstaIspita) ispit.vrstaIspita = data.vrstaIspita;
                    })
                    .catch(err => {
                        console.log(err);
                    })
            );

            promises.push(
                fetch(API_ROOT + '/ispiti/' + ispit.id + '/semestar', options)
                    .then(result => result.json())
                    .then(data => {
                        if (data.semestar) ispit.semestar = data.semestar;
                    })
                    .catch(err => {
                        console.log(err);
                    })
            );
        });

        await Promise.all(promises)
            .then(() => {
                this.setState({ispiti: ispiti});
            });
    }

    getStudent() {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/studenti/' + this.props.id, options)
            .then(result => result.json())
            .then(data => {
                if (data.student) this.setState({student: data.student});
            })
            .catch(err => {
                console.log(err);
            })
    }

    toggle = () => {

        this.setState({opened: !this.state.opened});
    };

    displayUser() {

        const {student} = this.state;

        if (student) {
            return (
                <Card>
                    <CardHeader>
                        <Row>
                            <Col>{student.id}</Col>
                            <Col>{student.ime}</Col>
                            <Col>{student.prezime}</Col>
                            <Col>{student.index}</Col>
                            <Col>
                                {this.state.opened ?
                                    <Button color = "primary" onClick = {() => {
                                        this.toggle()
                                    }} style = {{marginBottom: '1rem'}}>Sakrij bodove</Button>
                                    : <Button color = "primary" onClick = {() => {
                                        this.toggle()
                                    }} style = {{marginBottom: '1rem'}}>Prikaži bodove</Button>
                                }
                            </Col>
                            <Col>
                                <Popup
                                    trigger = {<Button color = {"success"} tag = "button">Unesi bodove</Button>}
                                    modal>
                                    <div>
                                        <UnosJednihBodova refetch = {(r) => {
                                            if (r === true) this.getStudent();
                                        }} ispiti = {this.state.ispiti} student_id = {student.id}/>
                                    </div>
                                </Popup>
                            </Col>
                        </Row>
                    </CardHeader>
                    <Collapse isOpen = {this.state.opened}>
                        <PrikazSvihStudentovihBodova student_id = {student.id}/>
                    </Collapse>
                </Card>
            );
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

export default PrikazJednogStudentaBodovi;
