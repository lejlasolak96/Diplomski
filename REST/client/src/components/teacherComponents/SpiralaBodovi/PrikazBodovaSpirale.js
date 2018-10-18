import React, {Component} from 'react';
import {Card, CardBody, Table, Collapse, Input, CardHeader, Button, Row, Col} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

class PrikazBodovaSpirale extends Component {

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

    async getPoints() {

        let bodovi = [];

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        await fetch(API_ROOT + '/spiralaBodovi/spirala/' + this.props.match.params.spirala_id, options)
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

            promises.push(
                fetch(API_ROOT + '/spiralaBodovi/' + bod.id + '/student', options)
                    .then(result => result.json())
                    .then(data => {
                        if (data.student) {
                            bod.student = data.student;
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
                                <td>Ime</td>
                                <td>Prezime</td>
                                <td>Index</td>
                                <td>Osvojeni bodovi</td>
                                <td>Maximalni broj bodova</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.bodovi.map((bodovi) => (
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

export default PrikazBodovaSpirale;