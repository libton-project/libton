import { getFilename, getName } from './name.utils';

describe('getFileName', () => {
  it('should convert simple names', () => {
    expect(getFilename('my-lib')).toBe('my-lib');
    expect(getFilename('my.lib')).toBe('my-lib');
    expect(getFilename('myLib')).toBe('my-lib');
  });
  it('should convert scoped names', () => {
    expect(getFilename('@my-scope/my-lib')).toBe('my-scope-my-lib');
    expect(getFilename('@my-scope/my.lib')).toBe('my-scope-my-lib');
    expect(getFilename('@my-scope/myLib')).toBe('my-scope-my-lib');
  });
});

describe('getVariableName', () => {
  it('should convert simple names', () => {
    expect(getName('my-lib')).toBe('MyLib');
    expect(getName('my.lib')).toBe('MyLib');
    expect(getName('myLib')).toBe('MyLib');
  });
  it('should convert scoped names', () => {
    expect(getName('@my-scope/my-lib')).toBe('MyScopeMyLib');
    expect(getName('@my-scope/my.lib')).toBe('MyScopeMyLib');
    expect(getName('@my-scope/myLib')).toBe('MyScopeMyLib');
  });
});
