const puppeteer = require('puppeteer');
const prompt = require('prompt'); 

const USERNAME_SELECTOR = '#m_login_email';
const PASSWORD_SELECTOR = 'input[type="password" i]';


class FbLogin {

  async init() {
     this.browser = await puppeteer.launch({ headless: false });
     this.page = await this.browser.newPage()
     return this
  }

// create browser instance --> open a tab --> goto fb
  async browserLaunch(page) {
    console.log('Open facebook in the browser');
    await page.goto('https://mbasic.facebook.com/', { waitUntil: 'networkidle2' })
  }

 //Login fb
  async login(page){
    page.waitForSelector(USERNAME_SELECTOR)
    await page.click(USERNAME_SELECTOR, { visible: true });

    // Username requested
    console.log('Enter your username');
    let result = await this.promtData(['username']);
    await page.keyboard.type(result.username);


    await page.waitForSelector(PASSWORD_SELECTOR);
    await page.click(PASSWORD_SELECTOR, { visible: true });

    // Password requested
    console.log("Enter your password");
    result = await this.promtData([{ name: "password", hidden: true }]);
    await page.keyboard.type(result.password);

    // Login to Facebook
    console.log('Now login');
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
        console.log(text);
        let code = await this.promtData(['code']);

        // Verification code submitted
        await page.waitForSelector('#approvals_code');
        await page.click('#approvals_code');
        await page.keyboard.type(code.code);
        await page.click('input[type="submit" i]');
        await page.waitFor(6000);
      }
    } catch (err) { }
  }

  // read message
  async readMessage(page, browser){
    // If login success Grab message data otherwise grab error message
    const message = await page.evaluate(() => {
    const selector = document.querySelectorAll('a')[3].innerText;
    return selector;
    });
    console.log(message);
  }

  async close(browser) {
    await browser.close(); 
  }

  //helper method for prompt
  async promtData(variable) {
    return new Promise((resolve, reject) => {
      prompt.start();
      prompt.message = '';

      prompt.get(variable, async (err, result) => {
        resolve(result);
      })
    })
  }

}
(async () => {
  const facebook = new FbLogin();
  const pointer =await facebook.init();
  await facebook.browserLaunch(pointer.page);
  await facebook.login(pointer.page);
  await facebook.readMessage(pointer.page);
  await facebook.close(pointer.browser); 
})(); 
