import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { matchPath } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { store } from './redux/store';
import { Helmet } from 'react-helmet';
import { KineticLib, history } from '@kineticdata/react';
import { actions as layoutActions } from './redux/modules/layout';
import { actions } from './redux/modules/app';
import { Authentication } from './components/authentication/Authentication';
import { App } from './App';

// Shared Components
import {
  FormComponents,
  TableComponents,
  CoreFormComponents,
} from '@kineticdata/bundle-common';

// Asynchronously import the global dependencies that are used in the embedded
// forms. Note that we deliberately do this as a const so that it should start
// immediately without making the application wait but it will likely be ready
// before users nagivate to the actual forms.
const globals = import('./globals');

if (process.env.NODE_ENV === 'development') {
  const axe = require('react-axe');
  axe(React, ReactDOM, 1000);
}

const ConnectedKineticLib = connect(state => ({
  locale: state.app.locale,
}))(KineticLib);

ReactDOM.render(
  <Fragment>
    <Helmet>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Helmet>
    <Provider store={store}>
      <ConnectedKineticLib
        globals={globals}
        components={{
          fields: {
            ...FormComponents.defaults,
          },
          ...TableComponents.defaults,
          coreForm: { ...CoreFormComponents.defaults },
        }}
      >
        {({ initialized, ...authProps }) =>
          initialized && (
            <ConnectedRouter history={history}>
              <Authentication {...authProps}>
                <App />
              </Authentication>
            </ConnectedRouter>
          )
        }
      </ConnectedKineticLib>
    </Provider>
  </Fragment>,
  document.getElementById('root'),
);

// Initialize the kappSlug state which is normally set on location change but
// since location changes are not fired on first load we need to do this
// manually.
const match = matchPath(history.location.pathname, {
  path: '/kapps/:kappSlug',
});
store.dispatch(actions.setKappSlug(match && match.params.kappSlug));

// Add global listeners
[
  ['small', window.matchMedia('(max-width: 767px)')],
  ['medium', window.matchMedia('(min-width: 768px) and (max-width: 991px)')],
  ['large', window.matchMedia('(min-width: 992px) and (max-width: 1199px)')],
  ['xlarge', window.matchMedia('(min-width: 1200px)')],
].forEach(([size, mql]) => {
  mql.addListener(event => {
    if (event.matches) {
      store.dispatch(layoutActions.setSize(size));
    }
  });
  if (mql.matches) {
    store.dispatch(layoutActions.setSize(size));
  }
});
