import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardFooter, Col, Row, Input, Button, CardHeader} from 'reactstrap';

import {createReview, deleteReview} from '../../../mutations/mutations';
import {getHomeworks} from '../../../queries/queries';

class KreiranjeReviewa extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spirala_id: null,
            komentari: [
                {
                    sifra_studenta: "A",
                    text: "",
                    ocjena: null
                },
                {
                    sifra_studenta: "B",
                    text: "",
                    ocjena: null
                },
                {
                    sifra_studenta: "C",
                    text: "",
                    ocjena: null
                },
                {
                    sifra_studenta: "D",
                    text: "",
                    ocjena: null
                },
                {
                    sifra_studenta: "E",
                    text: "",
                    ocjena: null
                }
            ],
            odabraneOcjene: []
        };
    }

    handleTextValueChange = (idx) => (evt) => {

        const text = this.state.komentari.map((e, sidx) => {
            if (idx !== sidx) return e;
            return {...e, text: evt.target.value};
        });

        this.setState({komentari: text});
    }

    handleMarkValueChange = (idx) => (evt) => {

        const text = this.state.komentari.map((e, sidx) => {
            if (idx !== sidx) return e;
            return {...e, ocjena: evt.target.value};
        });

        this.setState({komentari: text});
        this.state.odabraneOcjene[idx] = evt.target.value;
    }

    deleteReviewFn() {

        this.props.deleteReview({
            variables: {
                spirala_id: this.state.spirala_id
            }
        })
            .then(function () {
                alert("Uspješno obrisan review");
            })
            .catch(function (error) {
                alert(error.message);
            });
    };

    submitReview = (e) => {

        this.props.createReview({
            variables: {
                spirala_id: this.state.spirala_id,
                komentari: this.state.komentari
            }
        })
            .then(function () {
                alert("Uspješno kreiran review");
                window.location.reload();
            })
            .catch(function (error) {
                alert(error.message);
            });
    }

    getHomeworksFn = () => {

        let data = this.props.getHomeworks;

        if (!data.loading) {
            if (data.spirale) {
                return data.spirale.map(s => {
                    return (
                        <option value = {s.id} key = {s.id}>{"Spirala " + s.broj_spirale}</option>
                    );
                });
            } else {
                return null;
            }
        }
    }

    displayHomework() {

        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardBody>
                        {
                            this.state.komentari.map((komentar, i) => (

                                <Card key = {i + 1}>
                                    <CardHeader>
                                        <h4>Student {komentar.sifra_studenta}</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <Input
                                            onChange = {this.handleTextValueChange(i)}
                                            style = {{height: "15em", maxHeight: "40em"}}
                                            placeholder = {"Ostavite komentar"} type = "textarea"/>
                                    </CardBody>
                                    <CardFooter>
                                        <Input type = {"select"}
                                               onChange = {this.handleMarkValueChange(i)}>
                                            <option selected = {true} disabled = {true}>Ocjena</option>
                                            <option value = {1}
                                                    disabled = {this.state.odabraneOcjene.indexOf("1") !== -1}>1
                                            </option>
                                            <option value = {2}
                                                    disabled = {this.state.odabraneOcjene.indexOf("2") !== -1}>2
                                            </option>
                                            <option value = {3}
                                                    disabled = {this.state.odabraneOcjene.indexOf("3") !== -1}>3
                                            </option>
                                            <option value = {4}
                                                    disabled = {this.state.odabraneOcjene.indexOf("4") !== -1}>4
                                            </option>
                                            <option value = {5}
                                                    disabled = {this.state.odabraneOcjene.indexOf("5") !== -1}>5
                                            </option>
                                        </Input>
                                    </CardFooter>
                                </Card>
                            ))
                        }
                        <Input type = "select" style = {{backgroundColor: "#eee"}} onChange = {(e) => {
                            this.setState({spirala_id: e.target.value})
                        }}>
                            <option disabled = {true} selected = {true}>Odaberite spiralu</option>
                            {this.getHomeworksFn()}
                        </Input>
                    </CardBody>
                    <CardFooter>
                        <Button color = {"success"}
                                disabled = {!this.state.spirala_id}
                                onClick = {this.submitReview.bind(this)}>Kreiraj review</Button>
                        <Button color = {"danger"}
                                disabled = {!this.state.spirala_id}
                                onClick = {() => {
                                    if (window.confirm('Da li ste sigurni da želite obrisati review?')) this.deleteReviewFn();
                                }}>Obriši review</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    render() {
        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardHeader>
                        <h3>Review</h3>
                    </CardHeader>
                </Card>
                {this.displayHomework()}
            </div>
        );
    }
}

export default compose(
    graphql(getHomeworks,
        {
            name: "getHomeworks"
        }),
    graphql(createReview,
        {
            name: "createReview"
        }),
    graphql(deleteReview,
        {
            name: "deleteRevirew"
        })
)(KreiranjeReviewa);