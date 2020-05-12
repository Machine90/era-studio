import * as React from 'react';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { List, Container } from 'semantic-ui-react';

import './index.module.css';

// props & state
interface Props {
    changePanel?: (panel: PanelKey) => void;
}

interface States {
    activePanel: string;
}

declare type SettingIcon = 'send' | 'plug' | 'help circle' | 'language' | 'configure';
export declare type PanelKey = 'addon' | 'proxy' | 'about' | 'language' | 'configure'; 

// structure
interface Option {
    icon: SettingIcon;
    name: string;
    key: PanelKey;
}

@connect()
@autobind
class SettingsMenu extends React.Component<Props, States> {

    private settings: Option[] = [
        { icon: 'plug', name: 'Addons Setting', key: 'addon' },
        { icon: 'send', name: 'Proxy Setting', key: 'proxy' },
        { icon: 'configure', name: 'System Setting', key: 'configure'},
        { icon: 'help circle', name: 'About', key: 'about' }
    ];

    private clickPanel = (panel: PanelKey)=> {
        const callback = this.props.changePanel;
        if (callback) {
            callback(panel);
        }
    }

    private renderSettings = (): React.ReactNode => {
        const settingNodes: React.ReactNode[] = []
        this.settings.forEach((option, index) => {
            settingNodes.push(
                <List.Item key={index} onClick={()=>{this.clickPanel(option.key)}}>
                    <List.Icon name={option.icon} size='small' verticalAlign='middle' />
                    <List.Content>
                        <List.Header as='a'>{option.name}</List.Header>
                    </List.Content>
                </List.Item>
            )
        });

        return <List inverted selection verticalAlign='middle' animated>
            {settingNodes}
        </List>;
    }

    public render(): React.ReactNode {
        return (<Container className='settings-container'>{this.renderSettings()}</Container>);
    }
}

export default SettingsMenu;