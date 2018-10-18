import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, Table, Collapse, Input, CardHeader, Button, Row, Col} from 'reactstrap';
import Popup from "reactjs-popup";
import Moment from 'react-moment';

import {getMyAllExamPoints} from '../../../queries/queries';

class PrikazBodovaSvihIspita extends Component {

    displayPoints() {

        let data = this.props.data;

        if (!data.loading) {
            if (data.mojiBodoviSvihIspita) {

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
                                    <td>Osvojeni bodovi</td>
                                    <td>Osvojena ocjena</td>
                                    <td>Maximalni broj bodova</td>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    data.mojiBodoviSvihIspita.map((bodovi) => (
                                        <tr key = {bodovi.id}>
                                            <td>{bodovi.ispit.vrstaIspita.naziv}</td>
                                            <td><Moment date = {bodovi.ispit.datum_odrzavanja} format = {"DD/MM/YYYY"}/>
                                            </td>
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
            <div className = "animated fadeIn">
                <Card>
                    <CardHeader>
                        <h3>Bodovi ispita</h3>
                    </CardHeader>
                </Card>
                <Card>
                    <CardBody>
                        {this.displayPoints()}
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default graphql(getMyAllExamPoints)(PrikazBodovaSvihIspita);