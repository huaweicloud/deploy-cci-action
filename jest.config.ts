module.exports = {
  clearMocks: true,
  restoreMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  testMatch: ['**/*test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  verbose: true
}
