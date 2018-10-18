import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardFooter, Col, Row, Input, Button, CardHeader} from 'reactstrap';

import {getCommentByParameters} from '../../../queries/queries';
import {deleteComment, editComment, createComment} from '../../../mutations/mutations';

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

    componentDidUpdate(prevProps) {
        if (prevProps.spirala_id !== this.props.spirala_id) {

            this.props.getCommentByParameters.refetch()
                .then((value) => {

                    this.setState({komentar: value.data.komentar});
                })
                .catch((value) => {

                    this.setState({komentar: null});
                });

            this.setState({
                text: null,
                ocjena: null,
                textN: null,
                ocjenaN: null,
                editMode: false
            });
        }
    }

    componentDidMount() {
        this.props.getCommentByParameters.refetch()
            .then((value) => {

                this.setState({komentar: value.data.komentar});
            })
            .catch((value) => {

                this.setState({komentar: null});
            });
    }

    submitComment = (e) => {

        this.props.createComment({
            variables: {
                spirala_id: this.props.spirala_id,
                sifra_studenta: this.props.sifra_studenta,
                text: this.state.textN,
                ocjena: this.state.ocjenaN
            }
        })
            .then(function () {
                alert("Uspješno kreiran komentar");
            })
            .catch(function (error) {
                alert(error.message);
            });
    }

    submitEditComment(id) {

        let variables = {id: id};

        if (this.state.ocjena) variables.ocjena = this.state.ocjena;
        if (this.state.text) variables.text = this.state.text;

        this.props.editComment({
            variables: variables
        })
            .then(function () {
                alert("Uspješno uređen komentar");
            })
            .catch(function (error) {
                alert(error.message);
            });
    }

    submitDeleteComment(id) {

        this.props.deleteComment({
            variables: {
                id: id
            }
        })
            .then(function () {
                alert("Uspješno obrisan komentar");
            })
            .catch(function (error) {
                alert(error.message);
            });
    }

    displayComments() {

        const {komentar} = this.state;

        if (komentar) {
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
                            value = {this.state.text ? this.state.text : komentar.text}
                            style = {{height: "15em", maxHeight: "40em", marginBottom: "20px"}}
                            type = "textarea"/>
                        <Input
                            onChange = {(e) => {
                                this.setState({ocjena: e.target.value})
                            }}
                            disabled = {!this.state.editMode}
                            value = {this.state.ocjena ? this.state.ocjena : komentar.ocjena}
                            type = "number"/>
                    </CardBody>
                    <CardFooter>
                        <Button color = {"danger"}
                                onClick = {() => {
                                    if (window.confirm('Da li ste sigurni da želite obrisati komentar?'))
                                        this.submitDeleteComment(komentar.id);
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
                                        this.submitEditComment(komentar.id)
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
                            placeholder = {"Ostavite komentar..."}
                            value = {this.state.textN ? this.state.textN : ""}
                            style = {{height: "15em", maxHeight: "40em", marginBottom: "20px"}}
                            type = "textarea"/>
                        <Input
                            onChange = {(e) => {
                                this.setState({ocjenaN: e.target.value})
                            }}
                            type = "number"
                            placeholder = {"Ostavite ocjenu..."}
                            value = {this.state.ocjenaN ? this.state.ocjenaN : ""}
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

export default compose(
    graphql(getCommentByParameters,
        {
            name: "getCommentByParameters",
            options: (props) => {
                return {
                    variables: {
                        spirala_id: props.spirala_id,
                        sifra_studenta: props.sifra_studenta
                    }
                }
            }
        }),
    graphql(createComment,
        {
            name: "createComment"
        }),
    graphql(editComment,
        {
            name: "editComment"
        }),
    graphql(deleteComment,
        {
            name: "deleteComment"
        })
)(JedanOstavljeniKomentar);