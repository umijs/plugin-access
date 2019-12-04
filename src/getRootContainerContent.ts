
export default function(accessFilePath: string) {
  return `\
import React, { useMemo } from 'react';
import { IRoute } from 'umi-types';
import { useModel } from '@alipay/bigfish';
import AccessContext, { AccessInstance } from './context';
import accessFactory from '${accessFilePath}';

const _routes = require('../router');

type Routes = IRoute[];

if (typeof useModel !== 'function') {
  throw new Error('[plugin-access]: useModel is not a function, plugin-init is needed.')
}

function traverseModifyRoutes(routes: Routes, access: AccessInstance) {
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

export function rootContainer(container) {
  const { info, refresh, loading } = useModel('@@initialState');

  const access = useMemo(() => accessFactory(info), [info]);

  _routes.splice(0, _routes.length, ...traverseModifyRoutes(_routes, access));

  if (loading) {
    return null; // ! 影响很大，需要确定要不要这么做，不这么做有没有更好的办法
  }

  return React.createElement(
    AccessContext.Provider,
    { value: access },
    container,
  );
}
`;
}
