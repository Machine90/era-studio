
import _ from 'lodash';
import { processAsuraHandlers } from '../common/Utils';
import { AsuraHandler, AsuraAction } from '../common/Types';
import { Project, PluginElement } from '@/common/models/Project';

const initialProject: Project | any = {
};

export default function projectReducer(project: Project = initialProject, action: AsuraAction) {
    const param: any = {type: action.type};
    const handler = ACTION_HANDLES[param.type];
    return handler ? handler(project, action) : project;
}

const handlers: AsuraHandler[] = [
    {
        type: "UPDATE_PROJECT_CONFIG",
        handler: (state: Project, action: AsuraAction) => {
            const { project } = action.payload;
            return {
                ...project
            };
        }
    },
    {
        type: "APPEND_ELEMENT",
        handler: (state: Project, action: AsuraAction) => {
            const plugin: PluginElement | undefined = action.payload.focusPlugin;
            if (plugin && plugin.seq) {
                state.elements.push(plugin);
                if (plugin.type === 'scene') {
                    state.selectedElement = plugin.seq;
                }
            }
            return { ...state }
        }
    },
    {
        type: "REMOVE_ELEMENT",
        handler: (state: Project, action: AsuraAction) => {
            let removeElementSeq: string | undefined = action.payload.focusElementSeq;
            remove_plugin: if (removeElementSeq) {
                const index: number = _.findIndex(state.elements, {"seq": removeElementSeq});
                if (index <= -1) break remove_plugin;
                state.elements.splice(index, 1);
                state.selectedElement = undefined;
            }
            return {
                ...state
            }
        }
    },
    {
        type: "SELECT_ELEMENT",
        handler: (project: Project, action: AsuraAction) => {
            let selectedSeq = action.payload.focusElementSeq;
            let selectedElement = selectedSeq;
            return {
                ...project, selectedElement
            };
        }
    }
];

const ACTION_HANDLES = processAsuraHandlers(handlers);
