import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardFooter, Collapse, Input, CardHeader, Button, Row, Col} from 'reactstrap';

import {getHomeworks, getStudents} from '../../../queries/queries';
import {createReport} from "../../../mutations/mutations";

class PojedinacnoKreiranje extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spirala_id: null,
            student_id: null
        };
    }

    submitPoints = (e) => {

        this.props.createReport({
            variables: {
                spirala_id: this.state.spirala_id,
                student_id: this.state.student_id
            }
        })
            .then(function () {
                alert("Uspješno kreiran izvještaj");
                window.location.reload();
            })
            .catch(function (error) {
                alert(error.message);
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
                                this.setState({student_id: e.target.value})
                            }}
                            style = {{marginBottom: "20px"}} type = {"select"}>
                            <option selected = {true} disabled = {true}>Odaberite studenta</option>
                            {this.getStudentsFn()}
                        </Input>
                    </CardBody>
                    <CardFooter>
                        <Button color = {"success"}
                                disabled = {!this.state.spirala_id || !this.state.student_id}
                                onClick = {this.submitPoints.bind(this)}>Kreiraj izvještaj</Button>
                    </CardFooter>
                </Card>
            </div>
        );
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

    getStudentsFn = () => {

        let data = this.props.getStudents;

        if (!data.loading) {
            if (data.studenti) {
                return data.studenti.map(s => {
                    return (
                        <option value = {s.id} key = {s.id}>{s.ime + " " + s.prezime + " " + s.index}</option>
                    );
                });
            } else {
                return null;
            }
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

export default compose(
    graphql(createReport,
        {
            name: "createReport"
        }),
    graphql(getHomeworks,
        {
            name: "getHomeworks"
        }
    ),
    graphql(getStudents,
        {
            name: "getStudents"
        }
    )
)(PojedinacnoKreiranje);