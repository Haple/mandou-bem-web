import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

import Profile from '../pages/Profile';

import AdminPanel from '../pages/AdminPanel';
import AdminCatalog from '../pages/AdminCatalog';
import AdminUsers from '~/pages/AdminUsers';
import AdminPositions from '~/pages/AdminPositions';
import AdminDepartments from '~/pages/AdminDepartments';
import Catalog from '~/pages/Catalog';
import AdminRewardRequests from '~/pages/AdminRewardRequests';
import AdminValidateReward from '~/pages/AdminValidateReward';
import Feed from '~/pages/Feed';
import Analytics from '~/pages/Analytics';
import AdminEnpsSurveys from '~/pages/AdminEnpsSurveys';
import AdminEnpsSurveyDetails from '~/pages/AdminEnpsSurveyDetails';
import AdminRewardRequestsReport from '~/pages/AdminRewardRequestsReport';
import MyRewardRequests from '~/pages/MyRewardRequests';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/signup" component={SignUp} />
    <Route path="/forgot-password" component={ForgotPassword} />
    <Route path="/reset-password" component={ResetPassword} />

    <Route path="/feed" component={Feed} isPrivate />
    <Route path="/profile" component={Profile} isPrivate />
    <Route path="/catalog" component={Catalog} isPrivate />
    <Route path="/my-reward-requests" component={MyRewardRequests} isPrivate />
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
      path="/admin-panel/positions"
      component={AdminPositions}
      isPrivate
      isAdminOnly
    />
    <Route
      path="/admin-panel/departments"
      component={AdminDepartments}
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
    <Route
      path="/admin-panel/validate-reward"
      component={AdminValidateReward}
      isPrivate
      isAdminOnly
    />
    <Route
      exact
      path="/admin-panel/enps-surveys"
      component={AdminEnpsSurveys}
      isPrivate
      isAdminOnly
    />
    <Route
      exact
      path="/admin-panel/enps-surveys/:id/details"
      component={AdminEnpsSurveyDetails}
      isPrivate
      isAdminOnly
    />
    <Route
      path="/admin-panel/analytics"
      component={Analytics}
      isPrivate
      isAdminOnly
    />

    <Route
      exact
      path="/admin-panel/reward-requests-report"
      component={AdminRewardRequestsReport}
      isPrivate
      isAdminOnly
    />
  </Switch>
);

export default Routes;
