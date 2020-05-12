import { Describe, StrategyEditor } from '@/core/vendor/protocol';
import { AsuraScene, AsuraSprite, StylesEditor, ComponentType } from '@/core/vendor/protocol';


export class PluginInfo {
    public id?: string;
    public type: ComponentType;
    public describe: Describe;
}

export class Plugin extends PluginInfo {
    public component?: AsuraScene | AsuraSprite | any | Element;
    public element?: any;
}

export class PluginPack extends Plugin {
    public styleEditor?: StylesEditor;
    public strategyEditor?: StrategyEditor;
}

export class PluginElement {
    public seq: string;
    public type: ComponentType;
    public pluginId: string;
    public parent?: PluginElement;
    public children: PluginElement[];
}

export class Project {
    public id: string;
    public name: string;
    public desc: string;
    public author: string;
    public elements: PluginElement[];
    public selectedElement?: string;
}
