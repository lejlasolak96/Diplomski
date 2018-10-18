import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, Button, Col, Collapse, Row} from 'reactstrap';

import {getYear, getAcademicYears} from '../../../queries/queries';
import {deleteAcademicYear} from '../../../mutations/mutations';

import PrikazDetaljaGodine from './PrikazDetaljaGodine';

class PrikazJedneAkademskeGodine extends Component {

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

    deleteYear = async (id) => {

        const message = await this.props.deleteAcademicYear({
            variables: {
                id: id
            },
            refetchQueries: [{query: getAcademicYears}]
        })
            .catch(function (error) {
                console.log(error.message);
            });

        alert(message.data.obrisiAkademskuGodinu.message);
    };

    displayGroup() {

        const {akademskaGodina} = this.props.getYear;

        if (akademskaGodina) {

            return (
                <Card>
                    <CardHeader>
                        <Row>
                            <Col>{akademskaGodina.id}</Col>
                            <Col>{akademskaGodina.naziv}</Col>
                            <Col>{akademskaGodina.trenutna ? "Da" : "Ne"}</Col>
                            <Col><Button color = {"danger"}
                                         onClick = {() => {
                                             if (window.confirm('Da li ste sigurni da želite obrisati akademsku godinu? ' +
                                                     'Akcija nema povratka i brišu se svi vezani podaci za istu.')) this.deleteYear(akademskaGodina.id)
                                         }}>Obriši</Button></Col>
                            <Col>
                                <a href = {"/uredjivanjeAkademskeGodine/" + akademskaGodina.id}>
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
                            <PrikazDetaljaGodine id = {akademskaGodina.id}/>
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
    graphql(getYear,
        {
            name: "getYear",
            options: (props) => {
                return {
                    variables: {
                        id: props.id
                    }
                }
            }
        }
    ),
    graphql(deleteAcademicYear,
        {
            name: "deleteAcademicYear"
        }
    )
)(PrikazJedneAkademskeGodine);
