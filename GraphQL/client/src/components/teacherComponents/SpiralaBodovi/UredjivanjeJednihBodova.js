import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardFooter, Collapse, Input, CardHeader, Button, Row, Col} from 'reactstrap';

import {getOneHomeworkPoint, getStudents} from '../../../queries/queries';
import {editHomeworkPoints} from "../../../mutations/mutations";

class UredjivanjeJednihBodova extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bodovi: null
        };
    }

    submitPoints = () => {

        this.props.editHomeworkPoints({
            variables: {
                bodovi: this.state.bodovi,
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

        const {spiralaBodovi} = this.props.getOneHomeworkPoint;

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

export default compose(
    graphql(editHomeworkPoints,
        {
            name: "editHomeworkPoints"
        }),
    graphql(getOneHomeworkPoint,
        {
            name: "getOneHomeworkPoint",
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