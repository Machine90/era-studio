import React, { PureComponent as Component, RefObject, CSSProperties } from 'react';
import { Rnd, RndDragEvent, DraggableData } from 'react-rnd';
import { AsuraSprite, AsuraScene } from '@/core/vendor/protocol';
import { Describe } from '@/core/vendor/protocol';
import { ResizeDirection } from 're-resizable';


interface States {
    _ref?: any;
    events: object;
    width: string,
    height: string,
    x: number,
    y: number,
    zindex: number, 
}

interface Props {
    component: Element | AsuraSprite | AsuraScene | undefined;
    describe: Describe | undefined;
    strategy?: object;
    styles?: object;
    parent?: any;
    choosed?: boolean;
    onChangeStart?: (relatedX: number, relatedY: number, absoluteX: number, absoluteY: number) => void;
    onMove?: (relatedX: number, relatedY: number, absoluteX: number, absoluteY: number) => void;
    onResizing?: (width: string, height: string) => void;
    onChangeEnd?: (relatedX: number, relatedY: number, absoluteX: number, absoluteY: number) => void;
}

/***
 * Resizable and Draggable component with alignment line.
 * 
 * @author Xun
 */
class RndComponent extends Component<Props, States> {

    private _component: RefObject<Element>;

    constructor(props) {
        super(props);
        this._component = React.createRef<Element>();
        
        this.state = {
            events: {},
            x: 0,
            y: 0,
            width: '100px',
            height: '100px',
            zindex: 10
        };
    }

    componentDidMount() {
        const { styles } = this.props;
        let x, y;
        if(styles) {
            x = styles['x'] || 0;
            y = styles['y'] || 0;
            this.setState({x, y});
        }
        if (this.props.describe) {
            this.setState({width: ''+this.props.describe.rect.width, height: this.props.describe.rect.height + ''});
        }
    }

    private onResizing = (e: MouseEvent | TouchEvent, direction: ResizeDirection, elementRef: HTMLDivElement, delta: {
        height: number;
        width: number;
    }): void => {
        const { onResizing } = this.props;
        let { width, height } = elementRef.style;
        if (onResizing) onResizing(width, height);
    }

    private onDragStart = (e: RndDragEvent, data: DraggableData): void => {
        const { onChangeStart } = this.props;
        if (onChangeStart) onChangeStart(data.lastX, data.lastY, data.x, data.y);
        this.setState({zindex: this.state.zindex + 1});
    }

    private onDrag =(e: RndDragEvent, data: DraggableData): void => {
        const { onMove } = this.props;
        if (onMove) onMove(data.lastX, data.lastY, data.x, data.y);
    }

    private onDragStop = (e: RndDragEvent, data: DraggableData): void => {
        const x = data.x;
        const y = data.y;
        const { styles } = this.props;
        // then update position x, y of dragged element.
        if (styles) {
            styles['x'] = x; styles['y'] = y;
        }
        const { onChangeEnd } = this.props;
        if (onChangeEnd) onChangeEnd(data.lastX, data.lastY, data.x, data.y);
        this.setState({ x, y, zindex: this.state.zindex - 1 });
    }

    private onResizeStart =(e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, dir: ResizeDirection, elementRef: HTMLDivElement) => {
        const { onChangeStart } = this.props;
        if (onChangeStart) onChangeStart(0, 0, 0, 0);
    }

    private onResizeStop = (e, direction, ref, delta, position) => {
        const { onChangeEnd } = this.props;
        if (onChangeEnd) onChangeEnd(0, 0, 0, 0);
        this.setState({
            width: ref.style.width,
            height: ref.style.height,
            ...position
        });
    }

    public render() {
        const { component, strategy, styles, children, parent } = this.props;
        const Component: any = component;
        
        const activeStyle = this.props.choosed ? selectedStyle : defaultStyle;
        return (
            <Rnd
                style={{...activeStyle, zIndex: this.state.zindex}}
                size={{ width: this.state.width, height: this.state.height }}
                position={{ x: this.state.x, y: this.state.y }}
                onDragStart={this.onDragStart}
                onDragStop={this.onDragStop}
                onDrag={this.onDrag}
                onResize={this.onResizing}
                onResizeStart={this.onResizeStart}
                onResizeStop={this.onResizeStop}
            >
                <Component ref={this._component} parent={parent} styles={styles} strategy={strategy}>
                    {children}
                </Component>
            </Rnd>
        );
    }
}

export default RndComponent;

const defaultStyle: CSSProperties = {
    width: '100px',
    height: '100px',
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
}

const selectedStyle: CSSProperties = {
    width: '100px',
    height: '100px',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 4px 4px #ffa800"
}