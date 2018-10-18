import React, {Component} from 'react';
import {Card, CardBody, CardFooter, Col, Row, Input, Button, CardHeader} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

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
            odabraneOcjene: [],
            spirale: []
        };
    }

    componentDidMount() {
        this.getHomeworks();
    }

    getHomeworks() {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/spirale', options)
            .then(result => result.json())
            .then(data => {
                if (data.spirale) this.setState({spirale: data.spirale});
            })
            .catch(err => {
                console.log(err);
            });
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

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'DELETE',
            headers: myHeaders
        };

        fetch(API_ROOT + '/reviews/spirala/' + this.state.spirala_id, options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                }
                else alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    };

    submitReview = (e) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        let variables = {
            spirala_id: this.state.spirala_id,
            komentari: this.state.komentari
        };

        const options = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/reviews', options)
            .then(result => result.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                }
                else alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    }

    getHomeworksFn = () => {

        return this.state.spirale.map(s => {
            return (
                <option value = {s.id} key = {s.id}>{"Spirala " + s.broj_spirale}</option>
            );
        });
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

export default KreiranjeReviewa;