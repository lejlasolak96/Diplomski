import React, {Component} from 'react';
import {Card, CardBody, Table, CardHeader, Row} from 'reactstrap';
import Moment from 'react-moment';
import {API_ROOT} from "../../../api-config";

class PrikazBodovaSvihIspita extends Component {

    constructor(props) {
        super(props);
        this.state = {
            opened: false,
            bodovi: [],
            error: null
        };
    };

    componentDidMount() {
        this.getPoints();
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

        await fetch(API_ROOT + '/studenti/ispitBodovi', options)
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

    displayPoints() {

        if (this.state.bodovi) {

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
                                this.state.bodovi.map((bodovi) => (
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
                        <Row>{this.state.error}</Row>
                    </CardHeader>
                </Card>
            );
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

export default PrikazBodovaSvihIspita;