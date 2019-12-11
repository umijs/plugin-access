import { join } from 'path';
import { IConfig } from 'umi-types';

export default {
  routes: [
    { path: '/', component: './index', access: 'readArticle' },
  ],
  plugins: [
    join(__dirname, '..', require('../package').main || 'index.js'),
    ['@umijs/plugin-initial-state'],
    ['@umijs/plugin-model'],
  ],
} as IConfig;
