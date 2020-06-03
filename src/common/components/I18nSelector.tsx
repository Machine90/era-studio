

import * as React from 'react';

import intl from 'react-intl-universal';
import _ from 'lodash';
import axios from 'axios';
import { Dropdown } from 'semantic-ui-react';
import { autobind } from 'core-decorators';
import { Payload, Event } from '@/store/common/Types';

import { changeLang } from '@/store/reducers/index';
import { connect } from 'react-redux';

export declare type Lang = "zh-CN" | "en-US" | "zh-TW";

const languageOptions = [
    { key: 'Chinese', text: '简体中文', value: 'zh-CN' },
    // { key: 'Taiwan', text: '繁體中文', value: 'zh-TW' },
    { key: 'English', text: 'English', value: 'en-US' },
]

interface States {
    loadedLocalization: boolean;
}

interface Props {
    initialLang?: Lang;
    events?: Event;
}

interface Props {
    changeLang?: (lang: Lang) => void;
}

@connect((state: Payload) => (
    {
        events: state.events
    }),
    {
        changeLang
    }
)
@autobind
class I18nSelector extends React.Component<Props, States> {

    constructor(props) {
        super(props);
        this.state = {
            loadedLocalization: false
        }
    }

    componentDidMount() {
        this.loadLocales("zh-CN");
    }

    public render() {
        return (
            this.state.loadedLocalization && (
                <div>
                    {this.renderLocaleSelector()}
                </div>
            )
        );
    }

    private loadLocales(lang: Lang) {
        let currentLocale = lang.toString();
        if (!_.find(languageOptions, { value: currentLocale })) {
            currentLocale = 'zh-CN';
        }
        axios
            .get(`/i18n/${currentLocale}.json`)
            .then(res => {
                return intl.init({ currentLocale, locales: { [currentLocale]: res.data } });
            })
            .then(() => {
                this.setState({ loadedLocalization: true }); 
                const { changeLang } = this.props;
                if (changeLang) {
                    changeLang(lang);
                }
            });
    }

    public renderLocaleSelector = () => {
        return (
            <Dropdown
                button
                className='icon'
                floating
                labeled
                icon='world'
                options={languageOptions}
                search
                text={intl.get('i18n.lang').defaultMessage('语言')}
                onChange={this.onSelectLocale}
            />
        );
    }

    private onSelectLocale = (e, { value }) => {
        this.loadLocales(value);
    };
}

export default I18nSelector;