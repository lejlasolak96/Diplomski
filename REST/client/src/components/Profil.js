import React, {Component} from 'react';
import {Card, CardBody, CardHeader, CardFooter, Row, Col, Input, Button, Table} from 'reactstrap';
import {Redirect} from 'react-router-dom';
import {API_ROOT} from "../api-config";

class Profil extends Component {

    constructor(props) {
        super(props);
        this.state = {
            disabledRow: [],
            enabledRowIndex: null,
            disabled: true,
            ime: null,
            prezime: null,
            index: null,
            spol: null,
            username: null,
            oldPassword: null,
            newPassword: null,
			confirmedPassword: null,
            slika: null,
            emailFields: [],
            saveEdited: [],
            fakultetska: null,
            adresa: null,
            id: null,
            prijavljeni: null,
            redirect: false
        };
    }

    componentDidMount() {
        this.getLoggedInUser();
    }

    async getLoggedInUser() {

        let user = null;

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        let request = new Request(API_ROOT + '/korisnici/prijavljeniKorisnik', options);

        await fetch(request)
            .then(res => res.json())
            .then(json => {
                if (json.korisnik) {
                    user = json.korisnik;
                }
            })
            .catch(function (err) {
                console.log(err);
            });

        await fetch(API_ROOT + '/korisnici/prijavljeniKorisnik/nalog', options)
            .then(result => result.json())
            .then(data => {
                if (data.nalog && user) user.nalog = data.nalog;
            })
            .catch(err => {
                console.log(err);
            });

        await fetch(API_ROOT + '/korisnici/prijavljeniKorisnik/emails', options)
            .then(result => result.json())
            .then(data => {
                if (data.emails && user) user.emails = data.emails;
            })
            .catch(err => {
                console.log(err);
            });

        await fetch(API_ROOT + '/korisnici/prijavljeniKorisnik/privilegije', options)
            .then(result => result.json())
            .then(data => {
                if (data.privilegije && user) {
                    user.privilegije = data.privilegije;
                }
                this.setState({prijavljeni: user});
            })
            .catch(err => {
                console.log(err);
            });
    }

    handleEmailValueChange = (idx) => (evt) => {

        const email = this.state.emailFields.map((e, sidx) => {
            if (idx !== sidx) return e;
            return {...e, adresa: evt.target.value};
        });

        this.setState({emailFields: email});
    }

    handleSelectValueChange = (idx) => (evt) => {

        const email = this.state.emailFields.map((e, sidx) => {
            if (idx !== sidx) return e;
            return {...e, fakultetska: evt.target.value === "true"};
        });

        this.setState({emailFields: email});
    }

    handleAddEmailField = () => {

        this.setState({
            emailFields: this.state.emailFields.concat([{
                adresa: '',
                fakultetska: false
            }])
        });
    }

    handleRemoveEmailField = (idx) => () => {
        this.setState({
            emailFields: this.state.emailFields.filter((s, sidx) => idx !== sidx)
        });
    }

    editEmailClick(i, email) {

        this.setState({disabled: !this.state.disabled});

        if (this.state.enabledRowIndex === i && !this.state.disabledRow[i])
            this.setState({enabledRowIndex: null});
        else
            this.setState({enabledRowIndex: i});

        if (this.state.disabledRow[i] === undefined) this.state.disabledRow[i] = false;
        else this.state.disabledRow[i] = !this.state.disabledRow[i];

        this.state.saveEdited[i] = !this.state.disabledRow[i];

        this.setState({fakultetska: email.fakultetska, adresa: email.adresa, id: email.id});
    }

    cancelEmailClick(i) {

        this.setState({disabled: !this.state.disabled});

        if (this.state.enabledRowIndex === i && !this.state.disabledRow[i])
            this.setState({enabledRowIndex: null});
        else
            this.setState({enabledRowIndex: i});

        if (this.state.disabledRow[i] === undefined) this.state.disabledRow[i] = false;
        else this.state.disabledRow[i] = !this.state.disabledRow[i];

        this.state.saveEdited[i] = !this.state.disabledRow[i];

        this.setState({fakultetska: null, adresa: null, id: null});
    }

