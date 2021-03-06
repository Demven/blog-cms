require ('envkey');
const fs = require('fs');
const path = require('path');

const TARGET_PATH = path.join(process.cwd(), 'src/env/index.js');

const envConfigFile = `
export const env = {
  NODE_ENV: '${process.env.NODE_ENV}',
  WWW_HOST: '${process.env.WWW_HOST}',
  CMS_HOST: '${process.env.CMS_HOST}',
  API_HOST: '${process.env.API_HOST}',
};
`;

fs.writeFileSync(TARGET_PATH, envConfigFile, error => {
  if (error) {
    console.error(error);
  }

  console.info(`Environment variables generated into src/env/index.js`);
});
