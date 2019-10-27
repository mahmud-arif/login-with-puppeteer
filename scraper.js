const puppeteer = require('puppeteer');
const USERNAME_SELECTOR = '#usr';
const PASSWORD_SELECTOR = '#pwd';


async function run (username, password) {
  try{ 
      const browser = await puppeteer.launch({ headless: false })
      const page = await browser.newPage()
      
        await page.goto('http://testing-ground.scraping.pro/login', {
          waitUntil: 'networkidle2'
        })
    
        page.waitForSelector(USERNAME_SELECTOR)
        await page.click(USERNAME_SELECTOR,{visible: true});
        await page.keyboard.type(username);
    
        await page.waitForSelector(PASSWORD_SELECTOR); 
        await page.click(PASSWORD_SELECTOR, {visible: true});
        await page.keyboard.type(password);

        await page.waitForSelector('input[type="submit"]')
        await page.click('input[type="submit"]');
        await page.waitFor(1000);
    

        const text = await page.evaluate(() => {
                     const selector = document.querySelector('#case_login > h3').innerText;
                     return selector;
        }); 
    
        if (text === 'ACCESS DENIED!') console.log('LogIn failed');
        else console.log('login success'); 

        await page.screenshot({
            path: './screenshots/page1.png', 
            fullPage: true
            })
      
       await browser.close()
    

    } catch (err) {console.log(err); }
  
}; 


module.exports = run; 