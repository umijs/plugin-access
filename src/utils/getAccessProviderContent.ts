export default function () {
  return `\
import React, { useMemo } from 'react';
import { useModel } from 'umi';
import { IRoute } from 'umi-types';
import accessFactory from '@/access';
import AccessContext, { AccessInstance } from './context';

if (typeof useModel !== 'function') {
  throw new Error('[plugin-access]: useModel is not a function, @umijs/plugin-initial-state is needed.')
}

const _routes = require('../router').routes;

type Routes = IRoute[];

function traverseModifyRoutes(routes: Routes, access: AccessInstance = {}) {
  const resultRoutes: Routes = [].concat(routes as any);
  const notHandledRoutes: Routes = [];

  notHandledRoutes.push(...resultRoutes);

  for (let i = 0; i < notHandledRoutes.length; i++) {
    const currentRoute = notHandledRoutes[i];
    if (currentRoute && currentRoute.access) {
      if (typeof currentRoute.access !== 'string') {
        throw new Error('[plugin-access]: "access" field set in "' + currentRoute.path + '" route should be a string.');
      }
      const accessProp = access[currentRoute.access];
      let accessible = true;
      if (typeof accessProp === 'function') {
        accessible = accessProp(currentRoute)
      } else if (typeof accessProp === 'boolean') {
        accessible = accessProp;
      }
      currentRoute.unaccessible = !accessible;
    }

    if (currentRoute.routes || currentRoute.childRoutes) {
      const childRoutes: Routes = currentRoute.routes || currentRoute.childRoutes;
      if (!Array.isArray(childRoutes)) {
        continue;
      }
      notHandledRoutes.push(...childRoutes);
    }
  }

  return resultRoutes;
}

interface Props {
  children: React.ReactNode;
}

const AccessProvider: React.FC<Props> = props => {
  const { children } = props;
  const { initialState } = useModel('@@initialState');

  const access = useMemo(() => accessFactory(initialState), [initialState]);

  if (process.env.NODE_ENV === 'development' && (access === undefined || access === null)) {
    console.warn('[plugin-access]: the access instance created by access.ts(js) is nullish, maybe you need check it.');
  }

  _routes.splice(0, _routes.length, ...traverseModifyRoutes(_routes, access));

  return React.createElement(
    AccessContext.Provider,
    { value: access },
    children,
  );
};

export default AccessProvider;
`;
}
