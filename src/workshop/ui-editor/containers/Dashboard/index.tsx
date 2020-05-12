import { Component } from "react";
import Asura from '@/core/Asura';
import { Button, Input, Segment, Tab, Menu } from 'semantic-ui-react';

import * as React from 'react';
import { autobind } from 'core-decorators';

import { connect } from 'react-redux';
import { Payload } from '@/store/common/Types';
import { PageElement } from '@/store/reducers/page';

import { refreshEvent } from '@/store/reducers/index';
import { StyleFragments } from '@/core/vendor/protocol';

interface States {
    activeMenu: string | undefined;
}

interface Props {
    selectedElement?: string,
    pageElements?: Map<string, PageElement>,
    refreshEvent?: Function,
}

@connect(
    (state: Payload) => ({
        selectedElement: state.project?.selectedElement,
        pageElements: state.page,
    }),
    {
        refreshEvent
    }
)
@autobind
class Dashboard extends Component<Props, States> {

    constructor(props) {
        super(props);
        this.state = { activeMenu: 'Unkown' }
    }

    private currentElement = (): PageElement | undefined => {
        const { selectedElement, pageElements } = this.props;
        if (selectedElement && pageElements) {
            const currentElement: PageElement | undefined = pageElements.get(selectedElement);
            return currentElement;
        }
        return undefined;
    }

    private updateElementStyle = (styles: object): void => {
        const elem = this.currentElement();
        if (!elem) return;
        const originStyle = elem.styles;
        elem.styles = { ...originStyle, ...styles };
        this.forceUpdate();

        // if (this.props.refreshEvent) {
        //     this.props.refreshEvent();
        // }
    }

    private updateElementStrategy = (strategy: object): void => {
        const elem = this.currentElement();
        if (!elem) return;
        const originStrategy = elem.strategy;
        elem.styles = { ...originStrategy, ...strategy };
    }

    private switchPanes = (activeMenu: string | undefined): React.ReactNode => {
        let styleEditor, strategyEditor;
        const currentElement = this.currentElement();
        if (!currentElement) {
            return <div>{activeMenu}</div>;
        }

        const styleFragments: StyleFragments[] = currentElement.plugin.describe.styleFragments || [];
        console.log("fragments: ", styleFragments);

        styleEditor = currentElement.plugin.styleEditor;
        strategyEditor = currentElement.plugin.strategyEditor;

        let elem = <div>{activeMenu}</div>
        switch (activeMenu) {
            case 'Basic': break;
            case 'Style':
                if (styleEditor) {
                    let Editor = styleEditor;
                    elem = <Editor updateStyles={this.updateElementStyle} styles={currentElement.styles} />
                }
                break;
            case 'Strategy':
                if (strategyEditor) {
                    let Editor = strategyEditor;
                    elem = <Editor updateStrategy={this.updateElementStrategy} strategy={currentElement.strategy} />
                }
                break;
        }

        return <React.Fragment>{elem}</React.Fragment>;
    }

    private panes = () => {
        const { selectedElement, pageElements } = this.props;
        let { activeMenu } = this.state;

        let element: PageElement | undefined;
        let panes: any[] = [];

        const basic: any[] = [
            { id: 'basic', icon: 'map signs', name: 'Basic' },
            { id: 'event', icon: 'bullhorn', name: 'Event' },
        ];
        const styles: any[] = [
            { id: 'style', icon: 'sliders horizontal', name: 'Style' },
        ];
        const strategy: any[] = [
            { id: 'strategy', icon: 'chess', name: 'Strategy' },
        ];

        panes = basic;
        let initialActiveMenu: string = 'Basic';
        concat_panes: if (selectedElement && pageElements) {
            element = pageElements.get(selectedElement);
            if (!element || !element.plugin) break concat_panes;

            if (element.plugin.strategyEditor) {
                panes = strategy.concat(panes);
                initialActiveMenu = 'Strategy';
            }
            if (element.plugin.styleEditor) {
                panes = styles.concat(panes);
                initialActiveMenu = 'Style';
            }
        }
        if (activeMenu === 'Unkown') {
            activeMenu = initialActiveMenu;
        }
        return { panes, activeMenu };
    }

    private renderPanes = () => {
        const menuElems: any[] = [];
        const { panes, activeMenu } = this.panes();

        panes.forEach((pane, index) => {
            menuElems.push(
                <Menu.Item
                    key={index}
                    icon={pane.icon}
                    active={activeMenu === pane.name}
                    name={pane.name}
                    onClick={(e, { name }) => { this.setState({ activeMenu: name }) }}
                />
            );
        });

        return <div style={{ width: '95%' }}>
            <Menu pointing secondary inverted >
                {menuElems}
            </Menu>
            <Segment inverted>
                {this.switchPanes(activeMenu)}
            </Segment>
        </div>
    }

    public render() {
        return (
            <div style={{ color: "#bcc9d4" }}>
                {this.renderPanes()}
            </div>
        );
    }
}

export default Dashboard;