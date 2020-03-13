module.exports = {
  preset: "ts-jest",
  roots: [
    "<rootDir>/src",
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  moduleNameMapper: {
    '^@port-of-mars/server/(.*)$': '<rootDir>/src/$1',
    '^@port-of-mars/shared/(.*)$': '<rootDir>/../shared/src/$1'
  },
};
