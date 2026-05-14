import coreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'dist/**', 'build/**', 'coverage/**'],
  },
  ...coreWebVitals,
  {
    rules: {
      '@next/next/no-img-element': 'error',
      'react/no-unescaped-entities': 'off',
    },
  },
];

export default config;
