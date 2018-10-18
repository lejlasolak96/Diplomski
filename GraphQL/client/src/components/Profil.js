import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, CardFooter, Row, Col, Input, Button, Table} from 'reactstrap';

import {getLoggedInUser} from '../queries/queries';
import {
    createEmails,
    deleteEmail,
    editEmail,
    editUsername,
    editPassword,
    editPersonalData
} from '../mutations/mutations';

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
            emailFields: [],
            saveEdited: [],
            fakultetska: null,
            adresa: null,
            id: null
        };
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

    submitEmails = async (e) => {

        await this.props.createEmails({
            variables: {
                emails: this.state.emailFields
            },
            refetchQueries: [{query: getLoggedInUser}]
        })
            .catch(function (error) {
                alert(error.message);
            });

        this.setState({emailFields: []});
    }

    submitDeleteEmail = async (id) => {

        const message = await this.props.deleteEmail({
            variables: {
                id: id
            },
            refetchQueries: [{query: getLoggedInUser}]
        })
            .catch(function (error) {
                alert(error.message);
            });

        alert(message.data.obrisiEmail.message);
    }

    submitEditEmail = async (e) => {

        await this.props.editEmail({
            variables: {
                id: this.state.id,
                adresa: this.state.adresa,
                fakultetska: this.state.fakultetska
            },
            refetchQueries: [{query: getLoggedInUser}]
        })
            .catch(function (error) {
                alert(error.message);
            });

        this.setState({enabledRowIndex: null, disabledRow: [], disabled: true, saveEdited: []});
    }

    submitPersonalData = async (person) => {

        let variables = {};

        if (this.state.ime) variables.ime = this.state.ime;
        if (this.state.prezime) variables.prezime = this.state.prezime;
        if (this.state.spol) variables.spol = this.state.spol;
        if (this.state.index) variables.index = this.state.index;

        await this.props.editPersonalData({
            variables: variables,
            refetchQueries: [{query: getLoggedInUser}]
        })
            .catch(function (error) {
                alert(error.message);
            });
    }

    submitUsername = async (e) => {

        if (!this.state.username) alert("Niste unijeli novi username");

        else {
            await this.props.editUsername({
                variables: {
                    username: this.state.username
                },
                refetchQueries: [{query: getLoggedInUser}]
            })
                .then(function () {
                    localStorage.removeItem('token');
                    alert("Username je promijenjen, prijavite se ponovo sa novim podacima");
                    window.location.reload();
                })
                .catch(function (error) {
                    alert(error.message);
                });
        }
    }

    submitPassword = async (e) => {

		if (this.state.newPassword !== this.state.confirmedPassword)
        {
            alert("Passwordi se ne podudaraju");
            return;
        }
		
        await this.props.editPassword({
            variables: {
                oldPassword: this.state.oldPassword,
                newPassword: this.state.newPassword
            },
            refetchQueries: [{query: getLoggedInUser}]
        })
            .then(function () {
                localStorage.removeItem('token');
                alert("Password je promijenjen, prijavite se ponovo sa novim podacima");
                window.location.reload();
            })
            .catch(function (error) {
                alert(error.message);
            });
    }

    displayUserDetails() {

        const {prijavljenaOsoba} = this.props.getLoggedInUser;

        if (prijavljenaOsoba) {

            return (
                <div className = "animated fadeIn">
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
                                            <td><Input value = {this.state.ime ? this.state.ime : prijavljenaOsoba.ime}
                                                       onChange = {(e) => {
                                                           this.setState({ime: e.target.value})
                                                       }}/></td>
                                        </tr>
                                        <tr style = {{height: "50px"}}>
                                            <td><label>Prezime: </label></td>
                                            <td><Input
                                                value = {this.state.prezime ? this.state.prezime : prijavljenaOsoba.prezime}
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
                                                           checked = {this.state.spol ? this.state.spol === 'M' : prijavljenaOsoba.spol === "M"}/>
                                                    <label>Muški</label>
                                                </div>
                                                <div>
                                                    <Input type = "radio" name = "spol" value = "Z"
                                                           onChange = {(e) => this.setState({spol: e.target.value})}
                                                           checked = {this.state.spol ? this.state.spol === 'Z' : prijavljenaOsoba.spol === "Z"}/>
                                                    <label>Ženski</label>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr style = {{height: "50px"}}>
                                            <td><label>Verifikovan: </label></td>
                                            <td>{prijavljenaOsoba.nalog.verified ? "Da" : "Ne"}</td>
                                        </tr>
                                        {
                                            prijavljenaOsoba.index ?
                                                <tr style = {{height: "50px"}}>
                                                    <td><label>Index: </label></td>
                                                    <td>
                                                        <Input
                                                            onChange = {(e) => this.setState({index: e.target.value})}
                                                            value = {this.state.index ? this.state.index : prijavljenaOsoba.index}/>
                                                    </td>
                                                </tr>
                                                : null
                                        }
                                        <tr style = {{height: "50px"}}>
                                            <td><label>Privilegije:</label></td>
                                            <td>
                                                <ul>
                                                    {prijavljenaOsoba.privilegije.map(item => {
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
                                                this.submitPersonalData(prijavljenaOsoba)
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
                                        {prijavljenaOsoba.emails.map((item, i) => {
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
                                        value = {this.state.username ? this.state.username : prijavljenaOsoba.nalog.username}
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
                </div>
            );
        } else {
            return ( <div>Niste prijavljeni</div> );
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
    graphql(getLoggedInUser,
        {
            name: "getLoggedInUser"
        }),
    graphql(createEmails,
        {
            name: "createEmails"
        }),
    graphql(deleteEmail,
        {
            name: "deleteEmail"
        }),
    graphql(editEmail,
        {
            name: "editEmail"
        }),
    graphql(editUsername,
        {
            name: "editUsername"
        }),
    graphql(editPassword,
        {
            name: "editPassword"
        }),
    graphql(editPersonalData,
        {
            name: "editPersonalData"
        })
)(Profil);