import { applyMiddleware, compose, createStore } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';


export default (initialState = {})=>{
    const middleware = [thunk];
  const enhancers = [];

  let composeEnhancers = compose;

  // redux DevTools Extension
  // https://github.com/zalmoxisus/redux-devtools-extension/
  if (process.env.NODE_ENV === 'development') {
    const composeWithDevToolsExtension = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    if (typeof composeWithDevToolsExtension === 'function') {
      composeEnhancers = composeWithDevToolsExtension;
    }
  }

  return createStore(
    reducers,
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
      ...enhancers,
    ),
  );

}