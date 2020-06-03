import React, { Component, ReactNode, CSSProperties, Fragment, createRef } from "react";
import { PluginPack } from '@/common/models/Project';
import RndComponent from '../asura-component/RndComponent';
import { PageElement } from '@/store/reducers/page';
import { connect } from 'react-redux';
import { Payload, Event } from '@/store/common/Types';

import { selectElement } from '@/store/reducers/element';
import { removeElement } from '@/store/reducers/index';

import keydown from 'react-keydown';

import { Popup } from 'semantic-ui-react';
import { SketchPicker } from 'react-color';
import { autobind } from 'core-decorators';

interface Props {
    style: object;
    alias: any;
    elements: PageElement[];
    selectElement?: Function;
    removeElement?: (selectedElementSeq: string) => any;
    focusElementSeq?: string;
    event?: Event
}

interface States {
    showColor: boolean,
    showPosition: boolean,
    color?: any,
    position?: any,
    rect?: any;
}
/**
 * This container will draw align line dynamic when components was dragging and resizing.
 * 
 * @author Xun
 */
@connect(
    (state: Payload) => ({
        focusElementSeq: state.project?.selectedElement,
        events: state.events
    }),
    {
        selectElement,
        removeElement
    }
) @autobind
class AlignContainer extends Component<Props, States> {

    _component;

    constructor(props) {
        super(props);
        this.state = {
            showColor: false,
            showPosition: false,
            color: '',
            position: {'x': 0, 'y': 0},
            rect: {}
        }
    }

    componentDidUpdate() {
    }

    private selectElement(element: PageElement, e) {
        const selected = this.props.focusElementSeq === element.seq ? "" : element.seq;
        if (this.props.selectElement) {
            this.props.selectElement(selected);
            if (!selected) {
                this.setState({ showColor: false });
            }
        }
        if (element.plugin.type !== 'scene') {
            e.stopPropagation();
        }
        const nativeEvent = e.nativeEvent;
        const path = nativeEvent.path || (nativeEvent.composedPath && nativeEvent.composedPath());
        if (path.some(node => node.nodeName === 'A' && node.href)) {
            e.preventDefault();
        }
    }

    @keydown('backspace')
    removeElement(event) {
        const focusElementSeq = this.props.focusElementSeq;
        if (focusElementSeq && this.props.removeElement) {
            this.props.removeElement(focusElementSeq);
        }
    }

    @keydown('c')
    showColor(event) {
        const origin = this.state && this.state.showColor;
        if (this.props.focusElementSeq !== '') this.setState({ showColor: !origin });
    }

    private renderChildrenPlugin = (choosedPlugins: PageElement[], isRoot: boolean) => {
        const elements: any[] = [];
        choosedPlugins.forEach((pageElement: PageElement, key) => {

            if (isRoot && pageElement.parent) return;

            const choosedPlugin: PluginPack = pageElement.plugin;
            let element;

            const isSelected: boolean = pageElement.seq === this.props.focusElementSeq;
            if (choosedPlugin.type === 'sprite') {
                // render 'sprite' as 'rnd' element.
                element = <RndComponent
                    choosed={isSelected}
                    key={key}
                    component={choosedPlugin.component}
                    describe={choosedPlugin.describe}
                    // todo load from dashboard config
                    styles={pageElement.styles}
                    strategy={pageElement.strategy}
                    onChangeStart={(x, y, ax, ay) => { this.setState({ showPosition: true }); }}
                    onMove={(x, y, ax, ay) => {
                        this.setState({ position: { x, y } });
                    }}
                    onResizing={(width, height) => { 
                        this.setState({ rect: { width, height } });
                    }}
                    onChangeEnd={(x, y, ax, ay) => { this.setState({ showPosition: false }); }}
                />;

                element = <div key={key} onClickCapture={this.selectElement.bind(this, pageElement)}>
                    {element}
                </div>
            } else if (choosedPlugin.type === 'scene') {
                const Container: any = choosedPlugin.component;

                let child: any = undefined;
                if (pageElement.children) {
                    child = this.renderChildrenPlugin(pageElement.children, false);
                }
                element =
                    <div key={key} style={isSelected ? selected : {}} onClickCapture={this.selectElement.bind(this, pageElement)}>
                        <Container key={key} style={{ zIndex: 0 }} styles={pageElement.styles} strategy={pageElement.strategy}>
                            <React.Fragment>
                                {child}
                            </React.Fragment>
                        </Container>
                    </div>
            }
            elements.push(element);
        });
        return elements;
    }

    /**
     * align line between elements and container.
     * @param
     * @returns 
     * 
     * @author Xun
     */
    private renderAlignLines = () => {

    }

    public render(): React.ReactNode {
        const { style, alias } = this.props;
        const Container: any = alias;
        const elements = this.renderChildrenPlugin(this.props.elements, true);
        return (
            <Container style={style} ref={(ref) => this._component = ref}>
                {this.renderAlignLines()}
                {this.DetailPopups()}
                {elements}
                {this.ColorWrapper()}
            </Container>
        );
    }

    static defaultProps: Props = {
        style: {},
        alias: 'div',
        elements: []
    }

    private ColorWrapper() {
        const show = this.state && this.state.showColor && this.props.focusElementSeq !== '';
        const color = this.state ? this.state.color : undefined;

        return <Popup
            trigger={<div />}
            flowing
            position='top center'
            hoverable
            positionFixed={false}
            open={show}
            basic
        >
            <SketchPicker
                color={color}
                onChangeComplete={(color) => {
                    this.setState({ color: color })
                }}
            />
        </Popup>
    }

    /**
     * Render the popup of element detail which contains:
     * 1. Element positions: axis X and Y.
     * 2. Width and height of operated element.
     * @param
     * @returns Popup
     * 
     * @author Xun
     */
    private DetailPopups(): React.ReactNode {
        if (!this.state.position) return;
        const { x, y } = this.state.position;
        const { width, height } = this.state.rect;

        const style = {
            borderRadius: 0,
            opacity: 0.7,
            padding: '2em',
        }

        // do not hidden the operating element.
        const position = x > 187 ? 'top left' : 'top right';
        const spans: React.ReactNode[] = [];
        // x, y
        spans.push(<span key={1}>{'x: ' + x.toFixed(3)}<br/></span>);
        spans.push(<span key={2}>{'y: ' + y.toFixed(3)}<br/></span>);
        // width & height
        if (width) spans.push(<span key={3}>{'w: ' + width}<br/></span>);
        if (height) spans.push(<span key={4}>{'h: ' + height}<br/></span>);

        return <Popup
            trigger={<div />}
            flowing
            position={position}
            hoverable
            inverted
            style={style}
            positionFixed={false}
            open={this.state.showPosition}
            basic
        >{spans}</Popup>
    }
}

export default AlignContainer;

const selected: CSSProperties = {
    borderStyle: "dashed solid",
    borderColor: "red"
}