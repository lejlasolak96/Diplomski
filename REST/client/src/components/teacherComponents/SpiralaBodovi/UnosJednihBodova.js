import React, {Component} from 'react';
import {Card, CardBody, CardFooter, Collapse, Input, CardHeader, Button, Row, Col} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

class UnosJednihBodova extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spirala_id: null,
            bodovi: null
        };
    }

    getHomeworksFn = () => {

        return this.props.spirale.map(s => {
            return (
                <option value = {s.id} key = {s.id}>{"Spirala " + s.broj_spirale}</option>
            );
        });
    }

    submitPoints = (e) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        let variables = {
            spirala_id: this.state.spirala_id,
            bodovi: this.state.bodovi,
            student_id: this.props.student_id
        };

        const options = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/spiralaBodovi', options)
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
        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardBody>
                        <Input
                            onChange = {(e) => {
                                this.setState({spirala_id: e.target.value})
                            }}
                            style = {{marginBottom: "20px"}} type = {"select"}>
                            <option selected = {true} disabled = {true}>Odaberite spiralu</option>
                            {this.getHomeworksFn()}
                        </Input>
                        <Input
                            onChange = {(e) => {
                                this.setState({bodovi: e.target.value})
                            }}
                            style = {{marginBottom: "20px"}} type = {"number"}
                            placeholder = {"Osvojeni bodovi"}/>
                    </CardBody>
                    <CardFooter>
                        <Button color = {"success"}
                                disabled = {!this.state.spirala_id || !this.state.bodovi}
                                onClick = {this.submitPoints.bind(this)}>Kreiraj bodove</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.displayForm()}
            </div>
        );
    }
}

export default UnosJednihBodova;