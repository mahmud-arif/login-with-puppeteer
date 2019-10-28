const prompt = require('prompt'); 

const promtData = () => {
  return new Promise((resolve, reject) => {
        prompt.start();
        let code;
        prompt.get(['code'], async (err, result) => {
          resolve(result.code);
        })
    
  })
} 

module.exports = promtData;