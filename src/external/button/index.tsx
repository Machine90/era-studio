import * as React from "react";
import { Describe, StrategyEditor, StylesEditor, Font } from '../vendor';
import { Container, Form, FormButton, Input, Label } from 'semantic-ui-react';

interface Style {
    color?: string;
    background?: string;
    text?: string;
    opacity?: string;
}

// =============================================
// =           description of Button plugin
// =============================================

const describe: Describe = {
    app: "official",
    name: "Button",
    alias: "按钮",
    description: "标准按钮",
    category: "ui",
    tag: "Button",
    rect: { width: '120px', height: '50px' },
    styleFragments: ['font'],
    thumbnail: "https://i.pinimg.com/originals/4f/5e/3b/4f5e3b60b584a138c76d04300c80b436.gif"
}

// =============================================
// =           implement of Button plugin
// =============================================

class ButtonPlugin extends React.Component {

    componentDidMount() {
    }

    public render() {
        const styles: Style = this.props['styles'];
        if (!styles) return <div>empty</div>;
        let font: Font | undefined = styles['font'];
        if (styles.background) {
            responsiveStyle["backgroundImage"] = `url(${styles.background})`;
        }
        return <div className='ui button primary'
            style={{ ...responsiveStyle, position: 'absolute', overflowY: "auto", opacity: styles.opacity }}>
            {styles.text}
        </div>
    }
}

const responsiveStyle: object = {
    overflowY: "auto",
    position: "absolute",
    width: "100%",
    height: "100%"
}

// =============================================
// =           additional style editor of Button plugin
// =============================================

class ButtonStyle extends StylesEditor {

    public render() {
        const styles: Style = this.props['styles'];
        let color = styles['color'] || 'A';

        return (
            <Container>
                <Form inverted>
                    <Form.Input
                        inverted label='Show Text'
                        defaultValue={styles.text}
                        onChange={(e, d) => { styles.text = d.value }}
                        placeholder="Button text"
                    />
                    <Label>Background</Label>
                    <br />
                    <Input
                        label='http://'
                        placeholder='xxx.com/background.png'
                        onChange={(e, d) => { styles.background = d.value }}
                        defaultValue={styles.background}
                    />
                    <Form.Input inverted
                        label='Color Pick'
                        action={{
                            color: 'blue',
                            labelPosition: 'left',
                            icon: 'paint brush',
                            content: 'Color',
                        }} onChange={(e, d) => {
                            color = d.value
                        }} placeholder='red' />

                    <Input
                        placeholder='.5'
                        onChange={(e, d) => { styles.opacity = d.value }}
                        defaultValue={styles.opacity}
                    />

                    <Form.Button onClick={() => { this.props.updateStyles({ ...styles }) }}>Submit</Form.Button>
                </Form>
            </Container>
        )
    }
}

// =============================================
// =           additional style editor of Button plugin
// =============================================

class ButtonStrategy extends StrategyEditor {

    public render(): React.ReactNode {
        return <div>
            <Form>
                <FormButton>click</FormButton>
            </Form>
        </div>
    }
}

export default {
    describe, ButtonPlugin, ButtonStyle, ButtonStrategy
}
