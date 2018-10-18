import React, {Component} from 'react';
import {Card, CardBody, Table, Collapse, Input, CardHeader, Button, Row, Col} from 'reactstrap';
import Popup from "reactjs-popup";
import {API_ROOT} from "../../../api-config";

import UredjivanjeJednihBodova from './UredjivanjeJednihBodova';

class PrikazSvihStudentovihBodova extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bodovi: [],
            error: null
        };
    };

    componentDidMount() {
        this.getPoints();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.student_id !== this.props.student_id) {
            this.getPoints();
        }
    }

    async getPoints() {

        let bodovi = [];

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        await fetch(API_ROOT + '/spiralaBodovi/student/' + this.props.student_id, options)
            .then(result => result.json())
            .then(data => {
                if (data.bodovi) bodovi = data.bodovi;
                if (data.error) this.setState({error: data.error});
            })
            .catch(err => {
                console.log(err);
            });

        let promises = [];

        await bodovi.map(bod => {

            promises.push(
                fetch(API_ROOT + '/spiralaBodovi/' + bod.id + '/spirala', options)
                    .then(result => result.json())
                    .then(data => {
                        if (data.spirala) {
                            bod.spirala = data.spirala;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            );
        });

        await Promise.all(promises)
            .then(() => {
                this.setState({bodovi: bodovi});
            });
    }

    deletePoints = (id) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'DELETE',
            headers: myHeaders
        };

        fetch(API_ROOT + '/spiralaBodovi/' + id, options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    this.getPoints();
                    alert(data.message);
                }
                else alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    };

    displayPoints() {

        if (this.state.bodovi.length !== 0) {

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
                                this.state.bodovi.map((bodovi) => (
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
                                                    <UredjivanjeJednihBodova refetch = {(r) => {
                                                        if (r === true) this.getPoints();
                                                    }} spiralaBodovi = {bodovi} id = {bodovi.id}/>
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
                        <Row>{this.state.error}</Row>
                    </CardHeader>
                </Card>
            );
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

export default PrikazSvihStudentovihBodova;