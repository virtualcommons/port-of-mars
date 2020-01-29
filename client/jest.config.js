const path = require('path');

module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/tests/styleMock.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^shared/(.*)$': '/code/shared/$1'
  },
};
