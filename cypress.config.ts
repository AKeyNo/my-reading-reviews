import { defineConfig } from 'cypress';

export default defineConfig({
  env: {
    JULIUSCAESAR_EMAIL: 'juliuscaesar@example.com',
    JULIUSCAESAR_USERNAME: 'juliuscaesar',
    JULIUSCAESAR_PASSWORD: 'Senatus_Populusque_Romanus',
  },
  e2e: {
    baseUrl: 'http://localhost:3000/',
  },
});
