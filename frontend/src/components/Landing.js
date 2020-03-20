import React, { Component } from 'react'
import { Container, Header } from 'semantic-ui-react';
import BdcMenu from "./Menu";
import {Link} from 'react-router-dom';

export default class Landing extends Component {
    render() {
        return (
            <div>
                <h1>hello world!!</h1>
                <Link to={"/contact"}> click here</Link> to contact us.
            </div>
        );
    }

}