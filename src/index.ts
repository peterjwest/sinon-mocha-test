import { Context } from 'mocha';
import sinon from 'sinon';

/** Callback to be provided to sinonTest */
type Callback = (this: Context, sandbox: sinon.SinonSandbox) => Promise<void> | void;

/**
 * Helper which injects a sinon sandbox into a Mocha callback
 *
 * Usage:
 * ```
 * it('Tests the function', sinonTest((sinon) => {
 *   const logger = sinon.stub(dependency, 'logger');
 *
 *   const result = testFunction('hello');
 *
 *   assert.strictEqual(result, 5);
 *   assert.calledOnceWith(logger, ['hello']);
 * }));
 * ```
 */
function sinonTest(config: Partial<sinon.SinonSandboxConfig> | undefined, callback: Callback) {
  return async function(this: Context) {
    const sandbox = sinon.createSandbox({ ...sinon.defaultConfig, ...config });

    try {
      const result = await Promise.resolve(callback.call(this, sandbox));
      sandbox.verifyAndRestore();
      return result;
    } catch (error) {
      sandbox.restore();
      throw error;
    }
  };
}

export default Object.assign(
  sinonTest.bind(undefined, undefined),
  { create: sinonTest },
);
