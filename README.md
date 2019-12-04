# @umijs/plugin-access

[![codecov](https://codecov.io/gh/umijs/plugin-access/branch/master/graph/badge.svg)](https://codecov.io/gh/umijs/plugin-access)
[![NPM version](https://img.shields.io/npm/v/@umijs/plugin-access.svg?style=flat)](https://npmjs.org/package/@umijs/plugin-access)
[![CircleCI](https://circleci.com/gh/umijs/plugin-access/tree/master.svg?style=svg)](https://circleci.com/gh/umijs/plugin-access/tree/master)
[![GitHub Actions status](https://github.com/umijs/plugin-access/workflows/Node%20CI/badge.svg)](https://github.com/umijs/plugin-access)
[![NPM downloads](http://img.shields.io/npm/dm/@umijs/plugin-access.svg?style=flat)](https://npmjs.org/package/@umijs/plugin-access)

Umi plugin for access management.

## Prerequisites

Before using this plugin, you need install and enable [@umijs/plugin-model](https://www.npmjs.com/package/@umijs/plugin-model) and [@umijs/plugin-initial-state](https://www.npmjs.com/package/@umijs/plugin-initial-state).

## Install

```bash
# or yarn
$ npm install @umijs/plugin-access --save
```

## Usage

Getting started in 3 steps.

### 1. Configure in `.umirc.js`

**Caution**: `@umijs/plugin-access` must be after `@umijs/plugin-model`.

```js
export default {
  plugins: [
    ['@umijs/plugin-access'],
    ['@umijs/plugin-model'],
    ['@umijs/plugin-initial-state'],
  ],
};
```

### 2. TODO



Full example can find in [./example](https://github.com/umijs/plugin-access/tree/master/example).

## LICENSE

MIT
