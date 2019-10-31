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
  async browserLaunch() {
    console.log('Open facebook in the browser');
    await this.page.goto('https://mbasic.facebook.com/', { waitUntil: 'networkidle2' })
  }

 //Login fb
  async login(){
    this.page.waitForSelector(USERNAME_SELECTOR)
    await this.page.click(USERNAME_SELECTOR, { visible: true });

    // Username requested
    console.log('Enter your username');
    let result = await this.promtData(['username']);
    await this.page.keyboard.type(result.username);


    await this.page.waitForSelector(PASSWORD_SELECTOR);
    await this.page.click(PASSWORD_SELECTOR, { visible: true });

    // Password requested
    console.log("Enter your password");
    result = await this.promtData([{ name: "password", hidden: true }]);
    await this.page.keyboard.type(result.password);

    // Login to Facebook
    console.log('Now login');
    await this.page.waitForSelector('input[type="submit"]'),
    await this.page.click('input[type="submit" i]'),


    await this.page.waitFor(6000);

    try {
      const text = await this.page.evaluate(() => {
        const selector = document.querySelector('#checkpoint_title').innerHTML;
        return selector;
      });

      if (text === 'Enter login code to continue') {

        // Verification code requested
        console.log(text);
        let code = await this.promtData(['code']);

        // Verification code submitted
        await this.page.waitForSelector('#approvals_code');
        await this.page.click('#approvals_code');
        await this.page.keyboard.type(code.code);
        await this.page.click('input[type="submit" i]');
        await this.page.waitFor(6000);
      }
    } catch (err) { }
  }

  // read message
  async readMessage(){
    // If login success Grab message data otherwise grab error message
    const message = await this.page.evaluate(() => {
    const selector = document.querySelectorAll('a')[3].innerText;
    return selector;
    });
    console.log(message);
  }

  async close() {
    await this.browser.close(); 
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
  await facebook.init();
  await facebook.browserLaunch();
  await facebook.login();
  await facebook.readMessage();
  await facebook.close(); 
})(); 
