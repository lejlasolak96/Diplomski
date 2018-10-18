import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, Button, Col, Collapse, Row} from 'reactstrap';
import Moment from 'react-moment';

import {getExam} from '../../../queries/queries';

import PrikazDetaljaIspitaStudent from './PrikazDetaljaIspitaStudent';

class PrikazJednogIspitaStudent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            opened: false,
            edit: null
        };
    };

    toggle = () => {

        this.setState({opened: !this.state.opened});
    };

    displayExams() {

        const {ispit} = this.props.getExam;

        if (ispit) {

            return (
                <Card>
                    <CardHeader>
                        <Row>
                            <Col>{ispit.id}</Col>
                            <Col>{ispit.max_bodova}</Col>
                            <Col>{ispit.vrstaIspita.naziv}</Col>
                            <Col><Moment date = {ispit.datum_odrzavanja} format = {"DD/MM/YYYY"}/></Col>
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
                            <PrikazDetaljaIspitaStudent id = {ispit.id}/>
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

export default compose(
    graphql(getExam,
        {
            name: "getExam",
            options: (props) => {
                return {
                    variables: {
                        id: props.id
                    }
                }
            }
        }
    )
)(PrikazJednogIspitaStudent);
