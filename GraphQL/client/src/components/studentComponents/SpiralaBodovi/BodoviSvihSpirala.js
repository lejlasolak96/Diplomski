import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, Table, Collapse, Input, CardHeader, Button, Row, Col} from 'reactstrap';
import Popup from "reactjs-popup";

import {getMyAllHomeworkPoints} from '../../../queries/queries';

class BodoviSvihSpirala extends Component {

    displayPoints() {

        let data = this.props.data;

        if (!data.loading) {
            if (data.mojiBodoviSvihSpirala) {

                return (
                    <div>
                        <div>
                            <Table hover = {true}
                                   bordered = {true}
                                   responsive = {true}>
                                <thead style = {{fontSize: "14pt"}}>
                                <tr>
                                    <td>Broj spirale</td>
                                    <td>Osvojeni bodovi</td>
                                    <td>Maximalni broj bodova</td>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    data.mojiBodoviSvihSpirala.map((bodovi) => (
                                        <tr key = {bodovi.id}>
                                            <td>{bodovi.spirala.broj_spirale}</td>
                                            <td>{bodovi.bodovi}</td>
                                            <td>{bodovi.spirala.max_bodova}</td>
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
                    <CardHeader>
                        <h3>Bodovi spirala</h3>
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

export default graphql(getMyAllHomeworkPoints)(BodoviSvihSpirala);