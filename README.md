# sinon-mocha-test [![npm version][npm-badge]][npm-url] [![build status][circle-badge]][circle-url] [![coverage status][coverage-badge]][coverage-url]

Automatic Sinon sandbox for Mocha tests in Javascript and Typescript.

A utility function which wraps a mocha tests and automatically removes mocks.

## Installation

```bash
npm install sinon-mocha-test
```
or
```bash
yarn add sinon-mocha-test
```

## Usage

```js

import fs from 'fs';
import assert from 'assert';
import sinonTest from 'sinon-mocha-test';

// Example function to test
export default async function readJsonFile(path) {
  return JSON.parse((await fs.readFile(path)).toString());
}

describe('readJsonFile', () => {
  it('Resolves with the data from a JSON file', sinonTest(async function(sinon) {
    const readFile = sinon.stub(fs, 'readFile').resolves('{"version":"123"}\n');
    assert.deepStrictEqual(await readJsonFile('file.json'), { version: '123' });
    assert.strictEqual(readFile.callCount, 1);
  }));
});
```

### Custom sandbox options

Use `sinonTest.create` to specify custom Sinon sandbox options:

```js
import sinonTest from 'sinon-mocha-test';

// Example function to test
export default async function delay(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  })
}

describe('delay', () => {
  it('Resolves after a delay', sinonTest.create({ useFakeTimers: false }, async function(sinon) {
    await delay(10);
  }));
});
```

### With CommonJS / require()

```js
const sinonTest = require('sinon-mocha-test').default;
```


[npm-badge]: https://badge.fury.io/js/sinon-mocha-test.svg
[npm-url]: https://www.npmjs.com/package/sinon-mocha-test

[circle-badge]: https://circleci.com/gh/peterjwest/sinon-mocha-test.svg?style=shield
[circle-url]: https://circleci.com/gh/peterjwest/sinon-mocha-test

[coverage-badge]: https://coveralls.io/repos/peterjwest/sinon-mocha-test/badge.svg?branch=master&service=github
[coverage-url]: https://coveralls.io/github/peterjwest/sinon-mocha-test?branch=master
