module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  extends: ["eslint:recommended", "plugin:vue/essential", "@vue/eslint-config-typescript"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-useless-constructor": "off",
    "no-empty-function": "off",
    "import/prefer-default-export": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { destructuredArrayIgnorePattern: "^_" }],
    "vue/multi-word-component-names": "off",
  },
  ignorePatterns: [
    "node_modules/*",
    "public/*",
    "dist/*",
    "tests/*", // ignoring tests for now, should lint them if they ever exist
  ],
  overrides: [
    {
      files: ["**/__tests__/*.{j,t}s?(x)"],
      env: {
        jest: true,
      },
    },
  ],
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
