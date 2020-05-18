import Button from './button';
import Container from './container';
import Scene from './game';
 
import {Asura, Addon} from './vendor';

export const plugins: Addon[] = [
    {type: 'sprite', describe: Button.describe, component: Button.ButtonPlugin, styleEditor: Button.ButtonStyle, strategyEditor: Button.ButtonStrategy},
    {type: 'scene', describe: Container.describe, component: Container.ContainerPlugin, styleEditor: Container.ContainerStyle},
    {type: 'scene', describe: Scene.describe, component: Scene.GameScene, styleEditor: Scene.GameSceneStyle}
]

const packing = (asura: Asura) => {
    plugins.forEach((plugin: any) => console.log("mount external result: ", asura.mountAddon(plugin)));
}

export default { packing };