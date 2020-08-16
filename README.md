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

<!-- snippet: ts,es6 -->
```js
import fs from 'fs';
import assert from 'assert';
import sinonTest from 'sinon-mocha-test';

/** Example function to test */
async function readJsonFile(path) {
  return JSON.parse((await fs.promises.readFile(path)).toString());
}

describe('readJsonFile', () => {
  it('Resolves with the data from a JSON file', sinonTest(async (sinon) => {
    const readFile = sinon.stub(fs.promises, 'readFile').resolves('{"version":"123"}\n');
    assert.deepStrictEqual(await readJsonFile('file.json'), { version: '123' });
    assert.strictEqual(readFile.callCount, 1);
  }));
});
```

### Custom sandbox options

Use `sinonTest.create` to specify custom Sinon sandbox options:

<!-- snippet: ts,es6 -->
```js
import sinonTest from 'sinon-mocha-test';

/** Example function to test */
async function delay(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

describe('delay', () => {
  it('Resolves after a delay', sinonTest.create({ useFakeTimers: false }, async (sinon) => {
    await delay(10);
  }));
});
```

### With CommonJS / require()

<!-- snippet: js -->
```js
const assert = require('assert');
const sinonTest = require('sinon-mocha-test');

/** Example function to test */
function logger(message) {
  console.log(message);
}

describe('logger', () => {
  it('Resolves after a delay', sinonTest(function(sinon) {
    const log = sinon.stub(console, 'log');
    logger('Hello world');
    assert.strictEqual(log.callCount, 1);
    assert(log.calledWith('Hello world'));
  }));
});
```


[npm-badge]: https://badge.fury.io/js/sinon-mocha-test.svg
[npm-url]: https://www.npmjs.com/package/sinon-mocha-test

[circle-badge]: https://circleci.com/gh/peterjwest/sinon-mocha-test.svg?style=shield
[circle-url]: https://circleci.com/gh/peterjwest/sinon-mocha-test

[coverage-badge]: https://coveralls.io/repos/peterjwest/sinon-mocha-test/badge.svg?branch=main&service=github
[coverage-url]: https://coveralls.io/github/peterjwest/sinon-mocha-test?branch=main
