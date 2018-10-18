import React, {Component} from 'react';
import {Card, CardBody, CardHeader, CardFooter, Row, Col, Button, Input, Table} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

class Repozitoriji extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nazivN: null,
            urlN: null,
            sshN: null,
            disabledRow: [],
            enabledRowIndex: null,
            disabled: true,
            naziv: null,
            url: null,
            ssh: null,
            id: null,
            saveEdited: [],
            repozitoriji: [],
            error: null
        };
    }

    componentDidMount() {
        this.getRepos();
    }

    getRepos() {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/studenti/repozitoriji', options)
            .then(result => result.json())
            .then(data => {
                if (data.repozitoriji) this.setState({repozitoriji: data.repozitoriji});
                if (data.error) this.setState({error: data.error});
            })
            .catch(err => {
                console.log(err);
            });
    }

    editRepoClick(i, r) {

        this.setState({disabled: !this.state.disabled});

        if (this.state.enabledRowIndex === i && !this.state.disabledRow[i])
            this.setState({enabledRowIndex: null});
        else
            this.setState({enabledRowIndex: i});

        if (this.state.disabledRow[i] === undefined) this.state.disabledRow[i] = false;
        else this.state.disabledRow[i] = !this.state.disabledRow[i];

        this.state.saveEdited[i] = !this.state.disabledRow[i];

        this.setState({url: r.url, ssh: r.ssh, id: r.id, naziv: r.naziv});
    }

    cancelRepoClick(i) {

        this.setState({disabled: !this.state.disabled});

        if (this.state.enabledRowIndex === i && !this.state.disabledRow[i])
            this.setState({enabledRowIndex: null});
        else
            this.setState({enabledRowIndex: i});

        if (this.state.disabledRow[i] === undefined) this.state.disabledRow[i] = false;
        else this.state.disabledRow[i] = !this.state.disabledRow[i];

        this.state.saveEdited[i] = !this.state.disabledRow[i];

        this.setState({url: null, ssh: null, id: null, naziv: null});
    }

    submitRepo = (e) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        let variables = {
            url: this.state.urlN,
            ssh: this.state.sshN,
            naziv: this.state.nazivN
        };

        const options = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/repozitoriji', options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    this.setState({urlN: null, sshN: null, nazivN: null});
                    alert(data.message);
                    this.getRepos();
                }
                if (data.error) alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    }

    submitDeleteRepo = (id) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'DELETE',
            headers: myHeaders
        };

        fetch(API_ROOT + '/repozitoriji/' + id, options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    this.getRepos();
                }
                console.log(data);
                if (data.error) alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    }

    submitEditRepo = async (e) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        let variables = {
            url: this.state.url,
            ssh: this.state.ssh,
            naziv: this.state.naziv
        };

        const options = {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/repozitoriji/' + this.state.id, options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    this.setState({enabledRowIndex: null, disabledRow: [], disabled: true, saveEdited: []});
                    alert(data.message);
                    this.getRepos();
                }
                if (data.error) alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    }

    displayUserDetails() {

        if (this.state.repozitoriji) {

            return (<div>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader>
                                    <h4>Moji repozitoriji</h4>
                                </CardHeader>
                                <CardBody>
                                    <Table
                                        responsive = {true}
                                        striped = {true}
                                        hover = {true}>
                                        <thead>
                                        <tr>
                                            <td>URL</td>
                                            <td>SSH</td>
                                            <td>Naziv</td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.repozitoriji.map((repo, i) => {
                                            return (
                                                <tr key = {repo.id}>
                                                    <td><Input
                                                        value = {this.state.url && this.state.disabledRow[i] === false ? this.state.url : repo.url}
                                                        onChange = {(e) => {
                                                            this.setState({url: e.target.value})
                                                        }}
                                                        disabled = {this.state.disabledRow[i] === undefined ? true : this.state.disabledRow[i]}/>
                                                    </td>
                                                    <td><Input
                                                        value = {this.state.ssh && this.state.disabledRow[i] === false ? this.state.ssh : repo.ssh}
                                                        onChange = {(e) => {
                                                            this.setState({ssh: e.target.value})
                                                        }}
                                                        disabled = {this.state.disabledRow[i] === undefined ? true : this.state.disabledRow[i]}/>
                                                    </td>
                                                    <td><Input
                                                        value = {this.state.naziv && this.state.disabledRow[i] === false ? this.state.naziv : repo.naziv}
                                                        onChange = {(e) => {
                                                            this.setState({naziv: e.target.value})
                                                        }}
                                                        disabled = {this.state.disabledRow[i] === undefined ? true : this.state.disabledRow[i]}/>
                                                    </td>
                                                    <td>
                                                        <Button color = "danger"
                                                                onClick = {() => {
                                                                    if (window.confirm('Da li ste sigurni da želite obrisati repozitorij?'))
                                                                        this.submitDeleteRepo(repo.id)
                                                                }}>Obriši</Button>
                                                    </td>
                                                    {
                                                        this.state.disabledRow[i] || this.state.disabledRow[i] === undefined ?
                                                            <td><Button color = "primary" onClick = {() => {
                                                                this.editRepoClick(i, repo)
                                                            }}
                                                                        disabled = {this.state.enabledRowIndex === i ? false :
                                                                            this.state.enabledRowIndex !== null}>Uredi</Button>
                                                            </td>
                                                            :
                                                            <td><Button onClick = {() => {
                                                                this.cancelRepoClick(i)
                                                            }}
                                                                        disabled = {this.state.enabledRowIndex === i ? false :
                                                                            this.state.enabledRowIndex !== null}>Odustani</Button>
                                                            </td>
                                                    }
                                                    {
                                                        this.state.saveEdited[i] ? <td><Button color = "success"
                                                                                               onClick = {this.submitEditRepo.bind(this)}>Sačuvaj</Button>
                                                        </td> : <td></td>
                                                    }
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <CardHeader>
                                    <h4>Kreiranje repozitorija</h4>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Input
                                            style = {{marginBottom: "20px"}}
                                            value = {this.state.urlN ? this.state.urlN : ""}
                                            placeholder = {"URL repozitorija"}
                                            onChange = {(e) => {
                                                this.setState({urlN: e.target.value})
                                            }}/>
                                    </Row>
                                    <Row>
                                        <Input
                                            style = {{marginBottom: "20px"}}
                                            value = {this.state.sshN ? this.state.sshN : ""}
                                            placeholder = {"SSH repozitorija"}
                                            onChange = {(e) => {
                                                this.setState({sshN: e.target.value})
                                            }}/>
                                    </Row>
                                    <Row>
                                        <Input
                                            value = {this.state.nazivN ? this.state.nazivN : ""}
                                            placeholder = {"Naziv repozitorija"}
                                            onChange = {(e) => {
                                                this.setState({nazivN: e.target.value})
                                            }}/>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <Button color = "success"
                                            disabled = {!this.state.urlN || !this.state.sshN || !this.state.nazivN}
                                            onClick = {this.submitRepo.bind(this)}>Kreiraj repozitorij</Button>
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
                </div>
            );
        }
        else {
            return (
                <Card>
                    <CardHeader>
                        <Row>{this.state.error}</Row>
                    </CardHeader>
                </Card>
            );
        }
    }

    render() {
        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardHeader>
                        <h3>Repozitoriji</h3>
                    </CardHeader>
                </Card>
                <Card>
                    <CardBody>
                        {this.displayUserDetails()}
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default Repozitoriji;