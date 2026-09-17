/** Configuration Jest légère, dédiée aux tests du moteur de calcul
 * (src/engine), qui est du TypeScript pur sans dépendance React Native. */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/engine/**/__tests__/**/*.test.ts'],
};
