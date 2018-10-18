import React, {Component} from 'react';
import {Card, CardBody, Table, CardHeader, Row} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

class BodoviSvihSpirala extends Component {

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

        await fetch(API_ROOT + '/studenti/spiralaBodovi', options)
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
                                <td>Broj spirale</td>
                                <td>Osvojeni bodovi</td>
                                <td>Maximalni broj bodova</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.bodovi.map((bodovi) => (
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

export default BodoviSvihSpirala;