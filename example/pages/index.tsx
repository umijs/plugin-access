import React from 'react';
import { useAccess, Access } from 'umi';
import styles from './index.css';

export default function() {
  const access = useAccess();

  return (
    <div className={styles.normal}>
      <h1>Page index</h1>
      <Access accessible={access.readArticle} fallback={<div>Can not read article.</div>}>
        <div>Can read article.</div>
      </Access>
      <Access accessible={access.updateArticle()} fallback={<div>Can not update article.</div>}>
        <div>Can update article.</div>
      </Access>
    </div>
  );
}
