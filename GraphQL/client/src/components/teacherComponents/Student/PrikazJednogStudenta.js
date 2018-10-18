import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, Button, Col, Collapse, Row} from 'reactstrap';

import {getStudent} from '../../../queries/queries';

import PrikazStudentovihDetalja from './PrikazStudentovihDetalja';

class PrikazJednogStudenta extends Component {

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
                            <PrikazStudentovihDetalja userID = {student.id}/>
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

export default compose(
    graphql(getStudent,
        {
            name: "getStudent",
            options: (props) => {
                return {
                    variables: {
                        id: props.userID
                    }
                }
            }
        }
    )
)(PrikazJednogStudenta);
