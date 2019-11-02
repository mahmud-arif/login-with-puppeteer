const prompt = require('prompt');

//helper method for prompt
async function promtData(variable) {
  return new Promise((resolve, reject) => {
    prompt.start();
    prompt.message = '';

    prompt.get(variable, async (err, result) => {
      resolve(result);
    })
  })
}

module.exports = promtData; 