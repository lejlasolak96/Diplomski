import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, Table, Collapse, Input, CardHeader, Button, Row, Col} from 'reactstrap';
import Popup from "reactjs-popup";

import {getAllStudentsHomeworkPoints, getStudents} from '../../../queries/queries';
import {deleteHomeworkPoints} from '../../../mutations/mutations';

import UredjivanjeJednihBodova from './UredjivanjeJednihBodova';

class PrikazSvihStudentovihBodova extends Component {

    deletePoints = (id) => {

        this.props.deleteHomeworkPoints({
            variables: {
                id: id
            }
        })
            .then(function () {
                alert("Uspješno obrisani bodovi");
                window.location.reload();
            })
            .catch(function (error) {
                alert(error.message);
            });
    };

    displayPoints() {

        let data = this.props.getAllStudentsHomeworkPoints;

        if (!data.loading) {
            if (data.studentoviBodoviSvihSpirala) {

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
                                    <td></td>
                                    <td></td>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    data.studentoviBodoviSvihSpirala.map((bodovi) => (
                                        <tr key = {bodovi.id}>
                                            <td>{bodovi.spirala.broj_spirale}</td>
                                            <td>{bodovi.bodovi}</td>
                                            <td>{bodovi.spirala.max_bodova}</td>
                                            <td><Button color = {"danger"}
                                                        onClick = {() => {
                                                            if (window.confirm('Da li ste sigurni da želite obrisati odabrane bodove?')) this.deletePoints(bodovi.id)
                                                        }}>Obriši</Button></td>
                                            <td>
                                                <Popup
                                                    trigger = {<Button color = {"success"}>Uredi</Button>}
                                                    modal>
                                                    <div>
                                                        <UredjivanjeJednihBodova id = {bodovi.id}/>
                                                    </div>
                                                </Popup>
                                            </td>
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

export default compose(
    graphql(getAllStudentsHomeworkPoints, {
        name: "getAllStudentsHomeworkPoints",
        options: (props) => {
            return {
                variables: {
                    student_id: props.student_id
                }
            }
        }
    }),
    graphql(deleteHomeworkPoints,
        {
            name: "deleteHomeworkPoints"
        }
    )
)(PrikazSvihStudentovihBodova);