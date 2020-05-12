import * as React from 'react';
import { autobind } from 'core-decorators';
import { Tab, Container } from 'semantic-ui-react';
import AddonUpload from './AddonUpload';
import '../index.module.css'
import AddonInventory from './AddonInventory';

@autobind
class AddonManagment extends React.Component {

    constructor(props) {
        super(props);
    }

    private renderPanes = () => {
        const panes = [
            {
                menuItem: { key: 'upload', icon: 'cloud upload', content: 'Upload' },
                render: () => <Tab.Pane style={{height: 'calc(92vh)'}}><AddonUpload /></Tab.Pane>
            },
            {
                menuItem: { key: 'inventory', icon: 'briefcase', content: 'Inventory' },
                render: () => <Tab.Pane style={{height: 'calc(92vh)'}}><AddonInventory /></Tab.Pane>
            },
        ];

        return panes;
    }

    public render(): React.ReactNode {
        return (<div>
            <Tab panes={this.renderPanes()} style={{marginTop: '5px'}}></Tab>
        </div>);
    }

}

export default AddonManagment;