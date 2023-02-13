module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: "@typescript-eslint/parser",
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "@typescript-eslint/no-empty-function": "off",
    "no-useless-constructor": "off",
    "import/prefer-default-export": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { destructuredArrayIgnorePattern: "." }],
  },
  ignorePatterns: ["node_modules/*", "lib/*", "dist/*", "fixtures/*", "src/migrations/*"],
};
