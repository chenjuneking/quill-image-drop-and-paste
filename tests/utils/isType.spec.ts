import utils from '../../src/utils';

declare const expect: jest.Expect;

const exec = (target: any, type: string): void => {
  expect(utils.isType(target, type)).toBe(true);
};

describe('utils#isType(target: any, type: string)', () => {
  test('isType: Object', () => {
    exec({}, 'Object');
  });
  test('isType: Array', () => {
    exec([], 'Array');
  });
  test('isType: Function', () => {
    exec(() => ({}), 'Function');
  });
  test('isType: Undefined', () => {
    exec(undefined, 'Undefined');
  });
  test('isType: Null', () => {
    exec(null, 'Null');
  });
  test('isType: String', () => {
    exec('', 'String');
  });
  test('isType: Number', () => {
    exec(1, 'Number');
  });
  test('isType: Boolean', () => {
    exec(false, 'Boolean');
  });
  test('isType: Symbol', () => {
    exec(Symbol(), 'Symbol');
  });
  test('isType: Blob', () => {
    exec(new Blob(['foo'], { type: 'text/plain' }), 'Blob');
  });
  test('isType: File', () => {
    exec(new File(['foo'], 'foo.txt', { type: 'text/plain' }), 'File');
  });
});
