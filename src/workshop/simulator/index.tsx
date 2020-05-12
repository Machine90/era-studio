import React, { Component } from "react";
import DeviceEmulator from 'react-device-emulator';
import 'react-device-emulator/lib/styles/style.css';
import { autobind } from 'core-decorators';
import { Container } from 'semantic-ui-react';
import PreviewComponent from './PreviewComponent';

@autobind
class Simulator extends Component {
    public render() {
        return (<Container>
            <DeviceEmulator
                type="mobile"
                withDeviceSwitch
                withRotator
                url="http://localhost:3000/pre-com"
                >
            </DeviceEmulator>
        </Container>);
    }
}

export default Simulator;