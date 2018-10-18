import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardFooter, Collapse, Input, CardHeader, Button, Row, Col} from 'reactstrap';

import {getHomeworks, getStudents} from '../../../queries/queries';
import {createHomeworkPoints} from "../../../mutations/mutations";

class UnosJednihBodova extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spirala_id: null,
            bodovi: null
        };
    }

    submitPoints = (e) => {

        this.props.createHomeworkPoints({
            variables: {
                spirala_id: this.state.spirala_id,
                bodovi: this.state.bodovi,
                student_id: this.props.student_id
            },
            refetchQueries: [{query: getStudents}]
        })
            .then(function () {
                alert("Uspješno kreirani bodovi");
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

    render() {
        return (
            <div>
                {this.displayForm()}
            </div>
        );
    }
}

export default compose(
    graphql(createHomeworkPoints,
        {
            name: "createHomeworkPoints"
        }),
    graphql(getHomeworks,
        {
            name: "getHomeworks"
        }
    )
)(UnosJednihBodova);