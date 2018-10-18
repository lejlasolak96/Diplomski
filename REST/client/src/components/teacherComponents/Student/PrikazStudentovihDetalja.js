import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Table} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

class PrikazStudentovihDetalja extends Component {

    constructor(props) {
        super(props);
        this.state = {
            student: null
        };
    }

    componentDidMount() {
        this.getStudent();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.id !== this.props.id) {
            this.getStudent();
        }
    }

    async getStudent() {

        let user = {};

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        await fetch(API_ROOT + '/studenti/' + this.props.id, options)
            .then(result => result.json())
            .then(data => {
                if (data.student) user = data.student;
            })
            .catch(err => {
                console.log(err);
            });

        await fetch(API_ROOT + '/studenti/' + this.props.id + "/nalog", options)
            .then(result => result.json())
            .then(data => {
                if (data.nalog) user.nalog = data.nalog;
            })
            .catch(err => {
                console.log(err);
            });

        await fetch(API_ROOT + '/studenti/' + this.props.id + "/emails", options)
            .then(result => result.json())
            .then(data => {
                if (data.emails) user.emails = data.emails;
            })
            .catch(err => {
                console.log(err);
            });

        await fetch(API_ROOT + '/studenti/' + this.props.id + "/repozitoriji", options)
            .then(result => result.json())
            .then(data => {
                if (data.repozitoriji) user.repozitoriji = data.repozitoriji;
            })
            .catch(err => {
                console.log(err);
            });

        this.setState({student: user});
    }

    displayUserDetails() {

        const {student} = this.state;
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

export default PrikazStudentovihDetalja;