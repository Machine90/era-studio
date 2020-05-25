import { Project, PluginElement } from '@/common/models/Project';
import { Action } from 'redux';
import { PageElement } from '../reducers/page';

export class Event {
    public refresh?: boolean = false;
    public screenDirection?: "vertical" | "horizontial";
}

export class Payload {
    public project?: Project;
    public pluginId?: string;
    public page?: Map<string, PageElement>;
    public focusPlugin?: PluginElement;
    public focusPluginParent?: PageElement;
    public focusElementSeq?: string;
    public event?: Event;
}

export type EventType = 
"INITIALIZE" |
"UPDATE_PROJECT_CONFIG" |  // project events
"APPEND_ELEMENT" |  // plugin events
"SELECT_ELEMENT" | "REMOVE_ELEMENT" |
"EVENT_REFRESH_PAGE"; // page template events

export interface AsuraAction extends Action {
    type: EventType;
    payload: Payload;
}

export interface AsuraHandler {
    type: EventType;
    handler: (state, action: AsuraAction) => void;
}