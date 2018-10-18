import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {Card, CardBody, CardHeader, Table} from 'reactstrap';
import Moment from 'react-moment';

import {getGroup} from '../../../queries/queries';

class PrikazDetaljaGrupe extends Component {

    displayGroupDetails() {

        const {grupa} = this.props.data;
        if (grupa) {
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
                                    <td>{grupa.id}</td>
                                    <td>{grupa.naziv}</td>
                                    <td>{grupa.broj_studenata}</td>
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
                                    <td>{grupa.semestar.id}</td>
                                    <td>{grupa.semestar.naziv}</td>
                                    <td>{grupa.semestar.redni_broj}</td>
                                    <td><Moment date = {grupa.semestar.pocetak} format = {"DD/MM/YYYY"}/></td>
                                    <td><Moment date = {grupa.semestar.kraj} format = {"DD/MM/YYYY"}/></td>
                                    <td>{grupa.semestar.akademskaGodina.naziv}</td>
                                    <td>{grupa.semestar.akademskaGodina.trenutna ? "Da" : "Ne"}</td>
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
                            {grupa.studenti.map((item, i) => {
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
            <div id = "osoba-details">
                <Card>
                    <CardBody>
                        {this.displayGroupDetails()}
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default graphql(getGroup, {
    options: (props) => {
        return {
            variables: {
                id: props.id
            }
        }
    }
})(PrikazDetaljaGrupe);