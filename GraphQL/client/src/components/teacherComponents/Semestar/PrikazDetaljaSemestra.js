import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {Card, CardBody, CardHeader, ListGroupItem, ListGroup, Button, Table} from 'reactstrap';
import Popup from "reactjs-popup";
import Moment from 'react-moment';

import {getSemester} from '../../../queries/queries';

import PrikazDetaljaGrupe from '../Grupa/PrikazDetaljaGrupe';
import PrikazDetaljaGodine from '../AkademskaGodina/PrikazDetaljaGodine';

class PrikazDetaljaSemestra extends Component {

    displaySemesterDetails() {

        const {semestar} = this.props.data;
        if (semestar) {
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
                                <td>Redni broj</td>
                                <td>Početak</td>
                                <td>Kraj</td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{semestar.id}</td>
                                <td>{semestar.naziv}</td>
                                <td>{semestar.redni_broj}</td>
                                <td><Moment date = {semestar.pocetak} format = {"DD/MM/YYYY"}/></td>
                                <td><Moment date = {semestar.kraj} format = {"DD/MM/YYYY"}/></td>
                            </tr>
                            </tbody>
                        </Table>
                    </div>
                    <div>
                        <p>Akademska godina:</p>
                        <Table hover = {true}
                               bordered = {true}
                               responsive = {true}>
                            <thead style = {{fontSize: "14pt"}}>
                            <tr>
                                <td>ID</td>
                                <td>Naziv</td>
                                <td>Trenutna</td>
                                <td></td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{semestar.akademskaGodina.id}</td>
                                <td>{semestar.akademskaGodina.naziv}</td>
                                <td>{semestar.akademskaGodina.trenutna ? "Da" : "Ne"}</td>
                                <td>
                                    <ListGroup>
                                        <Popup
                                            trigger = {<ListGroupItem tag = "button" color = {"info"}
                                                                      action>Detaljnije</ListGroupItem>}
                                            modal
                                            closeOnDocumentClick>
                                            <div>
                                                <PrikazDetaljaGodine id = {semestar.akademskaGodina.id}/>
                                            </div>
                                        </Popup>
                                    </ListGroup>
                                </td>
                            </tr>
                            </tbody>
                        </Table>
                    </div>
                    <div>
                        <p>Grupe: </p>
                        {
                            semestar.grupe.map((grupa) => {
                                return (
                                    <ListGroup key = {grupa.id}>
                                        <Popup
                                            trigger = {<ListGroupItem color = {"info"} tag = "button"
                                                                      action>{grupa.naziv}</ListGroupItem>}
                                            modal
                                            closeOnDocumentClick>
                                            <div>
                                                <PrikazDetaljaGrupe id = {grupa.id}/>
                                            </div>
                                        </Popup>
                                    </ListGroup>
                                );
                            })
                        }
                    </div>
                </div>
            );
        } else {
            return ( <div>Nije odabran semestar</div> );
        }
    }

    render() {
        return (
            <div id = "osoba-details">
                <Card>
                    <CardBody>
                        {this.displaySemesterDetails()}
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default graphql(getSemester, {
    options: (props) => {
        return {
            variables: {
                id: props.id
            }
        }
    }
})(PrikazDetaljaSemestra);