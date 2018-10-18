import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {Card, CardBody, Table, Collapse, Input, CardHeader, Button, Row, Col} from 'reactstrap';
import Moment from 'react-moment';

import {getExamPoints} from '../../../queries/queries';

class PrikazBodovaIspita extends Component {

    displayPoints() {

        let data = this.props.data;

        if (!data.loading) {
            if (data.bodoviSaIspita) {

                return (
                    <div>
                        <div>
                            <Table hover = {true}
                                   bordered = {true}
                                   responsive = {true}>
                                <thead style = {{fontSize: "14pt"}}>
                                <tr>
                                    <td>Vrsta ispita</td>
                                    <td>Datum održavanja</td>
                                    <td>Ime</td>
                                    <td>Prezime</td>
                                    <td>Index</td>
                                    <td>Osvojeni bodovi</td>
                                    <td>Osvojena ocjena</td>
                                    <td>Maximalni broj bodova</td>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    data.bodoviSaIspita.map((bodovi) => (
                                        <tr key = {bodovi.id}>
                                            <td>{bodovi.ispit.vrstaIspita.naziv}</td>
                                            <td><Moment date = {bodovi.ispit.datum_odrzavanja} format = {"DD/MM/YYYY"}/>
                                            </td>
                                            <td>{bodovi.student.ime}</td>
                                            <td>{bodovi.student.prezime}</td>
                                            <td>{bodovi.student.index}</td>
                                            <td>{bodovi.bodovi}</td>
                                            <td>{bodovi.ocjena}</td>
                                            <td>{bodovi.ispit.max_bodova}</td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </Table>
                        </div>
                    </div>
                );
            } else {
                return (
                    <Card>
                        <CardHeader>
                            <Row>{data.error.message}</Row>
                        </CardHeader>
                    </Card>
                );
            }
        }
    }

    render() {
        return (
            <div>
                <Card>
                    <CardBody>
                        {this.displayPoints()}
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default graphql(getExamPoints, {
    options: (props) => {
        return {
            variables: {
                ispit_id: props.match.params.ispit_id
            }
        }
    }
})(PrikazBodovaIspita);