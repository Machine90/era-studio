import React, { Component, ReactNode } from "react";

import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { Payload } from '@/store/common/Types';

import EmulatorView from './Emulator';
import { Menu, Icon, Select, Popup, List, Label, Button } from 'semantic-ui-react';
import './index.module.css';
import { renderToString } from 'react-dom/server';
interface Props {
    focusElementSeq?: string;
}

interface States {
}

@connect(
    (state: Payload, props) => ({
        focusElementSeq: state.project?.selectedElement
    })
)
@autobind
class Preview extends Component<Props, States> {

    public zoomIn = () => { }
    public zoomOut = () => { }

    private headerBar = () => {
        const headerItems: any[] = [
            { title: 'Emulate', icon: 'video play', click: () => { console.log("emulate") } },
            { title: 'Publish', icon: 'paper plane', click: () => { } },
        ];

        const devices: any[] = [
            { key: 'iphone', value: '375:667', text: 'iPhone6/7/8' },
            { key: 'ipad', value: '768:1024', text: 'iPad' },
            { key: 'pc', value: '640:360', text: 'PC' }
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
        elements.push(
            <Menu.Item key={headerItems.length}><Select placeholder='Select Device' options={devices} /></Menu.Item>
        );
        return <Menu inverted>
            {elements}
        </Menu>
    }

    public render(): ReactNode {
        return (
            <div>
                <div>{this.headerBar()}</div>
                <div className='emulator-container'>
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