import React, {Component} from 'react';
import {Card, CardBody, CardFooter, Collapse, Input, CardHeader, Button, Row, Col} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

class UredjivanjeJednihBodova extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bodovi: null,
            ocjena: null
        };
    }

    submitPoints = () => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        let variables = {
            bodovi: this.state.bodovi,
            ocjena: this.state.ocjena
        };

        const options = {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/ispitBodovi/' + this.props.id, options)
            .then(result => result.json())
            .then(data => {
                console.log(data);
                if (data.message) {
                    this.props.refetch(true);
                    alert(data.message);
                }
                else alert(data.error);
            })
            .catch(err => {
                console.log(err);
            });
    }

    displayForm() {

        const {ispitBodovi} = this.props;

        if (ispitBodovi) {
            return (
                <div className = "animated fadeIn">
                    <Card>
                        <CardBody>
                            <label>Osvojeni bodovi</label>
                            <Input
                                onChange = {(e) => {
                                    this.setState({bodovi: e.target.value})
                                }}
                                value = {this.state.bodovi ? this.state.bodovi : ispitBodovi.bodovi}
                                style = {{marginBottom: "20px"}} type = {"number"}/>
                            <label>Osvojena ocjena</label>
                            <Input
                                onChange = {(e) => {
                                    this.setState({ocjena: e.target.value})
                                }}
                                value = {this.state.ocjena ? this.state.ocjena :
                                    ispitBodovi.ocjena ? ispitBodovi.ocjena : ""}
                                style = {{marginBottom: "20px"}} type = {"number"}/>
                        </CardBody>
                        <CardFooter>
                            <Button color = {"success"}
                                    disabled = {!this.state.bodovi && !this.state.ocjena}
                                    onClick = {this.submitPoints.bind(this)}>Sačuvaj promjene</Button>
                        </CardFooter>
                    </Card>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                {this.displayForm()}
            </div>
        );
    }
}

export default UredjivanjeJednihBodova;