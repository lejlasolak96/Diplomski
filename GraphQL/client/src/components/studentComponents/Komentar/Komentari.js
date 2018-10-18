import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {Card, CardBody, CardFooter, Col, Row, Input, Button, CardHeader} from 'reactstrap';

import {getHomeworks} from '../../../queries/queries';

import OstavljeniKomentari from './OstavljeniKomentari';
import DobijeniKomentari from './DobijeniKomentari';
import PrikazDetaljaSpirale from '../Spirala/PrikazDetaljaSpiraleStudent';

class Komentari extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spirala_id: null
        };
    }

    getHomeworksFn = () => {

        let data = this.props.data;

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

    displayAll() {

        return (
            <div className = "animated fadeIn">
                <Card>
                    <Input type = "select" style = {{backgroundColor: "#eee"}}
                           onChange = {(e) => {this.setState({spirala_id: e.target.value})}}>
                        <option disabled = {true} selected = {true}>Odaberite spiralu</option>
                        {this.getHomeworksFn()}
                    </Input>
                    <PrikazDetaljaSpirale id = {this.state.spirala_id}/>
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

export default graphql(getHomeworks)(Komentari);