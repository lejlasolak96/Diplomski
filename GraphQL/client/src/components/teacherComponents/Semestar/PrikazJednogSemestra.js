import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, Button, Col, Collapse, Row} from 'reactstrap';
import Moment from 'react-moment';

import {getSemester, getSemesters, getAcademicYears} from '../../../queries/queries';
import {deleteSemester} from '../../../mutations/mutations';

import PrikazDetaljaSemestra from './PrikazDetaljaSemestra';

class PrikazJednogSemestra extends Component {

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

    deleteSemesterFn = async (id) => {

        const message = await this.props.deleteSemester({
            variables: {
                id: id
            },
            refetchQueries: [{query: getSemesters}]
        })
            .catch(function (error) {
                console.log(error.message);
            });

        alert(message.data.obrisiSemestar.message);
    };

    displaySemester() {

        const {semestar} = this.props.getSemester;

        if (semestar) {

            return (
                <Card>
                    <CardHeader>
                        <Row>
                            <Col>{semestar.id}</Col>
                            <Col>{semestar.naziv}</Col>
                            <Col>{semestar.redni_broj}</Col>
                            <Col><Moment date = {semestar.pocetak} format = {"DD/MM/YYYY"}/></Col>
                            <Col><Moment date = {semestar.kraj} format = {"DD/MM/YYYY"}/></Col>
                            <Col>{semestar.akademskaGodina.naziv}</Col>
                            <Col><Button color = {"danger"}
                                         onClick = {() => {
                                             if (window.confirm('Da li ste sigurni da želite obrisati semestar? ' +
                                                     'Akcija nema povratka i brišu se svi vezani podaci za isti.')) this.deleteSemesterFn(semestar.id)
                                         }}>Obriši</Button></Col>
                            <Col>
                                <a href = {"/uredjivanjeSemestra/" + semestar.id}>
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
                            <PrikazDetaljaSemestra id = {semestar.id}/>
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
    graphql(getSemester,
        {
            name: "getSemester",
            options: (props) => {
                return {
                    variables: {
                        id: props.id
                    }
                }
            }
        }
    ),
    graphql(deleteSemester,
        {
            name: "deleteSemester"
        }
    )
)(PrikazJednogSemestra);
