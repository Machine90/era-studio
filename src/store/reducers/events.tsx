
import _ from 'lodash';
import { processAsuraHandlers } from '../common/Utils';
import { AsuraHandler, AsuraAction, Event } from '../common/Types';

const initialEvent: Event | any = {
    refresh: false
};

export default function eventReducer(event: Event = initialEvent, action: AsuraAction) {
    const param: any = {type: action.type};
    const handler = ACTION_HANDLES[param.type];
    return handler ? handler(event, action) : event;
}

const handlers: AsuraHandler[] = [
    {
        type: "EVENT_REFRESH_PAGE",
        handler: (state: Event, action: AsuraAction): Event => {
            if (!state) return state;
            const refresh = !state.refresh;
            console.log("refresh event...: ", state);
            return {...state, refresh};
        }
    },
];

const ACTION_HANDLES = processAsuraHandlers(handlers);
