
const { Client } = require('pg'); 
// Connect to database
const client = new Client({
  host:'localhost',
  user:'postgres',
  port:'5432',
  password:'Duongminh410',
  database:'swallpapers',
})

client.connect();

module.exports = client;