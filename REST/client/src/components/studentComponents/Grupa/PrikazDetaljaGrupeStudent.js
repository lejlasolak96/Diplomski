import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Table} from 'reactstrap';
import Moment from 'react-moment';
import {API_ROOT} from "../../../api-config";

class PrikazDetaljaGrupeStudent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            grupa: null
        };
    };

    componentDidMount() {
        this.getGroup();
    }

    async getGroup() {

        let grupa = {};

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        await fetch(API_ROOT + '/grupe/' + this.props.id, options)
            .then(result => result.json())
            .then(data => {
                if (data.grupa) grupa = data.grupa;
            })
            .catch(err => {
                console.log(err);
            });

        await fetch(API_ROOT + '/grupe/' + this.props.id + '/semestar', options)
            .then(result => result.json())
            .then(data => {
                if (data.semestar) grupa.semestar = data.semestar;
            })
            .catch(err => {
                console.log(err);
            });

        await fetch(API_ROOT + '/semestri/' + grupa.semestar.id + '/akademskaGodina', options)
            .then(result => result.json())
            .then(data => {
                if (data.akademskaGodina) grupa.semestar.akademskaGodina = data.akademskaGodina;
            })
            .catch(err => {
                console.log(err);
            });

        await fetch(API_ROOT + '/grupe/' + this.props.id + '/studenti', options)
            .then(result => result.json())
            .then(data => {
                if (data.studenti) grupa.studenti = data.studenti;
            })
            .catch(err => {
                console.log(err);
            });

        this.setState({grupa: grupa});
    }

    displayGroupDetails() {

        if (this.state.grupa) {
            return (
                <div>
                    <div>
                        <p>Podaci:</p>
                        <Table hover = {true}
                               bordered = {true}
                               responsive = {true}>
                            <thead style = {{fontSize: "14pt"}}>
                            <tr>
                                <td>ID</td>
                                <td>Naziv</td>
                                <td>Broj studenata</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                <tr>
                                    <td>{this.state.grupa.id}</td>
                                    <td>{this.state.grupa.naziv}</td>
                                    <td>{this.state.grupa.broj_studenata}</td>
                                </tr>
                            }
                            </tbody>
                        </Table>
                    </div>
                    <div>
                        <p>Semestar:</p>
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
                                    <td>{this.state.grupa.semestar.id}</td>
                                    <td>{this.state.grupa.semestar.naziv}</td>
                                    <td>{this.state.grupa.semestar.redni_broj}</td>
                                    <td><Moment date = {this.state.grupa.semestar.pocetak} format = {"DD/MM/YYYY"}/></td>
                                    <td><Moment date = {this.state.grupa.semestar.kraj} format = {"DD/MM/YYYY"}/></td>
                                    <td>{this.state.grupa.semestar.akademskaGodina.naziv}</td>
                                    <td>{this.state.grupa.semestar.akademskaGodina.trenutna ? "Da" : "Ne"}</td>
                                </tr>
                            }
                            </tbody>
                        </Table>
                    </div>
                    <div>
                        <p>Studenti:</p>
                        <Table hover = {true}
                               striped = {true}
                               bordered = {true}
                               responsive = {true}>
                            <thead style = {{fontSize: "14pt"}}>
                            <tr>
                                <td>ID</td>
                                <td>Ime</td>
                                <td>Prezime</td>
                                <td>Index</td>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.grupa.studenti.map((item, i) => {
                                return (
                                    <tr key = {i + 1}>
                                        <td>{item.id}</td>
                                        <td>{item.ime}</td>
                                        <td>{item.prezime}</td>
                                        <td>{item.index}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </Table>
                    </div>
                </div>
            );
        } else {
            return ( <div>Nije odabrana grupa</div> );
        }
    }

    render() {
        return (
            <div>
                <Card>
                    <CardBody>
                        {this.displayGroupDetails()}
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default PrikazDetaljaGrupeStudent;