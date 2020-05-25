import React, { Component, ReactNode } from "react";
import { connect } from 'react-redux';
import { Project, Plugin } from '@/common/models/Project';
import { autobind } from 'core-decorators';
import { GridRow, Grid, Container, Accordion, Card, Icon, Label, Popup, Header, Button, GridColumn, Tab } from 'semantic-ui-react';
import { SearchBox, Detail, Item } from '@/common/components/SearchBox';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Payload } from '@/store/common/Types';

import { appendPlugin } from '@/store/reducers/index';

import Asura from '@/core/Asura';
import { PageElement } from '@/store/reducers/page';

import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';

interface PluginMarketState {
}

interface PluginMarketProp {
    appendPlugin?: (plugin: Plugin, parent?: PageElement, seq?: string) => void;
    selectElement?: Function;
    page?: Map<string, PageElement>;
    project?: Project;
    selectedElement?: string;
}

@connect((state: Payload) => (
    {
        project: state.project,
        page: state.page,
        selectedElement: state.focusElementSeq
    }),
    {
        appendPlugin
    }
)// props 
@autobind
class PluginMarket extends Component<PluginMarketProp, PluginMarketState> {

    componentDidMount() {
    }

    private renderSearchBar = () => {
        const source: Detail[] = this.resolveSearchItems();
        return <Container><SearchBox source={source} /></Container>
    }

    private appendPlugin = (plugin: Plugin) => {
        const { appendPlugin, page, project } = this.props;
        let parent: PageElement | undefined;
        if (project && page && project.selectedElement) {
            parent = page.get(project.selectedElement);
        }
        if (!parent && plugin.type === 'sprite') {
            message(false, "Must select a 'Scene' before append 'Sprite'!!!");
            return;
        } /** else if (parent && plugin.type === 'scene') {
            message(false, "'Scene' plugin can not be added to any plugin!!!");
            return;
        } **/ else if (parent && parent.plugin.type === 'sprite') {
            message(false, "Forbidden to add plugin to any 'Sprite'!!!");
            return;
        }
        if (appendPlugin) {
            const seq: string = `${new Date().getTime()}`;
            parent = plugin.type === 'scene' ? undefined : parent;
            appendPlugin(plugin, parent, seq);
            message(true);
        }
    }

    private renderPlugins = () => {
        const pluginPanels: any[] = [];

        let count = 0;
        this.fetchPlugins().forEach((plugins, tag) => {
            pluginPanels.push(
                { key: 'panel-' + count++, title: tag, content: { content: <PluginView plugins={plugins} clickAdd={this.appendPlugin} /> } }
            );
        })

        return <Container>
            <Accordion defaultActiveIndex={0} panels={pluginPanels} styled />
        </Container>
    }

    public render(): ReactNode {
        const panes = [
            {
                menuItem: 'Tab 1',
                render: () => {this.renderPlugins()},
            }
        ];
        return (
            <Grid style={{ marginLeft: '3px', marginTop: '5px', marginRight: '3px' }} divided>
                <GridRow>{this.renderSearchBar()}</GridRow>
                <GridRow>
                    {this.renderPlugins()}
                </GridRow>
            </Grid>
        );
    }

    private fetchPlugins = (): Map<string, Plugin[]> => {
        const result: Map<string, Plugin[]> = new Map();
        Asura.instance().pluginPacks.forEach((plugin, pluginId) => {
            const key: string = plugin.describe.tag;
            let plugins: Plugin[] | undefined = result.get(key);
            plugins = plugins ? plugins : [];
            plugins.push(plugin);
            result.set(key, plugins);
        })
        return result;
    }

    // ================================
    // =            Mocked
    // ================================

    private resolveSearchItems = (): Detail[] => {
        const details: Detail[] = [];
        this.fetchPlugins().forEach((plugins, name) => {
            const items: Item[] = [];
            details.push({ category: name, items: items });
            plugins.forEach(plugin => {
                let desc = plugin.describe;
                items.push({
                    title: desc.alias ? desc.alias : desc.name,
                    description: desc.description ? desc.description : "",
                    image: desc.thumbnail
                });
            });
        });
        return details;
    }
}

export default PluginMarket;

// ============================================
// =           plugin card
// ============================================

interface PluginViewProp {
    plugins?: Plugin[];
    clickAdd: (plugin: Plugin) => void;
}

class PluginView extends Component<PluginViewProp, any> {

    private renderPluginCards = (): any[] => {
        const cards: any[] = [];
        if (this.props.plugins) {
            this.props.plugins.forEach((plugin, index) => {
                const name = plugin.describe.alias ? plugin.describe.alias : plugin.describe.name;
                cards.push(
                    selectPluginPopup(
                        index,
                        <Card key={index} raised description={name} image={plugin.describe.thumbnail} />,
                        plugin, this.props.clickAdd
                    )
                );
            });
        }
        return cards;
    }

    public render() {
        const dot = this.props.plugins && this.props.plugins.length < 6;
        let settings = {
            dots: dot,
            lazyLoad: true,
            speed: 500,
            centerMode: true,
            focusOnSelect: true,
            infinite: true,
            nextArrow: <ArrowRight />,
            prevArrow: <ArrowLeft />
        };
        let sides = <Slider {...settings}>
            {this.renderPluginCards()}
        </Slider>
        return <div>
            <SemanticToastContainer />
            {sides}
        </div>;
    }
}

const ArrowLeft = (props) => {
    const { style, onClick } = props;
    return <Label color='black' style={{ ...style, textAlign: 'center' }} onClick={onClick}>
        <Icon name='caret square left' /> Prev
    </Label>
}

const ArrowRight = (props) => {
    const { style, onClick } = props;
    return <Label color='black' style={{ ...style, textAlign: 'center' }} onClick={onClick}>
        <Icon name='caret square right' /> Next
    </Label>
}

const selectPluginPopup = (index: number, pluginElement, plugin: Plugin, clickAddHandler: (plugin: Plugin) => void): any => {
    return <Popup key={index} trigger={pluginElement} hoverable={true}>
        <Grid columns={2}>
            <GridRow style={{ marginLeft: '2px' }}>
                <GridColumn width={10}>
                    <Header as='h2' content={plugin.describe.name} subheader={plugin.describe.alias} />
                </GridColumn>
                <GridColumn width={6}>
                    <Label size='mini' basic color={plugin.type === 'scene' ? 'red' : 'blue' }>{plugin.type}</Label>
                </GridColumn>
            </GridRow>
            <GridRow style={{ marginLeft: '2px' }}>
                <GridColumn width={16}><p>{plugin.describe.description}</p></GridColumn>
            </GridRow>
            <GridRow>
                <GridColumn>
                    <Button size='mini' primary onClick={() => { clickAddHandler(plugin) }}>
                        <Icon name='add'></Icon>
                        add it
                    </Button>
                </GridColumn>
                <GridColumn>
                    <Button secondary size='mini' primary onClick={() => { clickAddHandler(plugin) }}>
                        <Icon name='copy'></Icon>
                        copy it
                        </Button>
                </GridColumn>
            </GridRow>
        </Grid>
    </Popup>
}

// =============================================
// =         popup message
// =============================================

const message = (sucess: boolean, message?: string): void => {
    let chooseIcon: any = 'bullhorn';
    let title: string = "Failed";
    let type: any = "warning";
    if (sucess) {
        message = message ? message : "Append plugin success!!";
        chooseIcon = 'star';
        title = 'Success';
        type = "success";
    }
    toast({
        type: type,
        icon: chooseIcon,
        title: title,
        description: message,
        animation: 'bounce',
        time: 3000
    }, ()=>{});
}