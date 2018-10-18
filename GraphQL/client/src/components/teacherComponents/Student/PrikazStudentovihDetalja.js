import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {Card, CardBody, CardHeader, Table} from 'reactstrap';

import {getStudent} from '../../../queries/queries';

class PrikazStudentovihDetalja extends Component {

    displayUserDetails() {

        const {student} = this.props.data;
        if (student) {
            return (
                <div>
                    <div>
                        <p>Podaci:</p>
                        <Table hover = {true}
                               bordered = {true}
                               responsive = {true}>
                            <thead style = {{fontSize: "14pt"}}>
                            <tr>
                                <td>Ime</td>
                                <td>Prezime</td>
                                <td>Username</td>
                                <td>Spol</td>
                                <td>Index</td>
                                <td>Verifikovan</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                <tr>
                                    <td>{student.ime}</td>
                                    <td>{student.prezime}</td>
                                    <td>{student.nalog.username}</td>
                                    <td>{student.spol}</td>
                                    <td>{student.index}</td>
                                    <td>{student.nalog.verified ? "Da" : "Ne"}</td>
                                </tr>
                            }
                            </tbody>
                        </Table>
                    </div>
                    <div>
                        <p>E-mailovi:</p>
                        <Table hover = {true}
                               striped = {true}
                               bordered = {true}
                               responsive = {true}>
                            <thead style = {{fontSize: "14pt"}}>
                            <tr>
                                <td>Adresa</td>
                                <td>Fakultetski</td>
                            </tr>
                            </thead>
                            <tbody>
                            {student.emails.map(item => {
                                return (
                                    <tr key = {item.id}>
                                        <td>{item.adresa}</td>
                                        <td>{item.fakultetska ? "Da" : "Ne"}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </Table>
                    </div>
                    <div>
                        <p>Repozitoriji:</p>
                        <Table hover = {true}
                               striped = {true}
                               bordered = {true}
                               responsive = {true}>
                            <thead style = {{fontSize: "14pt"}}>
                            <tr>
                                <td>URL</td>
                                <td>SSH</td>
                                <td>Naziv</td>
                            </tr>
                            </thead>
                            <tbody>
                            {student.repozitoriji.map(item => {
                                return (
                                    <tr key = {item.id}>
                                        <td>{item.url}</td>
                                        <td>{item.ssh}</td>
                                        <td>{item.naziv}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </Table>
                    </div>
                </div>
            );
        } else {
            return ( <div>Nije odabran student</div> );
        }
    }

    render() {
        return (
            <div id = "osoba-details">
                <Card>
                    <CardBody>
                        {this.displayUserDetails()}
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default graphql(getStudent, {
    options: (props) => {
        return {
            variables: {
                id: props.userID
            }
        }
    }
})(PrikazStudentovihDetalja);