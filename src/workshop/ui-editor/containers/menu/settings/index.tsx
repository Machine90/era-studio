import SettingsMenu from './SettingsMenu';
import * as React from 'react';


export default class Settings extends React.Component {
    constructor(props) {
        super(props);
    }

    static MenuBar = SettingsMenu;
};