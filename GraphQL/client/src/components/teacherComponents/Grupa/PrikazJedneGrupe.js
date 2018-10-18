import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, Button, Col, Collapse, Row} from 'reactstrap';

import {getGroup, getGroups} from '../../../queries/queries';
import {deleteGroup} from '../../../mutations/mutations';

import PrikazDetaljaGrupe from './PrikazDetaljaGrupe';

class PrikazJedneGrupe extends Component {

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

    deleteGroupFn = async (id) => {

        const message = await this.props.deleteGroup({
            variables: {
                id: id
            },
            refetchQueries: [{query: getGroups}]
        })
            .catch(function (error) {
                console.log(error.message);
            });

        alert(message.data.obrisiGrupu.message);
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
                            <Col><Button color = {"danger"}
                                         onClick = {() => {
                                             if (window.confirm('Da li ste sigurni da želite obrisati grupu? ' +
                                                     'Akcija nema povratka i brišu se svi vezani podaci za grupu.')) this.deleteGroupFn(grupa.id)
                                         }}>Obriši</Button></Col>
                            <Col>
                                <a href = {"/uredjivanjeGrupe/" + grupa.id}>
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
                            <PrikazDetaljaGrupe id = {grupa.id}/>
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
    ),
    graphql(deleteGroup,
        {
            name: "deleteGroup"
        }
    )
)(PrikazJedneGrupe);
