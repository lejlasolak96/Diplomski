import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, Button, Col, Collapse, Row} from 'reactstrap';
import Moment from 'react-moment';

import {getExams, getExam} from '../../../queries/queries';
import {deleteExam} from '../../../mutations/mutations';

import PrikazDetaljaIspita from './PrikazDetaljaIspita';

class PrikazJednogIspita extends Component {

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

    deleteExamFn = async (id) => {

        const message = await this.props.deleteExam({
            variables: {
                id: id
            },
            refetchQueries: [{query: getExams}]
        })
            .catch(function (error) {
                console.log(error.message);
            });

        alert(message.data.obrisiIspit.message);
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
                            <Col><Button color = {"danger"}
                                         onClick = {() => {
                                             if (window.confirm('Da li ste sigurni da želite obrisati ispit? ' +
                                                     'Akcija nema povratka i brišu se svi vezani podaci za isti.')) this.deleteExamFn(ispit.id)
                                         }}>Obriši</Button></Col>
                            <Col>
                                <a href = {"/uredjivanjeIspita/" + ispit.id}>
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
                            <PrikazDetaljaIspita id = {ispit.id}/>
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
    ),
    graphql(deleteExam,
        {
            name: "deleteExam"
        }
    )
)(PrikazJednogIspita);
