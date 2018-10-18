import React, {Component} from 'react';
import {Card, Input, CardBody, CardHeader} from 'reactstrap';
import {API_ROOT} from "../../../api-config";

import OstavljeniKomentari from './OstavljeniKomentari';
import DobijeniKomentari from './DobijeniKomentari';
import PrikazDetaljaSpiraleStudent from '../Spirala/PrikazDetaljaSpiraleStudent';

class Komentari extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spirala_id: null,
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

    getHomeworksFn = () => {

        return this.state.spirale.map(s => {
            return (
                <option value = {s.id} key = {s.id}>{"Spirala " + s.broj_spirale}</option>
            );
        });
    }

    displayAll() {

        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardBody>
                        <Input type = "select" style = {{backgroundColor: "#eee"}}
                               onChange = {(e) => {
                                   this.setState({spirala_id: e.target.value})
                               }}>
                            <option disabled = {true} selected = {true}>Odaberite spiralu</option>
                            {this.getHomeworksFn()}
                        </Input>
                        {this.state.spirala_id ? <PrikazDetaljaSpiraleStudent id = {this.state.spirala_id}/> : null}
                    </CardBody>
                </Card>
                {
                    this.state.spirala_id ?
                        <div>
                            <DobijeniKomentari spirala_id = {this.state.spirala_id}/>
                            <OstavljeniKomentari spirala_id = {this.state.spirala_id}/>
                        </div>
                        : null
                }
            </div>
        );
    }

    render() {
        return (
            <div className = "animated fadeIn">
                <Card>
                    <CardHeader>
                        <h3>Komentari</h3>
                    </CardHeader>
                </Card>
                {this.displayAll()}
            </div>
        );
    }
}

export default Komentari;