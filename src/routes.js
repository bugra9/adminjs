import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Layout from './views/layouts/Layout';
import NotFound from './views/pages/notFound';
import Dashboard from './views/pages/dashboard';
import ListDocuments from './views/pages/list';
import EditDocuments from './views/pages/edit';
import Login from './views/pages/login';

const userIsLogin = (nextState, replace, callback) => {
  if(!window.login) {
    replace({
      pathname: '/login',
      state: { nextPath: nextState.location.pathname }
    });
  }
  callback();
};

const routes = (
  <Route>
    <Route path="/login" component={Login} />
    <Route path="/" component={Layout}>
      <IndexRoute component={Dashboard} onEnter={userIsLogin} />
      <Route path="edit/*" component={EditDocuments} onEnter={userIsLogin} />
      <Route path="list/*" component={ListDocuments} onEnter={userIsLogin} />
    </Route>
    <Route path="*" component={NotFound} />
  </Route>
);

export default routes;