import React, {Component} from 'react';
import {Card, CardBody, CardFooter, Collapse, Input, CardHeader, Button, Row, Col} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

class PojedinacnoKreiranje extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spirala_id: null,
            student_id: null,
            spirale: [],
            studenti: []
        };
    }

    componentDidMount() {
        this.getHomeworks();
        this.getStudents();
    }

    submitPoints = (e) => {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        let variables = {
            spirala_id: this.state.spirala_id,
            student_id: this.state.student_id
        };

        const options = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(variables)
        };

        fetch(API_ROOT + '/izvjestaji', options)
            .then(result => result.json())
            .then(data => {
                if (data.message) alert(data.message);
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
            })
    }

    getHomeworksFn = () => {

        return this.state.spirale.map(s => {
            return (
                <option value = {s.id} key = {s.id}>{"Spirala " + s.broj_spirale}</option>
            );
        });
    }

    getStudents() {

        let myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

        const options = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(API_ROOT + '/studenti', options)
            .then(result => result.json())
            .then(data => {
                if (data.studenti) this.setState({studenti: data.studenti});
            })
            .catch(err => {
                console.log(err);
            })
    }

    getStudentsFn = () => {

        return this.state.studenti.map(s => {
            return (
                <option value = {s.id} key = {s.id}>{s.ime + " " + s.prezime + " " + s.index}</option>
            );
        });
    }

    render() {
        return (
            <div>
                {this.displayForm()}
            </div>
        );
    }
}

export default PojedinacnoKreiranje;