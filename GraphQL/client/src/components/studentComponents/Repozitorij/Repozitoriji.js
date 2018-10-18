import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardHeader, CardFooter, Row, Col, Button, Input, Table} from 'reactstrap';

import {getMyRepos} from '../../../queries/queries';
import {deleteRepo, createRepo, editRepo} from '../../../mutations/mutations';

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
            saveEdited: []
        };
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

    submitRepo = async (e) => {

        await this.props.createRepo({
            variables: {
                url: this.state.urlN,
                ssh: this.state.sshN,
                naziv: this.state.nazivN
            },
            refetchQueries: [{query: getMyRepos}]
        })
            .catch(function (error) {
                alert(error.message);
            });

        this.setState({urlN: null, sshN: null, nazivN: null});
    }

    submitDeleteRepo = (id) => {

        this.props.deleteRepo({
            variables: {
                id: id
            },
            refetchQueries: [{query: getMyRepos}]
        })
            .then(function () {
                alert("Uspješno obrisan repozitorij");
            })
            .catch(function (error) {
                alert(error.message);
            });

    }

    submitEditRepo = async (e) => {

        await this.props.editRepo({
            variables: {
                id: this.state.id,
                url: this.state.url,
                ssh: this.state.ssh,
                naziv: this.state.naziv
            },
            refetchQueries: [{query: getMyRepos}]
        })
            .catch(function (error) {
                alert(error.message);
            });

        this.setState({enabledRowIndex: null, disabledRow: [], disabled: true, saveEdited: []});
    }

    displayUserDetails() {

        let data = this.props.getMyRepos;

        if (data && !data.loading) {
            if (data.mojiRepozitoriji) {

                return (<div className = "animated fadeIn">
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
                                            {data.mojiRepozitoriji.map((repo, i) => {
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
                            <Row>{data.error.message}</Row>
                        </CardHeader>
                    </Card>
                );
            }
        }
    }

    render() {
        return (
            <div id = "osoba-details">
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

export default compose(
    graphql(getMyRepos,
        {
            name: "getMyRepos"
        }),
    graphql(createRepo,
        {
            name: "createRepo"
        }),
    graphql(deleteRepo,
        {
            name: "deleteRepo"
        }),
    graphql(editRepo,
        {
            name: "editRepo"
        })
)(Repozitoriji);