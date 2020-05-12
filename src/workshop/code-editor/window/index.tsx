import * as React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds';
import 'ace-builds/webpack-resolver';
import { Rect } from '@/core/vendor/protocol';

interface Option {
    initialCode?: string;
    lang: "java" | "typescript" | "json" | "xml" | "javascript" | "html";
    style: "monokai" | "github" | "solarized_dark";
    onChange?: (val: string) => void;
    completes?: any[] | undefined;
    rect?: Rect
}

interface States {
    initialized: boolean;
}

export class Editor extends React.Component<Option, States> {

    constructor(props) {
        super(props);
        this.state = { initialized: false };
    }

    private text: string | undefined = "";

    // =========================================
    // =               Lifecycle
    // =========================================
    public componentWillMount() {
        const configure = async () => {
            const lang = this.props.lang;
            require(`ace-builds/src-noconflict/mode-${lang}`);
            require(`ace-builds/src-noconflict/snippets/${lang}`);

            await import(`ace-builds/src-noconflict/theme-${this.props.style}`);
            await import(`ace-builds/src-min-noconflict/ext-language_tools`);
            await import(`ace-builds/src-min-noconflict/ext-searchbox`);
            this.setState({ initialized: true });
        }
        configure();
    }

    // ========================================
    // =         Editor expansion
    // ========================================
    private completor = (editor): void => {
        let customizeCompletors = this.props.completes;
        editor.completers.push({
            getCompletions: function (callback) {
                callback(null, customizeCompletors);
            }
        });
    }

    public onChange = (code: string): void => {
        if (this.props && this.props.onChange) {
            this.props.onChange(code);
        }
    }

    public renderEditor = (): React.ReactNode => {
        if (!this.state.initialized) {
            return <div>loading</div>
        }

        const {height, width} = this.props.rect ? this.props.rect : {height: '320px', width: '100%'};

        const editor = <AceEditor
            style={{...editorStyle, height, width}}
            mode={this.props.lang}
            theme={this.props.style}
            onChange={this.onChange}
            editorProps={{ $blockScrolling: true }}
            name="UNIQUE_ID_OF_DIV"
            enableBasicAutocompletion={true}
            enableLiveAutocompletion={true}
            enableSnippets={true}
            value={this.props.initialCode ? this.props.initialCode : this.text}
        />
        return editor;
    }

    public render(): React.ReactNode {
        const e = this.renderEditor();
        return (
            <div>{e}</div>
        );
    }
}

const editorStyle: React.CSSProperties = {
    boxShadow: "#666 0px 0px 10px",
    borderRadius: "5px",
    width: '100%'
}

export const ele = () => {
    return <Editor lang='java' style='solarized_dark' />
}