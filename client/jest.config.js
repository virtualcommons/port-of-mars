const path = require('path');

module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/tests/styleMock.ts',
    '^@port-of-mars/client/(.*)$': '<rootDir>/src/$1',
    '^@port-of-mars/shared/(.*)$': '/code/shared/$1'
  },
};
