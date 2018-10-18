import React, {Component} from 'react';
import {Card, CardBody, CardFooter, Col, Row, Input, Button, CardHeader} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

class JedanOstavljeniKomentar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: null,
            ocjena: null,
            textN: null,
            ocjenaN: null,
            editMode: false,
            komentar: null
        };
    }

    componentDidMount() {
        this.getComment();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.spirala_id !== this.props.spirala_id) {
            this.getComment();
            this.render();
        }
    }

    getComment() {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/komentari?spirala=' + this.props.spirala_id + '&sifra=' + this.props.sifra_studenta, options)
            .then(result => result.json())
            .then(data => {
                if(data.error) this.setState({text: null,
                                              ocjena: null,
                                              textN: null,
                                              ocjenaN: null,
                                              editMode: false,
                                              komentar: null
                });
                if (data.komentar) this.setState({komentar: data.komentar});
            })
            .catch(err => {
                console.log(err);
            });
    }

    submitComment = (e) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        let variables = {
            spirala_id: this.props.spirala_id,
            sifra_studenta: this.props.sifra_studenta,
            text: this.state.textN,
            ocjena: this.state.ocjenaN
        };

        const options = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/komentari', options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    this.props.refetch(true);
                }
                else alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    }

    submitEditComment(id) {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        let variables = {id: id};

        if (this.state.ocjena) variables.ocjena = this.state.ocjena;
        if (this.state.text) variables.text = this.state.text;

        const options = {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/komentari/' + id, options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    this.props.refetch(true);
                }
                else alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    }

    submitDeleteComment(id) {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'DELETE',
            headers: myHeaders
        };

        fetch(API_ROOT + '/komentari/' + id, options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    this.props.refetch(true);
                }
                else alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    }

    displayComments() {

        if (this.state.komentar) {
            return (
                <Card>
                    <CardHeader>
                        <h4>{this.props.sifra_studenta}</h4>
                    </CardHeader>
                    <CardBody>
                        <Input
                            onChange = {(e) => {
                                this.setState({text: e.target.value})
                            }}
                            disabled = {!this.state.editMode}
                            value = {this.state.text ? this.state.text : this.state.komentar.text}
                            style = {{height: "15em", maxHeight: "40em", marginBottom: "20px"}}
                            type = "textarea"/>
                        <Input
                            onChange = {(e) => {
                                this.setState({ocjena: e.target.value})
                            }}
                            disabled = {!this.state.editMode}
                            value = {this.state.ocjena ? this.state.ocjena : this.state.komentar.ocjena}
                            type = "number"/>
                    </CardBody>
                    <CardFooter>
                        <Button color = {"danger"}
                                onClick = {() => {
                                    if (window.confirm('Da li ste sigurni da želite obrisati komentar?'))
                                        this.submitDeleteComment(this.state.komentar.id);
                                }}>Obriši</Button>
                        {
                            this.state.editMode ?
                                <Button color = {"secondary"}
                                        onClick = {() => {
                                            this.setState({editMode: !this.state.editMode})
                                        }}>Odustani</Button>
                                :
                                <Button color = {"warning"}
                                        onClick = {() => {
                                            this.setState({editMode: !this.state.editMode})
                                        }}>Uredi</Button>
                        }
                        {
                            <Button color = {"success"}
                                    disabled = {!this.state.text && !this.state.ocjena}
                                    onClick = {() => {
                                        this.submitEditComment(this.state.komentar.id)
                                    }}>Sačuvaj promjene</Button>
                        }
                    </CardFooter>
                </Card>
            );
        }
        else {
            return (
                <Card>
                    <CardHeader>
                        <h4>{this.props.sifra_studenta}</h4>
                    </CardHeader>
                    <CardBody>
                        <Input
                            onChange = {(e) => {
                                this.setState({textN: e.target.value})
                            }}
                            value={this.state.textN ? this.state.textN : ""}
                            placeholder = {"Ostavite komentar..."}
                            style = {{height: "15em", maxHeight: "40em", marginBottom: "20px"}}
                            type = "textarea"/>
                        <Input
                            onChange = {(e) => {
                                this.setState({ocjenaN: e.target.value})
                            }}
                            value={this.state.ocjenaN ? this.state.ocjenaN : ""}
                            placeholder = {"Ostavite ocjenu..."}
                            type = "number"
                            min = {1}
                            max = {5}/>
                    </CardBody>
                    <CardFooter>
                        <Button color = {"success"}
                                disabled = {!this.state.textN || !this.state.ocjenaN}
                                onClick = {this.submitComment.bind(this)}>Kreiraj komentar</Button>
                    </CardFooter>
                </Card>
            );
        }
    }

    render() {
        return (
            <div className = "animated fadeIn">
                {this.displayComments()}
            </div>
        );
    }
}

export default JedanOstavljeniKomentar;
