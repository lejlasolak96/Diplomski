import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, Table, Collapse, Input, CardHeader, Button, Row, Col} from 'reactstrap';
import Popup from "reactjs-popup";
import Moment from 'react-moment';

import {getAllStudentsExamPoints, getStudents} from '../../../queries/queries';
import {deleteExamPoints} from '../../../mutations/mutations';

import UredjivanjeJednihBodova from './UredjivanjeJednihBodova';

class PrikazSvihStudentovihBodova extends Component {

    deletePoints = (id) => {

        this.props.deleteExamPoints({
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

        let data = this.props.getAllStudentsExamPoints;

        if (!data.loading) {
            if (data.studentoviBodoviSvihIspita) {

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
                                    <td></td>
                                    <td></td>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    data.studentoviBodoviSvihIspita.map((bodovi) => (
                                        <tr key = {bodovi.id}>
                                            <td>{bodovi.ispit.vrstaIspita.naziv}</td>
                                            <td><Moment date = {bodovi.ispit.datum_odrzavanja} format = {"DD/MM/YYYY"}/>
                                            </td>
                                            <td>{bodovi.bodovi}</td>
                                            <td>{bodovi.ocjena}</td>
                                            <td>{bodovi.ispit.max_bodova}</td>
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
    graphql(getAllStudentsExamPoints, {
        name: "getAllStudentsExamPoints",
        options: (props) => {
            return {
                variables: {
                    student_id: props.student_id
                }
            }
        }
    }),
    graphql(deleteExamPoints,
        {
            name: "deleteExamPoints"
        }
    )
)(PrikazSvihStudentovihBodova);