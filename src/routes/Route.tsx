import React from 'react';
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouterProps,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

interface RouteProps extends ReactDOMRouterProps {
  isPrivate?: boolean;
  isAdminOnly?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  isAdminOnly = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        const redirect = (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/dashboard',
              state: { from: location },
            }}
          />
        );

        if (isAdminOnly && !user?.is_admin) {
          return redirect;
        }

        if (isPrivate === !!user) {
          return <Component />;
        }

        return redirect;
      }}
    />
  );
};

export default Route;
