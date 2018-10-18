import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {Card, CardBody, Table, Collapse, Input, CardHeader, Button, Row, Col} from 'reactstrap';

import {getHomeworkPoints} from '../../../queries/queries';

class PrikazBodovaSpirale extends Component {

    displayPoints() {

        let data = this.props.data;

        if (!data.loading) {

            if (data.bodoviSaSpirale) {

                return (
                    <div>
                        <div>
                            <Table hover = {true}
                                   bordered = {true}
                                   responsive = {true}>
                                <thead style = {{fontSize: "14pt"}}>
                                <tr>
                                    <td>Broj spirale</td>
                                    <td>Ime</td>
                                    <td>Prezime</td>
                                    <td>Index</td>
                                    <td>Osvojeni bodovi</td>
                                    <td>Maximalni broj bodova</td>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    data.bodoviSaSpirale.map((bodovi) => (
                                        <tr key = {bodovi.id}>
                                            <td>{bodovi.spirala.broj_spirale}</td>
                                            <td>{bodovi.student.ime}</td>
                                            <td>{bodovi.student.prezime}</td>
                                            <td>{bodovi.student.index}</td>
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
                    <CardBody>
                        {this.displayPoints()}
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default graphql(getHomeworkPoints, {
    options: (props) => {
        return {
            variables: {
                spirala_id: props.match.params.spirala_id
            }
        }
    }
})(PrikazBodovaSpirale);