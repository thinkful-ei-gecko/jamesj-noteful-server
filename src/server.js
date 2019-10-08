const app = require('./app');
const { PORT } = require('./config');
const knex = require('knex');

const db = knex({
  'client': 'pg',
  'connection': process.env.DB_URL
});

app.use('db', db);

app.listen(PORT, () => {
  console.log(`Now listening on  http://localhost:${PORT} ...`);
});