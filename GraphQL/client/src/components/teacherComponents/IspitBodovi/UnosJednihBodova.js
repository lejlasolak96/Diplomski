import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardFooter, Table, Input, CardHeader, Button, Row, Col} from 'reactstrap';
import moment from 'moment'
import Moment from 'react-moment';

import {getExams, getStudents} from '../../../queries/queries';
import {createExamPoints} from "../../../mutations/mutations";

class UnosJednihBodova extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ispit_id: null,
            bodovi: null,
            ocjena: null
        };
    }

    submitPoints = (e) => {

        this.props.createExamPoints({
            variables: {
                ispit_id: this.state.ispit_id,
                bodovi: this.state.bodovi,
                ocjena: this.state.ocjena,
                student_id: this.props.student_id
            },
            refetchQueries: [{query: getStudents}]
        })
            .then(function () {
                alert("Uspješno kreirani bodovi");
            })
            .catch(function (error) {
                alert(error.message);
            });
    }

    displayForm() {
        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardBody>
                        <label>Ispit: </label>
                        <Table hover = {true}
                               responsive = {true}
                               striped = {true}
                               bordered = {true}>
                            <thead style = {{fontSize: "14pt"}}>
                            <tr>
                                <td>ID</td>
                                <td>Maximalni broj bodova</td>
                                <td>Vrsta ispita</td>
                                <td>Datum održavanja</td>
                                <td>Naziv semestra</td>
                                <td>Redni broj semestra</td>
                                <td></td>
                            </tr>
                            </thead>
                            <tbody>
                            {this.getExamsFn()}
                            </tbody>
                        </Table>
                        <Input
                            onChange = {(e) => {
                                this.setState({bodovi: e.target.value})
                            }}
                            style = {{marginBottom: "20px"}} type = {"number"}
                            placeholder = {"Osvojeni bodovi"}/>
                        <Input
                            onChange = {(e) => {
                                this.setState({ocjena: e.target.value})
                            }}
                            style = {{marginBottom: "20px"}} type = {"number"}
                            placeholder = {"Ocjena (opcionalno)"}/>
                    </CardBody>
                    <CardFooter>
                        <Button color = {"success"}
                                disabled = {!this.state.ispit_id || !this.state.bodovi}
                                onClick = {this.submitPoints.bind(this)}>Kreiraj bodove</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    getExamsFn() {

        let data = this.props.getExams;

        if (data && !data.loading) {
            if (data.ispiti) {

                return data.ispiti.map((ispit) => {

                    return (
                        <tr key = {ispit.id}>
                            <td>{ispit.id}</td>
                            <td>{ispit.max_bodova}</td>
                            <td>{ispit.vrstaIspita.naziv}</td>
                            <td><Moment date = {ispit.datum_odrzavanja} format = {"DD/MM/YYYY"}/></td>
                            <td>{ispit.semestar.naziv}</td>
                            <td>{ispit.semestar.redni_broj}</td>
                            {
                                !this.state.ispit_id || this.state.ispit_id !== ispit.id ?
                                    <td><Button color = {"primary"}
                                                disabled = {this.state.ispit_id && this.state.ispit_id !== ispit.id}
                                                onClick = {() => {
                                                    this.setState({ispit_id: ispit.id})
                                                }}>Odaberi</Button></td>
                                    :
                                    <td><Button onClick = {() => {
                                        this.setState({ispit_id: null})
                                    }}>Poništi</Button></td>
                            }
                        </tr>
                    );
                });
            }
            else {
                return (
                    <tr>
                        <td>
                            {data.error.message}
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                );
            }
        }
    }

    render() {
        return (
            <div>
                {this.displayForm()}
            </div>
        );
    }
}

export default compose(
    graphql(createExamPoints,
        {
            name: "createExamPoints"
        }),
    graphql(getExams,
        {
            name: "getExams"
        }
    )
)(UnosJednihBodova);