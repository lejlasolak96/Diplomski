import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, Button, Col, Collapse, Row} from 'reactstrap';

import {getGroup, getGroups} from '../../../queries/queries';
import {deleteGroup} from '../../../mutations/mutations';

import PrikazDetaljaGrupeStudent from './PrikazDetaljaGrupeStudent';

class PrikazJedneGrupeStudent extends Component {

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

    displayGroup() {

        const {grupa} = this.props.getGroup;

        if (grupa) {

            return (
                <Card>
                    <CardHeader>
                        <Row>
                            <Col>{grupa.id}</Col>
                            <Col>{grupa.naziv}</Col>
                            <Col>{grupa.broj_studenata}</Col>
                            <Col>{grupa.semestar.naziv}</Col>
                            <Col>{grupa.semestar.redni_broj}</Col>
                            <Col>{grupa.semestar.akademskaGodina.naziv}</Col>
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
                            <PrikazDetaljaGrupeStudent id = {grupa.id}/>
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
                {this.displayGroup()}
            </div>
        );
    }
}

export default compose(
    graphql(getGroup,
        {
            name: "getGroup",
            options: (props) => {
                return {
                    variables: {
                        id: props.id
                    }
                }
            }
        }
    )
)(PrikazJedneGrupeStudent);
