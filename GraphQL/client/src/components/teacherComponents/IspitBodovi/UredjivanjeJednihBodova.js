import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardFooter, Collapse, Input, CardHeader, Button, Row, Col} from 'reactstrap';

import {getOneExamPoint, getStudents} from '../../../queries/queries';
import {editExamPoints} from "../../../mutations/mutations";

class UredjivanjeJednihBodova extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bodovi: null,
            ocjena: null
        };
    }

    submitPoints = () => {

        this.props.editExamPoints({
            variables: {
                bodovi: this.state.bodovi,
                ocjena: this.state.ocjena,
                id: this.props.id
            },
            refetchQueries: [{query: getStudents}]
        })
            .then(function () {
                alert("Uspješno uređeni bodovi");
            })
            .catch(function (error) {
                alert(error.message);
            });
    }

    displayForm() {

        const {ispitBodovi} = this.props.getOneExamPoint;

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
                                value = {this.state.ocjena ? this.state.ocjena : ispitBodovi.ocjena}
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

export default compose(
    graphql(editExamPoints,
        {
            name: "editExamPoints"
        }),
    graphql(getOneExamPoint,
        {
            name: "getOneExamPoint",
            options: (props) => {
                return {
                    variables: {
                        id: props.id
                    }
                }
            }
        }
    )
)(UredjivanjeJednihBodova);