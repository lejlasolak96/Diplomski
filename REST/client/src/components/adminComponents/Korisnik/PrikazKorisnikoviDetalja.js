import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Button, Input, Table} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

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
            id: null,
            user: null,
            vrsteKorisnika: []
        };
    }

    componentDidMount() {
        this.getUser();
        this.getUserTypes();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userID !== this.props.userID) {
            this.getUser();
        }
    }

    getUserTypes() {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        const options = {
            method: 'GET',
            headers: myHeaders
        }

        let request = new Request(API_ROOT + '/vrsteKorisnika', options);

        fetch(request)
            .then(res => res.json())
            .then((data) => {
                this.setState({
                    vrsteKorisnika: data.vrsteKorisnika
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    async getUser() {

        let user = {};

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        await fetch(API_ROOT + '/korisnici/' + this.props.userID, options)
            .then(result => result.json())
            .then(data => {
                if (data.korisnik) user = data.korisnik;
            })
            .catch(err => {
                console.log(err);
            });

        await fetch(API_ROOT + '/korisnici/' + this.props.userID + "/nalog", options)
            .then(result => result.json())
            .then(data => {
                if (data.nalog) user.nalog = data.nalog;
            })
            .catch(err => {
                console.log(err);
            });

        await fetch(API_ROOT + '/korisnici/' + this.props.userID + "/emails", options)
            .then(result => result.json())
            .then(data => {
                if (data.emails) user.emails = data.emails;
            })
            .catch(err => {
                console.log(err);
            });

        await fetch(API_ROOT + '/korisnici/' + this.props.userID + "/privilegije", options)
            .then(result => result.json())
            .then(data => {
                if (data.privilegije) {
                    user.privilegije = data.privilegije;
                }
                this.setState({user: user});
            })
            .catch(err => {
                console.log(err);
            });
    }

    submitPrivilege = () => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({vrsta_korisnika_id: this.state.vrsta_korisnika_idN})
        };

        fetch(API_ROOT + '/korisnici/' + this.state.user.id + "/privilegije", options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    this.setState({vrsta_korisnika_idN: null});
                    alert(data.message);
                    this.getUser();
                }
                else alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    }

    submitDeletePrivilege = (id) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'DELETE',
            headers: myHeaders
        };

        fetch(API_ROOT + '/privilegije/' + id, options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    this.getUser();
                }
                else alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    }

    submitEditPrivilege = async (e) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify({vrsta_korisnika_id: this.state.vrsta_korisnika_id})
        };

        fetch(API_ROOT + '/privilegije/' + this.state.id, options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    this.setState({enabledRowIndex: null, disabledRow: [], disabled: true, saveEdited: []});
                    alert(data.message);
                    this.getUser();
                }
                else alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });
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

        if (this.state.vrsteKorisnika) {
            return this.state.vrsteKorisnika.map(vrsta => {
                return (
                    <option value = {vrsta.id}
                            selected = {vrsta.id === id}
                            key = {vrsta.id}>{vrsta.naziv}
                    </option>
                );
            });
        }
    }

    displayUserDetails() {

        if (this.state.user) {
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
                                    this.state.user.index ? <td>Index</td> : null
                                }
                                <td>Verifikovan</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                <tr>
                                    <td>{this.state.user.ime}</td>
                                    <td>{this.state.user.prezime}</td>
                                    <td>{this.state.user.nalog.username}</td>
                                    <td>{this.state.user.spol}</td>
                                    {
                                        this.state.user.index ? <td>{this.state.user.index}</td> : null
                                    }
                                    <td>{this.state.user.nalog.verified ? "Da" : "Ne"}</td>
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
                            {this.state.user.emails.map(item => {
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
                            {this.state.user.privilegije.map((item, i) => {
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
                                    this.submitPrivilege(this.state.user.id)
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
            <div id = "this.state.user-details">
                <Card>
                    <CardBody>
                        {this.displayUserDetails()}
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default PrikazKorisnikoviDetalja;