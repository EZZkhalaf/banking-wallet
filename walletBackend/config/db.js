const {neon} = require('@neondatabase/serverless');
const dotenv = require('dotenv/config');

const sql = neon(process.env.DATABASE_URL);
module.exports = {sql};