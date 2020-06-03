
import _ from 'lodash';
import { processAsuraHandlers } from '../common/Utils';
import { AsuraHandler, AsuraAction, Event } from '../common/Types';
import { Lang } from '@/common/components/I18nSelector';

const initialEvent: Event = {
    refresh: false,
    lang: "zh-CN"
};

const handlers: AsuraHandler[] = [
    {
        type: "EVENT_REFRESH_PAGE",
        handler: (events: Event, action: AsuraAction): Event => {
            if (!events) return events;
            const refresh = !action.payload.events?.refresh;
            return {...events, refresh};
        }
    },
    {
        type: "CHANGE_LANG",
        handler: (events: Event, action: AsuraAction): Event => {
            if (!events) return events;
            const event = action.payload.events;
            console.log("change event lang... ", event, " state: ", events);
            let lang: Lang = event && event.lang ? event.lang : "zh-CN";
            return {...events, lang};
        }
    }
];

const ACTION_HANDLES = processAsuraHandlers(handlers);

export default function eventReducer(events: Event = initialEvent, action: AsuraAction) {
    const param: any = {type: action.type};
    const handler = ACTION_HANDLES[param.type];
    return handler ? handler(events, action) : events;
}