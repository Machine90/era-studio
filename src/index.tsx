import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import createStore from "./store";

import Workshop from '@/workshop/ui-editor/index';
import Simulator from '@/workshop/simulator/index';

import 'semantic-ui-css/semantic.min.css';
import './index.css';

import registerServiceWorker from './registerServiceWorker';

// test
import Test from './workshop/temp/test';
import PreviewComponent from './workshop/simulator/PreviewComponent';

import {PCHome} from './workshop/home'

const initialState = (window as any).___INITIAL_STATE__;
const store = createStore(initialState);

const routers = (): any => {
    const routers = <BrowserRouter>
        <Switch>
            <Route path="/ui-editor/:activeMenu" component={Workshop} />
            <Route path="/preview" component={Simulator} />
            <Route path="/test" component={Test} />

            <Route path="/pre-com" component={PreviewComponent} />
            <Route path="/home" coomponent={PCHome} />
            
            <Redirect to="/ui-editor/studio" />
        </Switch>
    </BrowserRouter>;
    return routers;
}

const router = routers();
const app = <Provider store={store}>{router}</Provider>;

window.onerror = function (message, source, lineno, colno, error) {
    this.confirm("组件加载错误, 详见:\n" + message);
    window.location.href = "/ui-editor/settings"
}

ReactDOM.render(app, document.getElementById('root') as HTMLElement);
registerServiceWorker();