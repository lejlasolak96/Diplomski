import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Button, ListGroup, ListGroupItem, Table} from 'reactstrap';
import Popup from "reactjs-popup";
import Moment from 'react-moment';
import {API_ROOT} from "../../../api-config";

import PrikazDetaljaGrupe from '../Grupa/PrikazDetaljaGrupe';

class PrikazDetaljaGodine extends Component {

    constructor(props) {
        super(props);
        this.state = {
            akademskaGodina: null
        };
    };

    componentDidMount() {
        this.getYear();
    }

    async getYear() {

        let godina = {};

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        await fetch(API_ROOT + '/akademskeGodine/' + this.props.id, options)
            .then(result => result.json())
            .then(data => {
                if (data.akademskaGodina) godina = data.akademskaGodina;
            })
            .catch(err => {
                console.log(err);
            });

        await fetch(API_ROOT + '/akademskeGodine/' + this.props.id + '/semestri', options)
            .then(result => result.json())
            .then(data => {
                if (data.semestri) godina.semestri = data.semestri;
            })
            .catch(err => {
                console.log(err);
            });

        let promises = [];

        godina.semestri.map(semestar => {

            promises.push(
                fetch(API_ROOT + '/semestri/' + semestar.id + '/grupe', options)
                    .then(result => result.json())
                    .then(data => {
                        if (data.grupe) semestar.grupe = data.grupe;
                    })
                    .catch(err => {
                        console.log(err);
                    })
            );
        });

        await Promise.all(promises)
            .then(() => {
                this.setState({akademskaGodina: godina});
            });
    }

    displayYearDetails() {

        const {akademskaGodina} = this.state;
        if (akademskaGodina) {
            return (
                <div>
                    <div>
                        <Table hover = {true}
                               bordered = {true}
                               responsive = {true}>
                            <thead style = {{fontSize: "14pt"}}>
                            <tr>
                                <td>ID</td>
                                <td>Naziv</td>
                                <td>Trenutna</td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{akademskaGodina.id}</td>
                                <td>{akademskaGodina.naziv}</td>
                                <td>{akademskaGodina.trenutna ? "Da" : "Ne"}</td>
                            </tr>
                            </tbody>
                        </Table>
                    </div>
                    <div>
                        <p>Semestri:</p>
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
                                <td>Grupe</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                akademskaGodina.semestri.map((semestar) => {

                                    return (
                                        <tr key = {semestar.id}>
                                            <td>{semestar.id}</td>
                                            <td>{semestar.naziv}</td>
                                            <td>{semestar.redni_broj}</td>
                                            <td><Moment date = {semestar.pocetak} format = {"DD/MM/YYYY"}/></td>
                                            <td><Moment date = {semestar.kraj} format = {"DD/MM/YYYY"}/></td>
                                            <td>
                                                <ListGroup>
                                                    {semestar.grupe.map((item) => {
                                                        return (
                                                            <Popup key = {item.id}
                                                                   trigger = {<ListGroupItem color = {"info"}
                                                                                             tag = "button"
                                                                                             action>{item.naziv}</ListGroupItem>}
                                                                   modal
                                                                   closeOnDocumentClick>
                                                                <div>
                                                                    <PrikazDetaljaGrupe id = {item.id}/>
                                                                </div>
                                                            </Popup>
                                                        );
                                                    })}
                                                </ListGroup>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                        </Table>
                    </div>
                </div>
            );
        } else {
            return ( <div>Nije odabrana akademska godina</div> );
        }
    }

    render() {
        return (
            <div id = "osoba-details">
                <Card>
                    <CardBody>
                        {this.displayYearDetails()}
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default PrikazDetaljaGodine;