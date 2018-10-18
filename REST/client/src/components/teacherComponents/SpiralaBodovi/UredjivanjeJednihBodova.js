import React, {Component} from 'react';
import {Card, CardBody, CardFooter, Collapse, Input, CardHeader, Button, Row, Col} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

class UredjivanjeJednihBodova extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bodovi: null,
        };
    }

    submitPoints = () => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        let variables = {
            bodovi: this.state.bodovi
        };

        const options = {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/spiralaBodovi/' + this.props.id, options)
            .then(result => result.json())
            .then(data => {
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

        const {spiralaBodovi} = this.props;

        if (spiralaBodovi) {
            return (
                <div className = "animated fadeIn">
                    <Card>
                        <CardBody>
                            <Input
                                onChange = {(e) => {
                                    this.setState({bodovi: e.target.value})
                                }}
                                value = {this.state.bodovi ? this.state.bodovi : spiralaBodovi.bodovi}
                                style = {{marginBottom: "20px"}} type = {"number"}
                                placeholder = {"Osvojeni bodovi"}/>
                        </CardBody>
                        <CardFooter>
                            <Button color = {"success"}
                                    disabled = {!this.state.bodovi}
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