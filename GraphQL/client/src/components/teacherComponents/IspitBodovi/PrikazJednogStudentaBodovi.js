import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, Button, Col, Collapse, Row} from 'reactstrap';
import Popup from "reactjs-popup";

import {getStudent} from '../../../queries/queries';

import PrikazSvihStudentovihBodova from './PrikazSvihStudentovihBodova';
import UnosJednihBodova from './UnosJednihBodova';

class PrikazJednogStudentaBodovi extends Component {

    constructor(props) {
        super(props);
        this.state = {
            opened: false
        };
    };

    toggle = () => {

        this.setState({opened: !this.state.opened});
    };

    displayUser() {

        const {student} = this.props.getStudent;

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
                                        <UnosJednihBodova student_id = {student.id}/>
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

export default compose(
    graphql(getStudent,
        {
            name: "getStudent",
            options: (props) => {
                return {
                    variables: {
                        id: props.id
                    }
                }
            }
        }
    )
)(PrikazJednogStudentaBodovi);