    submitEmails = (e) => {

        let newEmails = {emails: this.state.emailFields};

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(newEmails)
        };

        let myRequest = new Request(API_ROOT + '/korisnici/emails', options);
        fetch(myRequest)
            .then(res => res.json())
            .then(res => {
                if (res.message) {
                    this.setState({emailFields: []});
                    alert(res.message);
                    this.getLoggedInUser();
                }
                else alert(res.error);
            })
            .catch(function (err) {
                alert(err);
            });
    }

    submitDeleteEmail = (id) => {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'DELETE',
            headers: headers
        };

        let myRequest = new Request(API_ROOT + '/emails/' + id, options);
        fetch(myRequest)
            .then(res => res.json())
            .then(res => {
                if (res.message) {
                    alert(res.message);
                    this.getLoggedInUser();
                }
                else alert(res.error);
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    submitEditEmail = (e) => {

        let editedEmail = {
            adresa: this.state.adresa,
            fakultetska: this.state.fakultetska
        };

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(editedEmail)
        }

        let myRequest = new Request(API_ROOT + '/emails/' + this.state.id, options);
        fetch(myRequest)
            .then(res => res.json())
            .then(res => {
                if (res.message) {
                    this.setState({enabledRowIndex: null, disabledRow: [], disabled: true, saveEdited: []});
                    alert(res.message);
                    this.getLoggedInUser();
                }
                else alert(res.error);
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    submitPersonalData = () => {

        let variables = {};
        if (this.state.ime) variables.ime = this.state.ime;
        if (this.state.prezime) variables.prezime = this.state.prezime;
        if (this.state.spol) variables.spol = this.state.spol;
        if (this.state.index) variables.index = this.state.index;

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(variables)
        }

        let myRequest = new Request(API_ROOT + '/korisnici/podaci', options);
        fetch(myRequest)
            .then(res => res.json())
            .then(res => {
                if (res.message) {
                    alert(res.message);
                    this.getLoggedInUser();
                }
                else alert(res.error);
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    submitUsername = (e) => {

        if (!this.state.username) alert("Niste unijeli novi username");

        else {
            let variables = {username: this.state.username};

            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

            const options = {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(variables)
            }

            let myRequest = new Request(API_ROOT + '/korisnici/username', options);
            fetch(myRequest)
                .then(res => res.json())
                .then(res => {
                    if (res.message) {
                        this.setState({redirect: true});
                        alert(res.message);
                    }
                    else alert(res.error);
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
    }

    submitPassword = (e) => {

		if (this.state.newPassword !== this.state.confirmedPassword)
        {
            alert("Passwordi se ne podudaraju");
            return;
        }
	
        let variables = {
            oldPassword: this.state.oldPassword,
            newPassword: this.state.newPassword
        };

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(variables)
        }

        let myRequest = new Request(API_ROOT + '/korisnici/password', options);
        fetch(myRequest)
            .then(res => res.json())
            .then(res => {
                if (res.message) {
                    this.setState({redirect: true});
                    alert(res.message);
                }
                else alert(res.error);
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    displayUserDetails() {

        if (this.state.prijavljeni) {

            return (
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader>
                                    <h3>Lični podaci</h3>
                                </CardHeader>
                                <CardBody>
                                    <Table
                                        responsive = {true}
                                        borderless = {true}>
                                        <tbody>
                                        <tr style = {{height: "50px"}}>
                                            <td><label>Ime: </label></td>
                                            <td><Input
                                                value = {this.state.ime ? this.state.ime : this.state.prijavljeni.ime}
                                                onChange = {(e) => {
                                                    this.setState({ime: e.target.value})
                                                }}/></td>
                                        </tr>
                                        <tr style = {{height: "50px"}}>
                                            <td><label>Prezime: </label></td>
                                            <td><Input
                                                value = {this.state.prezime ? this.state.prezime : this.state.prijavljeni.prezime}
                                                onChange = {(e) => {
                                                    this.setState({prezime: e.target.value})
                                                }}/></td>
                                        </tr>
                                        <tr style = {{height: "75px"}}>
                                            <td><label>Spol: </label></td>
                                            <td>
                                                <div>
                                                    <Input type = "radio" name = "spol" value = "M"
                                                           onChange = {(e) => this.setState({spol: e.target.value})}
                                                           checked = {this.state.spol ? this.state.spol === 'M' : this.state.prijavljeni.spol === "M"}/>
                                                    <label>Muški</label>
                                                </div>
                                                <div>
                                                    <Input type = "radio" name = "spol" value = "Z"
                                                           onChange = {(e) => this.setState({spol: e.target.value})}
                                                           checked = {this.state.spol ? this.state.spol === 'Z' : this.state.prijavljeni.spol === "Z"}/>
                                                    <label>Ženski</label>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr style = {{height: "50px"}}>
                                            <td><label>Verifikovan: </label></td>
                                            <td>{this.state.prijavljeni.nalog.verified ? "Da" : "Ne"}</td>
                                        </tr>
                                        {
                                            this.state.prijavljeni.index ?
                                                <tr style = {{height: "50px"}}>
                                                    <td><label>Index: </label></td>
                                                    <td>
                                                        <Input
                                                            onChange = {(e) => this.setState({index: e.target.value})}
                                                            value = {this.state.index ? this.state.index : this.state.prijavljeni.index}/>
                                                    </td>
                                                </tr>
                                                : null
                                        }
                                        <tr style = {{height: "50px"}}>
                                            <td><label>Privilegije:</label></td>
                                            <td>
                                                <ul>
                                                    {this.state.prijavljeni.privilegije.map(item => {
                                                        return <li key = {item.id}>{item.vrstaKorisnika.naziv}</li>
                                                    })}
                                                </ul>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </Table>
                                </CardBody>
                                <CardFooter>
                                    <Button color = "success"
                                            disabled = {!this.state.ime && !this.state.prezime && !this.state.spol && !this.state.index}
                                            onClick = {() => {
                                                this.submitPersonalData()
                                            }}>Sačuvaj promjene</Button>
                                </CardFooter>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <CardHeader>
                                    <h3>E-mailovi</h3>
                                </CardHeader>
                                <CardBody>
                                    <h4>Moji e-mailovi</h4>
                                    <Table
                                        responsive = {true}
                                        hover = {true}>
                                        <thead>
                                        <tr>
                                            <td>Fakultetski</td>
                                            <td>Adresa</td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.prijavljeni.emails.map((item, i) => {
                                            return (
                                                <tr key = {item.id}>
                                                    <td>
                                                        <Input
                                                            type = {"select"}
                                                            onChange = {(e) => {
                                                                this.setState({fakultetska: e.target.value})
                                                            }}
                                                            disabled = {this.state.disabledRow[i] === undefined ? true : this.state.disabledRow[i]}>
                                                            <option selected = {item.fakultetska === false}
                                                                    value = {false}>Ne
                                                            </option>
                                                            <option selected = {item.fakultetska === true}
                                                                    value = {true}>Da
                                                            </option>
                                                        </Input>
                                                    </td>
                                                    <td><Input
                                                        value = {this.state.adresa && this.state.disabledRow[i] === false ? this.state.adresa : item.adresa}
                                                        onChange = {(e) => {
                                                            this.setState({adresa: e.target.value})
                                                        }}
                                                        disabled = {this.state.disabledRow[i] === undefined ? true : this.state.disabledRow[i]}/>
                                                    </td>
                                                    <td>
                                                        <Button color = "danger"
                                                                onClick = {() => {
                                                                    if (window.confirm('Da li ste sigurni da želite obrisati e-mail?'))
                                                                        this.submitDeleteEmail(item.id)
                                                                }}>Obriši</Button>
                                                    </td>
                                                    {
                                                        this.state.disabledRow[i] || this.state.disabledRow[i] === undefined ?
                                                            <td><Button color = "primary" onClick = {() => {
                                                                this.editEmailClick(i, item)
                                                            }}
                                                                        disabled = {this.state.enabledRowIndex === i ? false :
                                                                            this.state.enabledRowIndex !== null}>Uredi</Button>
                                                            </td>
                                                            :
                                                            <td><Button onClick = {() => {
                                                                this.cancelEmailClick(i)
                                                            }}
                                                                        disabled = {this.state.enabledRowIndex === i ? false :
                                                                            this.state.enabledRowIndex !== null}>Odustani</Button>
                                                            </td>
                                                    }
                                                    {
                                                        this.state.saveEdited[i] ? <td><Button color = "success"
                                                                                               onClick = {this.submitEditEmail.bind(this)}>Sačuvaj</Button>
                                                        </td> : <td></td>
                                                    }
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </Table>
                                    <h4>Dodavanje novih e-mailova</h4>
                                    <Table
                                        responsive = {true}
                                        hover = {true}>
                                        <thead>
                                        <tr>
                                            <td>Fakultetski</td>
                                            <td>Adresa</td>
                                            <td><Button color = "primary"
                                                        onClick = {this.handleAddEmailField}>+</Button></td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.emailFields.map((email, idx) => (
                                            <tr key = {idx + 1}>
                                                <td>
                                                    <Input
                                                        type = {"select"}
                                                        onChange = {this.handleSelectValueChange(idx)}>
                                                        <option
                                                            selected = {this.state.emailFields[idx].fakultetska === false}
                                                            value = {false}>Ne
                                                        </option>
                                                        <option
                                                            selected = {this.state.emailFields[idx].fakultetska === true}
                                                            value = {true}>Da
                                                        </option>
                                                    </Input>
                                                </td>
                                                <td>
                                                    <Input
                                                        type = "text"
                                                        placeholder = {`E-mail adresa ` + idx}
                                                        value = {email.adresa}
                                                        onChange = {this.handleEmailValueChange(idx)}
                                                    />
                                                </td>
                                                <td><Button color = "danger"
                                                            onClick = {this.handleRemoveEmailField(idx)}>-</Button></td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td><Button color = "success"
                                                        disabled = {this.state.emailFields.length === 0}
                                                        onClick = {this.submitEmails.bind(this)}>Dodaj sve
                                                                                                 e-mailove</Button></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <CardHeader>
                                    <h3>Username</h3>
                                </CardHeader>
                                <CardBody>
                                    <p>Username: </p>
                                    <Input
                                        value = {this.state.username ? this.state.username : this.state.prijavljeni.nalog.username}
                                        onChange = {(e) => {
                                            this.setState({username: e.target.value})
                                        }}/>
                                </CardBody>
                                <CardFooter>
                                    <Button color = "success"
                                            disabled = {!this.state.username}
                                            onClick = {this.submitUsername.bind(this)}>Promijeni username</Button>
                                </CardFooter>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <CardHeader>
                                    <h3>Password</h3>
                                </CardHeader>
                                <CardBody>
                                    <p>Stari password: </p>
                                    <Input type = {"password"}
                                           value = {this.state.oldPassword ? this.state.oldPassword : ""}
                                           onChange = {(e) => {
                                               this.setState({oldPassword: e.target.value})
                                           }}/>
                                    <p>Novi password: </p>
                                    <Input type = {"password"}
                                           value = {this.state.newPassword ? this.state.newPassword : ""}
                                           onChange = {(e) => {
                                               this.setState({newPassword: e.target.value})
                                           }}/>
									<p>Potvrdi password: </p>
                                    <Input type = {"password"}
                                           value = {this.state.confirmedPassword ? this.state.confirmedPassword : ""}
                                           onChange = {(e) => {
                                               this.setState({confirmedPassword: e.target.value})
                                           }}/>
                                </CardBody>
                                <CardFooter>
                                    <Button color = "success"
                                            disabled = {!this.state.oldPassword 
														|| !this.state.newPassword
														|| !this.state.confirmedPassword}
                                            onClick = {this.submitPassword.bind(this)}>Promijeni password</Button>
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
            );
        } else {
            return ( <div>Niste prijavljeni</div> );
        }
    }

    render() {

        if (this.state.redirect) return <Redirect to = "/odjava"/>;

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

export default Profil;