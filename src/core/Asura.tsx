import { Assert, Validator } from '@/common/Utils';
import { AsuraScene, AsuraSprite, StylesEditor, Addon, Describe, StrategyEditor } from './vendor/protocol';
import { Plugin, PluginPack, PluginInfo } from '@/common/models/Project';
import { isObject } from 'util';

import * as React from 'react';

interface Dependency {
    package: string;
    name: string;
    loader: any;
}

declare type MountState = 'VALIDATE' | 'PACKING' | 'IDLE';

const State = (mountState: MountState) => {
    return (
        target: Asura,
        propertyName: string,
        descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
    ) => {
        const method = descriptor.value;
        descriptor.value = function (...args: any[]) {
            Asura.instance().mountState = mountState;
            const result = method!.apply(this, args);
            Asura.instance().mountState = "IDLE";
            return result;
        };
    };
}

class Asura extends React.Component {

    private static _this: Asura;
    private _plugins: Map<string, PluginPack> = new Map();
    private _registeredPlugins: any[];

    public mountState: MountState = 'IDLE';
    private validatePlugin: PluginPack;
    public getPlugin(id: string): Plugin | undefined {
        const packed: PluginPack | undefined = this._plugins.get(id);
        let result: PluginInfo | undefined;
        if (packed) {
            result = { type: packed.type, describe: packed.describe, id: packed.id }
        }
        return result;
    }

    public getPluginPack(id: string): PluginPack | undefined {
        return this._plugins.get(id);
    }

    public static instance(): Asura {
        if (!this._this) {
            this._this = new Asura();
        }
        return this._this;
    }

    public get pluginPacks(): Map<string, PluginPack> {
        return this._plugins;
    }

    constructor() { super({}) }

    public mountAddon = (addon: Addon): string => {
        const desc: Describe = addon.describe;
        const Component: any = addon.component;
        const styleEditor = addon.styleEditor;
        const strategyEditor = addon.strategyEditor;

        if (!desc || !Component) {
            return 'Both describe and component is require';
        }

        try {
            React.createElement(Component);
        } catch (err) {
            return "invalid component " + desc.name + "!!!";
        }

        const type = addon.type;

        const componentId = Asura.componentId(desc);
        const plugin: PluginPack = new PluginPack();
        desc.isScene = type === 'scene';
        plugin.describe = desc;
        // classify all components.
        plugin.type = type;

        plugin.component = Component;
        plugin.styleEditor = styleEditor;
        plugin.strategyEditor = strategyEditor;

        plugin.id = componentId;
        if (this.mountState === 'PACKING') {
            this._plugins.set(componentId, plugin);
        }
        else if (this.mountState === 'VALIDATE') {
            this.validatePlugin = plugin;
        }
        else {
            // noop
        }
        return "success";
    }

    /**
     * This method using to mount first party plugins. It's a short-hand way to 
     * mount first party plugins
     * 
     * @param rawPlugin package include 'describe' 'component' and 'editor' is optional.
     * @returns mount result, 'success' or 'failure' reason.
     */
    public mount = (rawPlugin: object): string => {
        let describe: Describe | undefined = undefined;
        let component: any;
        let inst: any;
        let styleEditor: StylesEditor | undefined = undefined;
        let strategyEditor: StrategyEditor | undefined = undefined;
        for (let key in rawPlugin) {
            const element: any = rawPlugin[key];
            if (isObject(element)) {
                describe = (element as Describe);
            } else if (typeof element === 'function') {
                const instance: object = new element();
                if (instance instanceof StylesEditor) {
                    styleEditor = element;
                } else if (instance instanceof StrategyEditor) {
                    strategyEditor = element;
                } else {
                    component = element;
                    inst = instance;
                }
            }
        }

        if (describe === undefined) {
            return "lack of component";
        }

        const componentId = Asura.componentId(describe);
        const isScene = (inst instanceof AsuraScene);
        const isSprite = (inst instanceof AsuraSprite);

        Assert.checkState(isScene || isSprite, "Invalid component type");
        const plugin: PluginPack = new PluginPack();
        describe.isScene = isScene;
        plugin.describe = describe;
        // classify all components.
        plugin.type = isScene ? "scene" : "sprite";
        plugin.component = component;
        plugin.styleEditor = styleEditor;
        plugin.strategyEditor = strategyEditor;

        plugin.id = componentId;
        this._plugins.set(componentId, plugin);
        return "success";
    }

    public static componentId = (describe: Describe): string => {
        // version of component default to 1;
        if (Validator.isEmpty(describe.version)) describe.version = 1;
        Assert.checkState(
            Validator.isNotEmpty(describe.name) && Validator.isNotEmpty(describe.app),
            "incorrect component describe"
        );
        return describe.app + "#" + describe.name + "#v" + describe.version;
    }

    @State("PACKING")
    public async registerPlugins(pluginPackage) {
        console.log("state: ", this.mountState);
        const registeredPlugins: any[] = (this._registeredPlugins || (this._registeredPlugins = []));
        if (registeredPlugins.indexOf(pluginPackage) > -1) {
            return this;
        }
        let context = {};
        if (typeof pluginPackage.packing === 'function') {
            context = await pluginPackage.packing.call(pluginPackage, this);
        } else if (typeof pluginPackage === 'function') {
            context = await pluginPackage.apply(null, this);
        }
        if (!isObject(context)) context = {};
        registeredPlugins.push(pluginPackage);
        return context;
    }

    @State("VALIDATE")
    public async validateLoadedPlugin(pluginPackage): Promise<PluginPack> {
        let context = {};
        if (typeof pluginPackage.packing === 'function') {
            context = await pluginPackage.packing.call(pluginPackage, this);
        } else if (typeof pluginPackage === 'function') {
            context = await pluginPackage.apply(null, this);
        }
        return this.validatePlugin;
    }

    // ================================================
    // =                remote component loader
    // ================================================

    public loadAddonFromCode = async (code: string, loadState: MountState): Promise<PluginPack | undefined> => {
        try {
            await this.prepareDependencies();
            const addon = eval(code);
            // Asura.instance().registerPlugins(addon.default);
            console.log("plug: ", addon);
            if (loadState === 'VALIDATE') {
                const plugin: PluginPack = await Asura.instance().validateLoadedPlugin(addon.default);
                return plugin;
            } else if (loadState === 'PACKING') {
                await Asura.instance().registerPlugins(addon.default);
                return undefined;
            }
            return undefined;
        } catch (err) {
            console.log("warning: ", err)
            return undefined;
        }
    }

    public loadAddonFromJS = async (url: string) => {
    }

    public prepareDependencies = async () => {
        if (!window['React']) window['React'] = await import('react');
        if (!window['semanticUIReact']) window['semanticUIReact'] = await import('semantic-ui-react');
        if (!window['ReactDOM']) window['ReactDOM'] = await import('react-dom');
        if (!window['reactPhaserFiber']) {
            window['reactPhaserFiber'] = await import('react-phaser-fiber');
        }
        if (!window['lodash']) window['lodash'] = await import('lodash');
    }
}

export default Asura;