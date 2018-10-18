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
            spirale: []
        };
    };

    componentDidMount() {
        this.getStudent();
        this.getHomeworks();
    }

    getHomeworks() {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/spirale', options)
            .then(result => result.json())
            .then(data => {
                if (data.spirale) this.setState({spirale: data.spirale});
            })
            .catch(err => {
                console.log(err);
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
                                        }} spirale = {this.state.spirale} student_id = {student.id}/>
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
