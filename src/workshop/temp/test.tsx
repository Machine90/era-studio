import * as React from 'react';

import intl from 'react-intl-universal';
import _ from 'lodash';
import I18nSelector, { Lang } from '@/common/components/I18nSelector';

import { Payload } from '@/store/common/Types';

import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

@connect((state: Payload) => (
    {
        events: state.events
    })
)
@autobind
class Test extends React.Component<any, any> {

    public render(): React.ReactNode {
        return (
            <div>
                <I18nSelector></I18nSelector>
                <span>
                    <h1>{intl.get("MY_NAME").defaultMessage("Xun")}</h1>
                </span>
            </div>
        );
    }
}

export default Test;