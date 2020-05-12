import Button from './button';
import Container from './container';
 
import {Asura, Addon} from './vendor';

export const plugins: Addon[] = [
    {describe: Button.describe, component: Button.ButtonPlugin, type: 'sprite', styleEditor: Button.ButtonStyle, strategyEditor: Button.ButtonStrategy},
    {describe: Container.describe, component: Container.ContainerPlugin, type: 'scene', styleEditor: Container.ContainerStyle}
]

const packing = (asura: Asura) => {
    plugins.forEach((plugin: any) => console.log("mount external result: ", asura.mountAddon(plugin)));
}

export default { packing };