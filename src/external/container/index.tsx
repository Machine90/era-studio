import * as React from "react";

import { StylesEditor, Describe } from '../vendor'
import { Form, FormInput, FormButton } from 'semantic-ui-react';

const describe: Describe = {
    app: "official",
    name: "Container",
    alias: "基础容器",
    category: "ui",
    tag: "Container",
    rect: {
        width: '100%',
        height: '300px',
        draggable: false
    },
    
    thumbnail: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1577013715601&di=7a2f378c1930459f41e0c022f606008e&imgtype=0&src=http%3A%2F%2Fww1.sinaimg.cn%2Flarge%2F006pJUwqly1fz87e4xdkpg31a50lmajo.gif"
}

interface Style {
    background?: string;
    height?: string;
    screenDirection?: "vertical" | "horithontial";
}

// =============================================
// =           implement of Container plugin
// =============================================

class ContainerPlugin extends React.Component {

    componentDidMount() {

    }

    public render() {
        const styles: Style = this.props['styles'];
        if (!styles) return <div>empty</div>;

        if (!styles.height) styles.height = (styles.screenDirection && styles.screenDirection === 'vertical') ? '300px' : '375px';
        const background = styles.background;
        const height = styles.height || '300px';
        const style: any = {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "solid 1px #ddd",
            background: "#f0f0f0",
        };

        if (background) {
            const backgroundImage = `url(${background})`;
            style['backgroundImage'] = backgroundImage;
            style.backgroundSize = 'auto 100%';
            style.backgroundRepeat = 'no-repeat';
        }

        const Child: any = this.props.children;
        return (
            <div style={{ ...style, height }}>
                {Child}
            </div>
        );
    }
}

// =============================================
// =           implement of Container style
// =============================================

class ContainerStyle extends StylesEditor {

    private defaultStyle: Style = {
        background: ""
    };

    constructor(props) {
        super(props);
        this.state = { background: undefined, height: undefined };
    }

    public render(): React.ReactNode {
        const styles: Style = this.props.styles || this.defaultStyle;
        const { updateStyles } = this.props;

        return <Form>
            <FormInput type='text'
                placeholder="background"
                defaultValue={styles.background}
                onChange={(e, d) => { styles.background = d.value; }} />

            <FormInput type='text'
                placeholder="Height"
                defaultValue={styles.height} 
                onChange={(evt, d) => { styles.height = d.value; }} />

            <FormButton primary onClick={() => {
                updateStyles({ ...styles });
            }}>Submit</FormButton>

        </Form>
    }
}

export default {
    describe, ContainerPlugin, ContainerStyle
}