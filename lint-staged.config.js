export default {
  '*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix'],
  '{!(package)*.json,.!(browserslist)*rc}': ['prettier --write--parser json'],
  'package.json': ['prettier --write'],
  '*.vue': ['prettier --write', 'eslint --fix'],
  '*.{css,scss,postcss,less}': ['prettier --write'],
  '*.md': ['prettier --write']
}
