import { autobind } from "core-decorators";
import * as React from 'react';
import { Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Payload } from '@/store/common/Types';
import { PageElement } from '@/store/reducers/page';
import { Project, PluginPack } from '@/common/models/Project';
import Asura from '@/core/Asura';
import 'semantic-ui-css/semantic.min.css';

interface Props {
    project?: Project;
    pageElements?: Map<string, PageElement>
}

interface States {
    loaded: boolean;
}

@connect((state: Payload, props) => ({
    project: state.project,
    pageElements: state.page
})) @autobind
export default class PreviewComponent extends React.Component<Props, any> {

    private _ref;

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log("states: ", this.props);
        const registerEmbeddedAddons = async (imports) => {
            // load project
            // then initiliaze components

            await Asura
                .instance()
                .registerPlugins(imports.default);
            await Asura.instance().prepareDependencies();
            this.setState({ loaded: true });
        }

        // todo initial with default components.
        // registerEmbeddedAddons("");

        import('@/external/index').then(registerEmbeddedAddons);
    }

    public render(): React.ReactNode {
        const added: PageElement[] = [];
        if (this.props === null || !this.props.pageElements) {
            return <div>Empty</div>
        }
        // this.props.pageElements.forEach((element) => {added.push(element)});

        const myPlugin: PluginPack | undefined = Asura.instance().getPluginPack("official#Button#v1");
        const Plugin: any = myPlugin?.component;
        console.log("P: ", Plugin, " === ", myPlugin);
        if (!Plugin) return <div>Nothing</div>;
        return <Container>
            <div style={{ width: '120px', height: '60px', backgroundColor: 'red' }}>A</div>
            <div style={{ width: '120px', height: '60px' }}>
                <Plugin ref={this._ref}  styles={{ text: "hello", background: "" }} />
            </div>
        </Container>;
    }
}
