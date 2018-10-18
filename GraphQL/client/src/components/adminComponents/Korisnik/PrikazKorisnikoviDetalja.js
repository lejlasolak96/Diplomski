import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, Button, Input, Table} from 'reactstrap';

import {getUser, getUsers, getUserTypesQuery} from '../../../queries/queries';
import {addPrivilege, editPrivilege, deletePrivilege} from '../../../mutations/mutations';

class PrikazKorisnikoviDetalja extends Component {

    constructor(props) {
        super(props);
        this.state = {
            disabledRow: [],
            saveEdited: [],
            enabledRowIndex: null,
            disabled: true,
            vrsta_korisnika_id: null,
            vrsta_korisnika_idN: null,
            id: null
        };
    }

    submitPrivilege = async (osoba_id) => {

        await this.props.addPrivilege({
            variables: {
                vrsta_korisnika_id: this.state.vrsta_korisnika_idN,
                osoba_id: osoba_id
            },
            refetchQueries: [{query: getUsers}]
        })
            .catch(function (error) {
                alert(error.message);
            });

        this.setState({vrsta_korisnika_idN: null});
    }

    submitDeletePrivilege = (id) => {

        this.props.deletePrivilege({
            variables: {
                id: id
            },
            refetchQueries: [{query: getUsers}]
        })
            .then(function () {
                alert("Uspješno obrisana privilegija");
            })
            .catch(function (error) {
                alert(error.message);
            });

    }

    submitEditPrivilege = async (e) => {

        await this.props.editPrivilege({
            variables: {
                vrsta_korisnika_id: this.state.vrsta_korisnika_id,
                id: this.state.id
            },
            refetchQueries: [{query: getUsers}]
        })
            .then(function () {
            })
            .catch(function (error) {
                alert(error.message);
            });

        this.setState({enabledRowIndex: null, disabledRow: [], disabled: true, saveEdited: []});
    }

    editClick(i, privilege) {

        this.setState({disabled: !this.state.disabled});

        if (this.state.enabledRowIndex === i && !this.state.disabledRow[i])
            this.setState({enabledRowIndex: null});
        else
            this.setState({enabledRowIndex: i});

        if (this.state.disabledRow[i] === undefined) this.state.disabledRow[i] = false;
        else this.state.disabledRow[i] = !this.state.disabledRow[i];

        this.state.saveEdited[i] = !this.state.disabledRow[i];

        this.setState({vrsta_korisnika_id: privilege.vrstaKorisnika.id, id: privilege.id});
    }

    cancelClick(i) {

        this.setState({disabled: !this.state.disabled});

        if (this.state.enabledRowIndex === i && !this.state.disabledRow[i])
            this.setState({enabledRowIndex: null});
        else
            this.setState({enabledRowIndex: i});

        if (this.state.disabledRow[i] === undefined) this.state.disabledRow[i] = false;
        else this.state.disabledRow[i] = !this.state.disabledRow[i];

        this.state.saveEdited[i] = !this.state.disabledRow[i];

        this.setState({vrsta_korisnika_id: null, id: null});
    }

    displayUserTypes(id) {
        let data = this.props.getUserTypesQuery;
        if (!data.loading) {
            if (data.vrsteKorisnika) {
                return data.vrsteKorisnika.map(vrsta => {
                    return (
                        <option value = {vrsta.id}
                                selected = {vrsta.id === id}
                                key = {vrsta.id}>{vrsta.naziv}</option>
                    );
                });
            }
        }
    }

    displayUserDetails() {

        const {osoba} = this.props.getUser;
        if (osoba) {
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
                                {
                                    osoba.index ? <td>Index</td> : null
                                }
                                <td>Verifikovan</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                <tr>
                                    <td>{osoba.ime}</td>
                                    <td>{osoba.prezime}</td>
                                    <td>{osoba.nalog.username}</td>
                                    <td>{osoba.spol}</td>
                                    {
                                        osoba.index ? <td>{osoba.index}</td> : null
                                    }
                                    <td>{osoba.nalog.verified ? "Da" : "Ne"}</td>
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
                            {osoba.emails.map(item => {
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
                        <p>Privilegije:</p>
                        <Table hover = {true}
                               striped = {true}
                               responsive = {true}>
                            <thead style = {{fontSize: "14pt"}}>
                            <tr>
                                <td>Vrsta korisnika</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            </thead>
                            <tbody>
                            {osoba.privilegije.map((item, i) => {
                                return (
                                    <tr key = {item.id}>
                                        <td>
                                            <Input
                                                type = {"select"}
                                                onChange = {(e) => {
                                                    this.setState({vrsta_korisnika_id: e.target.value})
                                                }}
                                                disabled = {this.state.disabledRow[i] === undefined ? true : this.state.disabledRow[i]}>
                                                {this.displayUserTypes(item.vrstaKorisnika.id)}
                                            </Input>
                                        </td>
                                        <td>
                                            <Button color = {"danger"}
                                                    onClick = {() => {
                                                        if (window.confirm('Da li ste sigurni da želite obrisati privilegiju?'))
                                                            this.submitDeletePrivilege(item.id)
                                                    }}>Obriši</Button>
                                        </td>
                                        {
                                            this.state.disabledRow[i] || this.state.disabledRow[i] === undefined ?
                                                <td><Button color = "warning" onClick = {() => {
                                                    this.editClick(i, item)
                                                }}
                                                            disabled = {this.state.enabledRowIndex === i ? false :
                                                                this.state.enabledRowIndex !== null}>Uredi</Button></td>
                                                :
                                                <td><Button onClick = {() => {
                                                    this.cancelClick(i)
                                                }}
                                                            disabled = {this.state.enabledRowIndex === i ? false :
                                                                this.state.enabledRowIndex !== null}>Odustani</Button>
                                                </td>
                                        }
                                        {
                                            this.state.saveEdited[i] ? <td><Button color = "success"
                                                                                   onClick = {this.submitEditPrivilege.bind(this)}>Sačuvaj</Button>
                                            </td> : <td></td>
                                        }
                                    </tr>
                                );
                            })}
                            </tbody>
                        </Table>
                        <Input
                            type = {"select"}
                            onChange = {(e) => {
                                this.setState({vrsta_korisnika_idN: e.target.value})
                            }}
                            style = {{marginBottom: "20px"}}>
                            <option selected = {true} disabled = {true}>Odaberite vrstu korisnika</option>
                            {this.displayUserTypes(null)}
                        </Input>
                        <Button style = {{marginBottom: "20px"}}
                                color = {"success"}
                                disabled = {!this.state.vrsta_korisnika_idN}
                                onClick = {() => {
                                    this.submitPrivilege(osoba.id)
                                }}>Dodaj privilegiju</Button>
                    </div>
                </div>
            );
        } else {
            return ( <div>Nije odabran korisnik</div> );
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

export default compose(
    graphql(getUser, {
        name: "getUser",
        options: (props) => {
            return {
                variables: {
                    id: props.userID
                }
            }
        }
    }),
    graphql(getUserTypesQuery, {
        name: "getUserTypesQuery"
    }),
    graphql(addPrivilege,
        {
            name: "addPrivilege"
        }),
    graphql(editPrivilege,
        {
            name: "editPrivilege"
        }),
    graphql(deletePrivilege,
        {
            name: "deletePrivilege"
        })
)(PrikazKorisnikoviDetalja);