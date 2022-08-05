module.exports = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  verbose: true,
  testTimeout: 30000,
  // custom test regex 
  testRegex: "(/__tests__/.*(\\.|/)(test|spec))\\.tsx?$",
};
