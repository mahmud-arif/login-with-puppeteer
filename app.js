const prompt = require('prompt'); 
const run = require('./scraper'); 
const dotenv = require('dotenv');
dotenv.config();

var schema = {
  properties: {
      username: { 
        description: 'username',
        
      },
      password: {
        description: 'password',
        }
      }
    }

prompt.start(); 

prompt.get(schema, (err, result) => {
  const name = result.username || process.env.USERNAME; 
  const pass = result.password || process.env.PASSWORD; 
   run(name, pass); 
})