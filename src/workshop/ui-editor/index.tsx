import React, { Component, ReactNode } from "react";
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { Grid, GridColumn, Menu, Icon, GridRow, Container, Header } from 'semantic-ui-react';

import { selectedProject } from '@/store/reducers';

import { Payload } from '@/store/common/Types';
import Preview from './containers/Preview';

import Dashboard from './containers/Dashboard';

import './index.module.css';
import { Project } from '@/common/models/Project';
import { LeftMenu, MenuType } from '@/common/models/Dashboard';
import PluginMarket from './containers/menu/PluginMarket';
import Settings from './containers/menu/settings';
import { PanelKey } from './containers/menu/settings/SettingsMenu';

import AddonManagment from '@/workshop/ui-editor/containers/menu/settings/addons';
import ProxyBoard from '@/workshop/ui-editor/containers/menu/settings/proxy';
import LocalStorageUtil from '@/common/StorageUtil';
import Asura from '@/core/Asura';

interface Props {
    selectedProject?: () => Promise<Project>;
}

interface States extends Payload {
    activeMenu: MenuType;
    initialized: boolean;
    settingPanel: PanelKey;
}

class Screen {
    menu: any;
    content: any;
}

/**
 * The basic layout of editor contain
 * - Plugin box: choose plugins what you want.
 * - Preview: preview the effect of real-time Page.
 * - Dashboard: configure the arguments of component.
 * 
 * @author Xun
 */
@connect((state: Payload) => state, {
    selectedProject: selectedProject
}) @autobind
class Workshop extends Component<Props, States> {

    constructor(props) {
        super(props);
        this.state = {
            initialized: false,
            activeMenu: 'studio',
            settingPanel: 'addon'
        }
    }

    componentDidMount() {
        const { activeMenu } = this.props['match'].params;
        if (activeMenu) {
            this.setState({ activeMenu });
        }

        const registerEmbeddedAddons = async (imports) => {
            // load project
            if (this.props.selectedProject) await this.props.selectedProject();
            // then initiliaze components

            await Asura
                .instance()
                .registerPlugins(imports.default);
            this.setState({ initialized: true });
        }

        // todo initial with default components.
        // registerEmbeddedAddons("");

        import('@/external/index').then(registerEmbeddedAddons);

        // const testStore = async () => {
        //     const storage = new LocalStorageUtil();
        //     await storage.open("test", undefined);
        //     await storage.insert("test", "key", { "name": "Xun" });
        // }
        // testStore();
        
    }

    public render(): React.ReactNode {
        const { menu, content } = this.dispatchMenuRender();
        return this.state.initialized ? (<div><Grid columns={3} divided >
            <GridColumn width={4} className='left-side'>
                <Grid columns={2} divided={true}>
                    <GridRow stretched={true}>
                        <GridColumn width={5}>
                            <Container>{this.renderControllerBar()}</Container>
                        </GridColumn>
                        <GridColumn width={11}>{menu}</GridColumn>
                    </GridRow>
                </Grid>
            </GridColumn>

            <GridColumn width={12}>{content}</GridColumn>
        </Grid></div>) : null;
    }

    // =========================
    // =         menu
    // =========================

    private renderControllerBar = () => {
        const items: any[] = [];
        const menus: LeftMenu[] = [];
        menus.push({ key: 'back', title: 'Back', icon: 'sign-out' });
        menus.push({ key: 'studio', title: 'Studio', icon: 'dropbox' });
        menus.push({ key: 'logic-layer', title: 'Layer', icon: 'object group' });
        menus.push({ key: 'settings', title: 'Settings', icon: 'settings' });

        menus.forEach((menu: LeftMenu, index: number) => {
            items.push(
                <Menu.Item key={index} name={menu.key} active={this.state.activeMenu === menu.key} onClick={this.onChangeMenuSelection}>
                    <Icon name={menu.icon} /> {menu.title}
                </Menu.Item>
            );
        });

        const pluginBar =
            <Menu inverted compact icon='labeled' vertical>
                {items}
            </Menu>;
        return pluginBar;
    }

    private onChangeMenuSelection = (evt, { name }) => {
        this.setState({ activeMenu: name });
        const history = this.props['history'];
        history.push(`/ui-editor/${name}`);
    }

    /**
     * Left side menu of studio include:
     * 1. Studio
     * 2. Layer
     * 3. Settings
     */
    private dispatchMenuRender = (): Screen => {
        let menuContent: ReactNode;
        let bodyContent: ReactNode;
        switch (this.state.activeMenu) {
            case 'studio':
                menuContent = <PluginMarket />;
                bodyContent = <Grid columns={2}>
                    <GridColumn width={10} className='preview-container'><Preview /></GridColumn>
                    <GridColumn width={6} className='dashboard-side'><Dashboard /></GridColumn>
                </Grid>
                break;
            case 'logic-layer':
                // todo
                break;
            case 'settings':
                menuContent = <Settings.MenuBar changePanel={(panel) => {
                    console.log("panel: ", panel);
                    this.setState({ settingPanel: panel });
                }} />
                bodyContent = localeSettingPanel(this.state.settingPanel);
                break;
        }
        return { menu: menuContent, content: bodyContent };
    }
}

const localeSettingPanel = (panel: PanelKey): ReactNode => {
    let panelNode: ReactNode = <div>hello</div>;
    switch (panel) {
        case 'addon':
            panelNode = <AddonManagment />;
            break;
        case 'proxy':
            panelNode = <ProxyBoard />
            break;
        case 'about':
            panelNode = <div>
                <Container></Container>
            </div>
            break;
    }
    return <Grid>
        <GridColumn className='studio'>
            {panelNode}
        </GridColumn>
    </Grid>;
}

export default Workshop;