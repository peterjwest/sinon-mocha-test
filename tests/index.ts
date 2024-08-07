import { describe, it } from 'vitest';
import Bluebird from 'bluebird';
import sinon from 'sinon';
import assert from 'assert';

import sinonTest from '../src/index';

// "You're very clever, young man, very clever, but it's turtles all the way down!"
describe('sinonTest', () => {
  it('Resolves if the callback resolves', async function() {
    await sinonTest(async () => Promise.resolve()).call(undefined);
  });

  it('Resolves if the callback returns', async function() {
    await sinonTest(() => undefined).call(undefined);
  });

  it('Rejects if the callback rejects', async function() {
    await assert.rejects(
      () => sinonTest(() => Promise.reject(new Error('Callback error'))).call(undefined),
      new Error('Callback error'),
    );
  });

  it('Rejects if the callback throws', async function() {
    await assert.rejects(
      () => sinonTest(() => {
        throw new Error('Callback error');
      }).call(undefined),
      new Error('Callback error'),
    );
  });

  it('Restores mocked dependencies once the callback has resolved', async function() {
    const originalProperty = () => true;
    const dependency = { property: originalProperty };

    const callback = async (sinon: sinon.SinonSandbox) => {
      const stub = sinon.stub(dependency, 'property');
      await Bluebird.delay(10);
      assert.strictEqual(dependency.property, stub);
    };

    await sinonTest(callback).call(undefined);
    assert.strictEqual(dependency.property, originalProperty);
  });

  it('Restores mocked dependencies once the callback has rejected', async function() {
    const originalProperty = () => true;
    const dependency = { property: originalProperty };

    const callback = async (sinon: sinon.SinonSandbox) => {
      const stub = sinon.stub(dependency, 'property');
      await Bluebird.delay(10);
      assert.strictEqual(dependency.property, stub);
      throw new Error('Callback error');
    };

    await assert.rejects(() => sinonTest(callback).call(undefined), new Error('Callback error'));
    assert.strictEqual(dependency.property, originalProperty);
  });

  it('Calls the callback with the correct context', async () => {
    const context = {};
    await sinonTest(function() {
      assert.strictEqual(this, context);
    }).call(context);
  });
});

describe('sinonTest.create', () => {
  it('Configures the sandbox as specified', async function() {
    await sinonTest.create({ useFakeTimers: false }, async () => {
      await Bluebird.delay(10);
    }).call(undefined);
  });

  it('Also resolves if the callback resolves', async function() {
    await sinonTest.create({}, async () => Promise.resolve()).call(undefined);
  });

  it('Also resolves if the callback returns', async function() {
    await sinonTest.create({}, () => undefined).call(undefined);
  });

  it('Also rejects if the callback rejects', async function() {
    await assert.rejects(
      () => sinonTest.create({}, () => Promise.reject(new Error('Callback error'))).call(undefined),
      new Error('Callback error'),
    );
  });

  it('Also rejects if the callback throws', async function() {
    await assert.rejects(
      () => sinonTest.create({}, () => {
        throw new Error('Callback error');
      }).call(undefined),
      new Error('Callback error'),
    );
  });
});
