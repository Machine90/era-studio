import { combineReducers } from 'redux';
import { Project, Plugin, PluginElement } from '@/common/models/Project';
import project from './project';
import element from './element';
import page, { PageElement } from './page';
import events from './events';

import { EventType, Payload, AsuraAction } from '../common/Types';


/***
 * Standard event message
 */
export class Message {
    type: EventType;
    payload: Payload = new Payload();

    public static of = (type: EventType, project: Project): Message => {
        const message: Message = new Message();
        message.type = type;
        message.payload.project = project;
        return message;
    }

    public toObject(): object {
        return {
            type: this.type,
            payload: this.payload
        }
    }
}

// ===================================
// =            Project actions
// ===================================
export const selectedProject = () => async (dispatch, getState): Promise<Project> => {
    const mockedProject = new Project();
    mockedProject.author = "XunMo";
    mockedProject.desc = "Demo";
    mockedProject.id = "1";
    mockedProject.name = "Spring Festival Promotion!!";
    mockedProject.elements = [];
    
    dispatch(Message.of("UPDATE_PROJECT_CONFIG", mockedProject).toObject());
    return mockedProject;
}

// ===================================
// =            Page actions
// ===================================


// ===================================
// =             Plugin actions
// ===================================

export const appendPlugin = (plugin: Plugin, parent?: PageElement, seq?: string): AsuraAction => {
    if (!plugin || !plugin.id) return ({
        type: 'APPEND_ELEMENT',
        payload: {}
    });

    const addElement: PluginElement = new PluginElement();
    addElement.seq = seq ? seq : `${new Date().getTime()}`;
    addElement.pluginId = plugin.id;
    addElement.type = plugin.type;

    const payload: Payload = {
        focusPlugin: addElement,
        focusPluginParent: parent,
    };

    if (plugin.type === 'scene') {
        payload.focusElementSeq = addElement.seq;
    }

    return ({
        type: 'APPEND_ELEMENT',
        payload: payload
    });
};

export const removeElement = (selectedElementSeq: string): AsuraAction => ({
    type: "REMOVE_ELEMENT",
    payload: {
        focusElementSeq: selectedElementSeq
    }
});

// Events
export const refreshEvent = (): AsuraAction => ({
    type: "EVENT_REFRESH_PAGE",
    payload: {
        event: {
            refresh: false
        }
    }
});

export default combineReducers({
    project, element, page, events
});