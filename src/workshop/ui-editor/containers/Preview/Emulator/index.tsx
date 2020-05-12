import React, { Component } from "react";
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { Project } from '@/common/models/Project';
import { Payload } from '@/store/common/Types';
import { PageElement } from '@/store/reducers/page';
import AlignContainer from '@/core/asura-container/AlignContainer';



interface Props {
    project?: Project;
    pageElements?: Map<string, PageElement>
}

interface States {
}

@connect((state: Payload, props) => ({
    project: state.project,
    pageElements: state.page
})) @autobind
class EmulatorView extends Component<Props, States> {

    componentDidMount() { }

    componentDidUpdate() {
        console.log("emulator update..");
    }

    public render() {
        const added: PageElement[] = [];
        if ( this.props === null || !this.props.pageElements) {
            return <div>Empty</div>
        }
        this.props.pageElements.forEach((element) => {added.push(element)});

        return (
            <AlignContainer style={{
                height: '100%',
                position: 'relative',
            }} elements={added} />
        );
    }
}

export default EmulatorView;