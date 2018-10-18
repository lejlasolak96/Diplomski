import React, {Component} from 'react';
import {Card, CardBody, CardFooter, Table, Input, CardHeader, Button, Row, Col} from 'reactstrap';
import Moment from 'react-moment';
import {API_ROOT} from "../../../api-config";

class UnosJednihBodova extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ispit_id: null,
            bodovi: null,
            ocjena: null,
            error: null
        };
    }

    submitPoints = (e) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        let variables = {
            ispit_id: this.state.ispit_id,
            bodovi: this.state.bodovi,
            ocjena: this.state.ocjena,
            student_id: this.props.student_id
        };

        const options = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/ispitBodovi', options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    this.props.refetch(true);
                    alert(data.message);
                }
                else alert(data.error);
            })
            .catch(err => {
                console.log(err);
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
                               bordered = {true}
                               style = {{marginBottom: "20px"}}>
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

        if (this.props.ispiti.length !== 0) {

            return this.props.ispiti.map((ispit) => {

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
                        {this.state.error}
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

    render() {
        return (
            <div>
                {this.displayForm()}
            </div>
        );
    }
}

export default UnosJednihBodova;