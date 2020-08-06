import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';

import AdminPanel from '../pages/AdminPanel';
import AdminCatalog from '../pages/AdminCatalog';
import AdminUsers from '~/pages/AdminUsers';
import Catalog from '~/pages/Catalog';
import AdminRewardRequests from '~/pages/AdminRewardRequests';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/signup" component={SignUp} />
    <Route path="/forgot-password" component={ForgotPassword} />
    <Route path="/reset-password" component={ResetPassword} />

    <Route path="/dashboard" component={Dashboard} isPrivate />
    <Route path="/profile" component={Profile} isPrivate />
    <Route path="/catalog" component={Catalog} isPrivate />
    <Route
      exact
      path="/admin-panel"
      component={AdminPanel}
      isPrivate
      isAdminOnly
    />
    <Route
      path="/admin-panel/catalog"
      component={AdminCatalog}
      isPrivate
      isAdminOnly
    />
    <Route
      path="/admin-panel/users"
      component={AdminUsers}
      isPrivate
      isAdminOnly
    />
    <Route
      path="/admin-panel/reward-requests"
      component={AdminRewardRequests}
      isPrivate
      isAdminOnly
    />
  </Switch>
);

export default Routes;
