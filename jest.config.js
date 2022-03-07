module.exports = {
  preset: 'ts-jest',
  rootDir: 'src',
  moduleDirectories: ['node_modules', '.'],
  coverageDirectory: '../coverage',
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/node_modules/**'],
}
