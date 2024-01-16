module.exports = {
  transformIgnorePatterns: ["/node_modules/", "\\.css$"],
  testEnvironment: "jsdom",
  //   setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
  },
};
