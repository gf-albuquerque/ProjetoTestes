/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  roots: ["<rootDir>/tests"],
  collectCoverageFrom: ["<rootDir>/src/**/*.js"],
  coverageProvider: "v8",
};

module.exports = config;
