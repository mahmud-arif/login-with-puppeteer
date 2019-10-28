const puppeteer = require('puppeteer');
const prompt = require('prompt'); 
const dotenv = require('dotenv');

const USERNAME_SELECTOR = '#m_login_email';
const PASSWORD_SELECTOR = 'input[type="password" i]';

dotenv.config();

let schema = {
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
}); 



async function run(username, password) {
  try {
    const browser = await puppeteer.launch({
      headless: false
    })
    const page = await browser.newPage()

    await page.goto('https://mbasic.facebook.com/', {
      waitUntil: 'networkidle2'
    })

    page.waitForSelector(USERNAME_SELECTOR)
    await page.click(USERNAME_SELECTOR, {
      visible: true
    });
    await page.keyboard.type(username);

    await page.waitForSelector(PASSWORD_SELECTOR);
    await page.click(PASSWORD_SELECTOR, {
      visible: true
    });
    await page.keyboard.type(password);

    await page.waitForSelector('input[type="submit"]'),
      await page.click('input[type="submit" i]'),
      await page.waitForNavigation({
        waitUntil: 'networkidle2'
      })

    await page.waitFor(6000);

    try {
      const text = await page.evaluate(() => {
        const selector = document.querySelector('#checkpoint_title').innerHTML;
        return selector;
      });

      if (text === 'Enter login code to continue') {
        let code = await promptData();

        await page.awitForSelector('#approvals_code');
        await page.click('#approvals_code');
        await page.keyboard.type(code);

        await page.click('input[type="submit" i]');
      }
    } catch (err) {}

    const message = await page.evaluate(() => {
      const selector = document.querySelectorAll('a')[3].innerText;
      return selector;
    });
    console.log(message);

    await browser.close()
  } catch (err) {
    console.log(err);
  }
};


const promtData = () => new Promise((resolve, reject) => {
  prompt.start();
  let code;
  prompt.get(['code'], async (err, result) => {
    resolve(result.code);
  })
})
