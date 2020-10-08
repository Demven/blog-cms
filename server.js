require ('envkey');
const express = require('express');
const history = require('connect-history-api-fallback');

const app = express();
const staticMiddleware = express.static('dist');

app.use(staticMiddleware);
app.use(history({}));
app.use(staticMiddleware);

const PORT = global.parseInt(process.env.PORT, 10) || 8081;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
