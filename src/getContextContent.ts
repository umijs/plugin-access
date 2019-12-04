
export default function(accessFilePath: string) {
  return `\
import React from 'react';
import accessFactory from '${accessFilePath}';

export type AccessInstance = ReturnType<typeof accessFactory>;

const AccessContext = React.createContext<AccessInstance>(null);

export default AccessContext;
`;
}
