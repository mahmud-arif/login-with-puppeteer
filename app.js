const puppeteer = require('puppeteer');
const prompt = require('prompt'); 

const USERNAME_SELECTOR = '#m_login_email';
const PASSWORD_SELECTOR = 'input[type="password" i]';

try {
  run(); 
} catch (err) {console.log(err); }


async function run() {
    const browser = await puppeteer.launch({
      headless: false
    })
    const page = await browser.newPage()

    await page.goto('https://mbasic.facebook.com/', {
      waitUntil: 'networkidle2'
    })

    page.waitForSelector(USERNAME_SELECTOR)
    await page.click(USERNAME_SELECTOR, {visible: true});
     
    // Username requested
    let result = await promtData(['username']);
    await page.keyboard.type(result.username);
    
    
    await page.waitForSelector(PASSWORD_SELECTOR);
    await page.click(PASSWORD_SELECTOR, { visible: true });
  
     // Password requested
    result = await promtData([{name: "password", hidden: true}]);
    await page.keyboard.type(result.password);
  
     // Login to Facebook
    await page.waitForSelector('input[type="submit"]'),
    await page.click('input[type="submit" i]'),
      

    await page.waitFor(6000);

    try {
        const text = await page.evaluate(() => {
        const selector = document.querySelector('#checkpoint_title').innerHTML;
        return selector;
      });

      if (text === 'Enter login code to continue') {

        // Verification code requested
        let code = await promtData(['code']);

        // Verification code submitted
        await page.waitForSelector('#approvals_code');
        await page.click('#approvals_code');
        await page.keyboard.type(code.code);
        await page.click('input[type="submit" i]');
        await page.waitFor(6000); 
      }
    } catch (err) { }
     
    // If login success Grab message data otherwise grab error message
    const message = await page.evaluate(() => {
      const selector = document.querySelectorAll('a')[3].innerText;
      return selector;
    });
    console.log(message);

    await browser.close()
  }


const promtData = (variable) => new Promise((resolve, reject) => {
  prompt.start();
  prompt.message = ''; 
  
  prompt.get(variable, async (err, result) => {
    resolve(result);
  })
})
