import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Button, Col, Collapse, Row} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

import PrikazStudentovihDetalja from './PrikazStudentovihDetalja';

class PrikazJednogStudenta extends Component {

    constructor(props) {
        super(props);
        this.state = {
            opened: false,
            student: null
        };
    };

    componentDidMount() {
        this.getStudent();
    }

    async getStudent() {

        let user = {};

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        await fetch(API_ROOT + '/studenti/' + this.props.id, options)
            .then(result => result.json())
            .then(data => {
                if (data.student) user = data.student;
            })
            .catch(err => {
                console.log(err);
            });

        await fetch(API_ROOT + '/studenti/' + this.props.id + "/nalog", options)
            .then(result => result.json())
            .then(data => {
                if (data.nalog) {
                    user.nalog = data.nalog;
                }
            })
            .catch(err => {
                console.log(err);
            });

        this.setState({student: user});
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
                            <Col>{student.spol}</Col>
                            <Col>{student.nalog.username}</Col>
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
                            <PrikazStudentovihDetalja id = {student.id}/>
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

export default PrikazJednogStudenta;
