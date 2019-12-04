
export default function(accessFilePath: string) {
  return `\
import React from 'react';
import AccessProvider from './AccessProvider';

export function rootContainer(container) {
  return React.createElement(AccessProvider, null, container);
}
`;
}
