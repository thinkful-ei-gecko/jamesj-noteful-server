require('dotenv').config();

module.exports = {
  'driver': 'pg',
  'migrationDirectory': 'migrations',
  'connectionString': process.env.NODE_ENV === 'test' ? process.env.TEST_DB_URL : process.env.DB_URL
};