import React, {Component} from 'react';
import {Card, CardBody, CardFooter, Col, Row, Input, Button, CardHeader} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

class DobijeniKomentari extends Component {

    constructor(props) {
        super(props);
        this.state = {
            komentari: [],
            error: null
        };
    }

    componentDidMount() {
        this.getComments();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.spirala_id !== this.props.spirala_id) {
            this.getComments();
        }
    }

    getComments() {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/komentari/spirala/' + this.props.spirala_id, options)
            .then(result => result.json())
            .then(data => {
                if (data.error) this.setState({error: data.error, komentari: []});
                if (data.komentari) this.setState({komentari: data.komentari, error: null});
            })
            .catch(err => {
                console.log(err);
            });
    }

    displayComments() {

        if (this.props.spirala_id) {

            if (this.state.komentari.length !== 0) {

                return this.state.komentari.map((komentar, i) => {

                    return (
                        <Col key = {i + 1}>
                            <Card key = {komentar.id}>
                                <CardBody>
                                    <Input
                                        disabled = {true}
                                        value = {komentar.text}
                                        style = {{height: "15em", maxHeight: "40em"}}
                                        type = "textarea"/>
                                </CardBody>
                                <CardFooter>
                                    <Input
                                        disabled = {true}
                                        value = {komentar.ocjena}
                                        type = "number"/>
                                </CardFooter>
                            </Card>
                        </Col>
                    );
                });
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
        else return null;
    }

    render() {
        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardHeader>
                        <h1>Dobijeni komentari</h1>
                    </CardHeader>
                    <CardBody>
                        {this.displayComments()}
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default DobijeniKomentari;