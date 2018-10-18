import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, Button, Col, Collapse, Row} from 'reactstrap';
import Moment from 'react-moment';

import {getHomework} from '../../../queries/queries';

import PrikazDetaljaSpiraleStudent from './PrikazDetaljaSpiraleStudent';

class PrikazJedneSpiraleStudent extends Component {

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

    displaySemester() {

        const {spirala} = this.props.getHomework;

        if (spirala) {

            return (
                <Card>
                    <CardHeader>
                        <Row>
                            <Col>{spirala.id}</Col>
                            <Col>{spirala.broj_spirale}</Col>
                            <Col>{spirala.max_bodova}</Col>
                            <Col><Moment date = {spirala.datum_objave} format = {"DD/MM/YYYY"}/></Col>
                            <Col><Moment date = {spirala.rok} format = {"DD/MM/YYYY"}/></Col>
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
                            <PrikazDetaljaSpiraleStudent id = {spirala.id}/>
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

export default compose(
    graphql(getHomework,
        {
            name: "getHomework",
            options: (props) => {
                return {
                    variables: {
                        id: props.id
                    }
                }
            }
        }
    )
)(PrikazJedneSpiraleStudent);
