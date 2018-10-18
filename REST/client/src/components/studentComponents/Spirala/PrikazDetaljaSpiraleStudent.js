import React, {Component} from 'react';
import {Card, CardBody, Table, Collapse, Input, CardHeader, Button} from 'reactstrap';
import Moment from 'react-moment';
import {API_ROOT} from "../../../api-config";

class PrikazDetaljaSpiraleStudent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            opened: [false, false],
            spirala: null
        };

        this.getHomework();
    };

    componentDidMount() {
        this.getHomework();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.id !== this.props.id) {
            this.getHomework();
        }
    }

    async getHomework() {

        let spirala = {};

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        await fetch(API_ROOT + '/spirale/' + this.props.id, options)
            .then(result => result.json())
            .then(data => {
                if (data.spirala) spirala = data.spirala;
            })
            .catch(err => {
                console.log(err);
            });

        await fetch(API_ROOT + '/spirale/' + this.props.id + '/semestar', options)
            .then(result => result.json())
            .then(data => {
                if (data.semestar) spirala.semestar = data.semestar;
            })
            .catch(err => {
                console.log(err);
            });

        await fetch(API_ROOT + '/semestri/' + spirala.semestar.id + '/akademskaGodina', options)
            .then(result => result.json())
            .then(data => {
                if (data.akademskaGodina) spirala.semestar.akademskaGodina = data.akademskaGodina;
            })
            .catch(err => {
                console.log(err);
            });

        this.setState({spirala: spirala});
    }

    toggle = (i) => {

        let op = this.state.opened;
        op[i] = !op[i];

        this.setState({opened: op});
    };

    displayHomeworkDetails() {

        if (this.state.spirala) {
            return (
                <div>
                    <div>
                        <Table hover = {true}
                               bordered = {true}
                               responsive = {true}>
                            <thead style = {{fontSize: "14pt"}}>
                            <tr>
                                <td>ID</td>
                                <td>Broj spirale</td>
                                <td>Maximalni broj bodova</td>
                                <td>Datum objave</td>
                                <td>Rok za predaju</td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{this.state.spirala.id}</td>
                                <td>{this.state.spirala.broj_spirale}</td>
                                <td>{this.state.spirala.max_bodova}</td>
                                <td><Moment date = {this.state.spirala.datum_objave} format = {"DD/MM/YYYY"}/></td>
                                <td><Moment date = {this.state.spirala.rok} format = {"DD/MM/YYYY"}/></td>
                            </tr>
                            </tbody>
                        </Table>
                    </div>
                    <div>
                        <Card>
                            <CardHeader id = "headingOne">
                                <Button block color = "link" className = "text-left m-0 p-0"
                                        onClick = {() => this.toggle(0)}>
                                    <h5 className = "m-0 p-0">Postavka</h5>
                                </Button>
                            </CardHeader>
                            <Collapse isOpen = {this.state.opened[0]} aria-labelledby = "headingOne">
                                <CardBody>
                                    <Input type = {"textarea"}
                                           disabled = {true}
                                           style = {{height: "25em"}}
                                           value = {this.state.spirala.postavka}/>
                                </CardBody>
                            </Collapse>
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <CardHeader id = "headingOne">
                                <Button block color = "link" className = "text-left m-0 p-0"
                                        onClick = {() => this.toggle(1)}>
                                    <h5 className = "m-0 p-0">Semestar</h5>
                                </Button>
                            </CardHeader>
                            <Collapse isOpen = {this.state.opened[1]} aria-labelledby = "headingOne">
                                <CardBody>
                                    <Table hover = {true}
                                           bordered = {true}
                                           responsive = {true}>
                                        <thead style = {{fontSize: "14pt"}}>
                                        <tr>
                                            <td>ID</td>
                                            <td>Naziv</td>
                                            <td>Redni broj</td>
                                            <td>Početak</td>
                                            <td>Kraj</td>
                                            <td>Akademska godina</td>
                                            <td>Trenutna akademska godina</td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            <tr>
                                                <td>{this.state.spirala.semestar.id}</td>
                                                <td>{this.state.spirala.semestar.naziv}</td>
                                                <td>{this.state.spirala.semestar.redni_broj}</td>
                                                <td><Moment date = {this.state.spirala.semestar.pocetak}
                                                            format = {"DD/MM/YYYY"}/></td>
                                                <td><Moment date = {this.state.spirala.semestar.kraj}
                                                            format = {"DD/MM/YYYY"}/></td>
                                                <td>{this.state.spirala.semestar.akademskaGodina.naziv}</td>
                                                <td>{this.state.spirala.semestar.akademskaGodina.trenutna ? "Da" : "Ne"}</td>
                                            </tr>
                                        }
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Collapse>
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <CardHeader>
                                <Button block color = "link" className = "text-left m-0 p-0"
                                        href = {"/spiralaBodovi/" + this.state.spirala.id}>
                                    <h5 className = "m-0 p-0">Pregled bodova</h5>
                                </Button>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            );
        } else {
            return (
                <div>Nije odabrana spirala</div>
            );
        }
    }

    render() {
        return (
            <div id = "osoba-details">
                <Card>
                    <CardBody>
                        {this.displayHomeworkDetails()}
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default PrikazDetaljaSpiraleStudent;