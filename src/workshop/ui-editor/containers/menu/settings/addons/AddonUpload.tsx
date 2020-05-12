import { ReactNode } from "react";
import * as React from 'react';
import { Header, Icon, Button, GridRow, GridColumn, Container, Grid, Label, Segment, Item, Step, Dropdown, Input } from 'semantic-ui-react';
import { Editor } from '@/workshop/code-editor/window'
import Asura from '@/core/Asura';
import { PluginPack } from '@/common/models/Project';
import RndComponent from '@/core/asura-component/RndComponent';

declare type input = 'code' | 'url';

interface Props {

}

interface States {
    plugin?: PluginPack;
    code: string;
    input: input
}

export default class AddonUpload extends React.Component<Props, States> {

    constructor(props) {
        super(props);
        this.state = { code: "", input: 'code' };
    }

    private code: string = "";
    private approved: boolean = false;

    componentDidUpdate() {
        this.approved = true;
    }

    private guideline = () => {
        let active = 0;
        active = this.approved ? 2 : 1;
        active = this.code === "" ? 0 : active;

        const steps: any[] = [
            { id: 0, icon: 'paste', title: 'Paste Code', desc: 'Paste component code' },
            { id: 1, icon: 'cogs', title: 'Mount', desc: 'Compile component' },
            { id: 2, icon: 'cloud upload', title: 'Upload', desc: 'Publish to platform' },
        ];

        const stepElems: ReactNode[] = [];
        steps.forEach(step => {
            stepElems.push(
                <Step active={active === step.id} key={step.id}>
                    <Icon name={step.icon} />
                    <Step.Content>
                        <Step.Title>{step.title}</Step.Title>
                        <Step.Description>{step.desc}</Step.Description>
                    </Step.Content>
                </Step>
            );
        })

        return <Step.Group size='mini'>
            {stepElems}
        </Step.Group>
    }

    private renderPluginDesc = () => {
        let thumbnail: string = '/img/placeholder.png';
        let title = 'Unknown';
        let desc = 'Nothing';
        let author = 'Unknown';
        let tag = '';

        if (this.state.plugin) {
            const describe = this.state.plugin.describe;
            if (describe.thumbnail) thumbnail = describe.thumbnail;
            title = describe.alias ? describe.alias : describe.name;
            if (describe.description) desc = describe.description;
            if (describe.author) author = describe.author.name;
            tag = describe.tag;
        }

        const items = [
            {
                childKey: 0,
                image: thumbnail,
                header: title,
                description: desc,
                meta: author,
                extra: tag,
            }
        ];
        return <Item.Group items={items} />
    }

    private compilePlugin = async () => {

        const plugin: PluginPack | undefined = await Asura.instance().loadAddonFromCode(this.code, 'VALIDATE');
        if (plugin) {
            this.setState({ plugin: plugin, code: this.code });
        }
    }

    private uploadPlugin = async () => {
        if (this.approved) {
            Asura.instance().loadAddonFromCode(this.code, 'PACKING');
        } else {
            alert("please compile first")
        }
    }

    private renderInput = () => {
        const options = [
            { key: 'code', text: 'Code', value: 'code' },
            { key: 'url', text: 'URL', value: 'url' },
        ];

        const inputType = <Dropdown
            button
            className='icon'
            floating
            labeled
            icon='edit'
            options={options}
            placeholder='Upload Type'
            style={{ marginLeft: '25px' }}
            onChange={(e, d) => {
                console.log("select data: ", d.value);
                const type: input = d.value === 'code' ? 'code' : 'url';
                this.setState({ input: type });
            }}
        />

        const inputElem = this.state.input === 'code' ?
            <Editor lang='javascript' style='monokai' initialCode={this.state.code} onChange={(code: string) => {
                this.code = code;
                this.approved = false;
            }} /> : <Input
                style={{width: "100%"}}
                action={{
                    color: 'teal',
                    labelPosition: 'right',
                    icon: 'copy',
                    content: 'Copy',
                }}
                defaultValue='https://localhost:8080/main.bundle.js'
            />

        return <Container >
            <Button size='small' circular color='green' icon='toggle right' onClick={this.compilePlugin} />
            <Button size='small' circular color='blue' icon='upload' onClick={this.uploadPlugin} />
            {inputType}
            <Container style={{ marginTop: '10px' }}>
                {inputElem}
            </Container>
        </Container>;
    }

    private renderEditor = () => {
        return <Grid divided='vertically'>
            <GridRow>{this.guideline()}</GridRow>
            <GridRow>
                <Segment>{this.renderPluginDesc()}</Segment>
            </GridRow>
            <GridRow>{this.renderInput()}</GridRow>
        </Grid>
    }

    public render(): ReactNode {
        const plugin = this.state.plugin;
        return (<div style={{ marginLeft: '5px' }}>
            <Grid columns={2}>
                <GridRow>
                    <GridColumn width={10}>{this.renderEditor()}</GridColumn>
                    <GridColumn width={6}>
                        <div className='pugin-preview-container' style={{ marginTop: 'calc(2vh)'}}>{
                            plugin ? <RndComponent component={plugin.component} describe={plugin.describe}></RndComponent>
                                : <div>empty</div>
                        }</div>
                    </GridColumn>
                </GridRow>
            </Grid>
        </div>);
    }
}