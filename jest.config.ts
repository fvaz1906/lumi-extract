import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', // Utiliza o ts-jest como preset
  testEnvironment: 'node', // Define o ambiente de testes como Node.js
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['<rootDir>/src/05 - Tests/**/*.test.ts'], // Define os padrões para os arquivos de teste na pasta 05 - Tests
  clearMocks: true, // Limpa os mocks após cada teste
  collectCoverage: true, // Coleta cobertura de código
  collectCoverageFrom: ['src/**/*.ts'], // Define os arquivos para cobertura de código na pasta src
  coverageDirectory: 'coverage', // Diretório para relatórios de cobertura
  verbose: true, // Habilita a saída detalhada dos testes
};

export default config;
