import { AsuraAction, AsuraHandler } from "../common/Types";
import { processAsuraHandlers } from '../common/Utils';
import Asura from '@/core/Asura';
import { PluginPack } from '@/common/models/Project';
import _ from 'lodash';

export class PageElement {
    public seq: string;
    public styles: object = {};
    public strategy: object = {};
    public plugin: PluginPack;
    public children?: PageElement[];
    public parent?: PageElement;
}

const handlers: AsuraHandler[] = [
    {
        type: 'APPEND_ELEMENT',
        handler: (state: Map<string, PageElement>, action: AsuraAction) => {
            let { focusPlugin: plugin, focusPluginParent: parent } = action.payload;
            console.log("append paged elements")
            if (!plugin || !plugin.seq) return { ...state };

            const pluginPacket = Asura.instance().getPluginPack(plugin.pluginId);

            if (!pluginPacket) return { ...state };

            const newElement: PageElement = { seq: plugin.seq, plugin: pluginPacket, styles: {}, strategy: {} };
            if (parent && parent.seq) {
                parent.children = parent.children || [];
                parent.children.push(newElement);
                newElement.parent = parent;
            }
            state.set(plugin.seq, newElement);
            return new Map(state);
        }
    },
    {
        type: "REMOVE_ELEMENT",
        handler: (state: Map<string, PageElement>, action: AsuraAction) => {
            let { focusElementSeq } = action.payload;
            if (!focusElementSeq) return state;
            const element: PageElement | undefined = state.get(focusElementSeq);

            if (!element) return state;
            const parent = element.parent;
            const children = element.children;

            remove_from_pa: if (parent && parent.children) {
                const index: number = _.findIndex(parent.children, {"seq": focusElementSeq});
                if (index <= -1) break remove_from_pa;
                parent.children.splice(index, 1);
            }

            if (children && children.length > 0) {
                children.forEach(child => {
                    state.delete(child.seq);
                });
            }
            state.delete(element.seq);
            return new Map(state);
        }
    },
    {
        type: "EVENT_REFRESH_PAGE",
        handler: (state: Map<string, PageElement>, action: AsuraAction) => {
            let { event } = action.payload;
            if (event && event.refresh) return new Map(state);
            else return state;
        }
    },
];

const ACTION_HANDLERS: object = processAsuraHandlers(handlers);

export default function reducePageState(state: Map<string, PageElement> = new Map(), action: AsuraAction) {
    const param: any = {type: action.type};
    const foundHandler = ACTION_HANDLERS[param.type];
    return foundHandler ? foundHandler(state, action) : state;
}
