export default function() {
  return `\
import React, { useContext } from 'react';
import AccessContext from './context';

export const useAccess = () => {
  const access = useContext(AccessContext);

  return access;
};

export interface AccessProps {
  accessible: boolean;
  fallback?: Exclude<React.ReactNode, {}>;
  children: Exclude<React.ReactNode, {}>;
}

export const Access: React.FC<AccessProps> = (props: AccessProps) => {
  const { accessible, fallback, children } = props;

  if (process.env.NODE_ENV === 'development' && typeof accessible === 'function') {
    console.warn('[plugin-access]: provided "accessible" prop is a function instead of a boolean, maybe you need check it.');
  }

  return accessible ? children : fallback;
};
`;
}
