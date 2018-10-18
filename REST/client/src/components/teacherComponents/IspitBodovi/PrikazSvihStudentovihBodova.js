import React, {Component} from 'react';
import {Card, CardBody, Table, Collapse, Input, CardHeader, Button, Row, Col} from 'reactstrap';
import Popup from "reactjs-popup";
import Moment from 'react-moment';
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

        await fetch(API_ROOT + '/ispitBodovi/student/' + this.props.student_id, options)
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
                fetch(API_ROOT + '/ispitBodovi/' + bod.id + '/ispit', options)
                    .then(result => result.json())
                    .then(data => {
                        if (data.ispit) {
                            bod.ispit = data.ispit;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            );
        });

        await Promise.all(promises);

        promises = [];

        await bodovi.map(bod => {

            promises.push(
                fetch(API_ROOT + '/ispiti/' + bod.ispit.id + '/vrstaIspita', options)
                    .then(result => result.json())
                    .then(data => {
                        if (data.vrstaIspita) bod.ispit.vrstaIspita = data.vrstaIspita;
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

        fetch(API_ROOT + '/ispitBodovi/' + id, options)
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
                                this.state.bodovi.map((bodovi) => (
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
                                                    <UredjivanjeJednihBodova refetch = {(r) => {
                                                        if (r === true) this.getPoints();
                                                    }} ispitBodovi = {bodovi} id = {bodovi.id}/>
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