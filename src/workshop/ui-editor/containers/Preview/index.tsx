import React, { Component, ReactNode } from "react";

import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { Payload } from '@/store/common/Types';
import { changeScreenDirection } from '@/store/reducers/index';

import EmulatorView from './Emulator';
import { Menu, Icon, Select, Popup, List, Label, Button, Header, Dropdown, Transition, Flag } from 'semantic-ui-react';
import './index.module.css';

interface Props {
    focusElementSeq?: string;
    changeScreenDirection?: (direction: "horizontial" | "vertical") => void;
}

interface States {
    screen: "horizontial" | "vertical"
}

@connect(
    (state: Payload) => ({
        focusElementSeq: state.project?.selectedElement
    }),
    {
        changeScreenDirection
    }
)
@autobind
class Preview extends Component<Props, States> {

    constructor(props) {
        super(props);
        this.state = {
            screen: 'vertical'
        }
    }

    public zoomIn = () => { }
    public zoomOut = () => { }

    /**
     * 
     * 
     */
    private headerBar = () => {
        const { changeScreenDirection } = this.props;

        const headerItems: any[] = [
            { title: 'Emulate', icon: 'video play', click: () => { console.log("emulate") } },
            { title: 'Publish', icon: 'paper plane', click: () => { } },
        ];

        const devices: any[] = [
            { key: 'iphone', value: '375:667', text: 'iPhone6/7/8' },
            { key: 'ipad', value: '768:1024', text: 'iPad' },
            { key: 'pc', value: '640:360', text: 'PC' }
        ];

        const align: any[] = [
            { key: 'vertical', value: 'vertical', text: 'Vertical' },
            { key: 'horizontial', value: 'horizontial', text: 'Horizontial' }
        ];

        const elements: any[] = [
            <Menu.Item key={-1}><img src='/favicon.ico' /></Menu.Item>
        ];

        headerItems.forEach((element, index) => {
            elements.push(
                <Menu.Item name={element.title} onClick={element.click} key={index}>
                    <Icon name={element.icon} />
                    {element.title}
                </Menu.Item>
            );
        });

        let headerCount: number = headerItems.length;
        // dropdown of "device"
        elements.push(
            <Menu.Item key={headerCount++}><Select placeholder='Select Device' options={devices} /></Menu.Item>
        );
        // dropdown of "screen", user can choose screen direction "vertical" or "horizon"
        elements.push(
            <Menu.Item key={headerCount++}>
                <Header as='h6' inverted>
                    <Icon name='repeat' />
                    <Header.Content>
                        Screen {' '}
                        <Dropdown
                            inline
                            header="Screen"
                            options={align}
                            defaultValue={align[0].value}
                            onChange={(evt, { value }) => {
                                const dir: "vertical" | "horizontial" = value === "vertical" ? "vertical" : "horizontial";
                                this.setState({ screen: dir });
                                if (changeScreenDirection) changeScreenDirection(dir);
                            }}
                        />
                    </Header.Content>
                </Header>
            </Menu.Item>
        );

        elements.push(
            <Menu.Item key={headerCount++}>
                <Header>
                    <Flag name='us' />
                </Header>
            </Menu.Item>
        );
        return <Menu inverted>
            {elements}
        </Menu>
    }

    public render(): ReactNode {
        const { screen } = this.state;
        const containerStyle = screen === 'horizontial' ? 'emulator-container-iphone-horizontal' : 'emulator-container-iphone-vertical';
        return (
            <div>
                <div>{this.headerBar()}</div>
                <div className={containerStyle}>
                    <EmulatorView />
                </div>
                <div style={{ marginTop: '5px' }}>
                    {keyboardHelper(<Icon inverted size='big' name='keyboard' />)}
                </div>
            </div>
        );
    }
}

export default Preview;

// define hotkeys here and these will displayed on popups.
const hotKeys: any[] = [
    { icon: "trash alternate", items: [{ name: "Delete" }] },
    { icon: "copy", items: [{ name: "cmd(ctrl)" }, { name: "c" }] },
    { icon: "paste", items: [{ name: "cmd(ctrl)" }, { name: "v" }] },
    { icon: "paint brush", items: [{ name: "c" }] }
]

const keyboardHelper = (triggerElement) => {
    const keyLabel = (items) => {
        const labels: any[] = [];
        items.forEach((item, index) => {
            if (index !== 0) {
                labels.push("+");
            }
            labels.push(<Label key={index} size="mini">{item.name}</Label>);
        })
        return labels;
    }
    const renderHostKeys = (): any[] => {
        const keyElements: any[] = [];
        hotKeys.forEach((key, index) => {
            keyElements.push(
                <List.Item key={index}>
                    <Label size='mini' color='blue'><Icon name={key.icon}></Icon></Label>
                    =
                    {keyLabel(key.items)}
                </List.Item>
            );
        })
        return keyElements;
    }

    return <Popup
        position='top center'
        hoverable={true}
        trigger={triggerElement}
        inverted
    >
        <List>
            {renderHostKeys()}
        </List>
    </Popup>
}