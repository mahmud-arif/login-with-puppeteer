const promtData = require('./util');
const prompts = require('prompts');


class ReadInfo {

  // read message
  async readMessage() {
    // If login success Grab message data otherwise grab error message
    const message = await this.page.evaluate(() => {
      const selector = document.querySelectorAll('a')[3].innerText;
      return selector;
    });
    console.log(message);
  }

  async gotoPhotoAlbum() {

    //Select Menu link  and click Menu --> goto Menu Page
    const linkHandlers = await this.page.$x("//a[contains(text(), 'Menu')]");
    if (linkHandlers.length > 0) {
      await linkHandlers[0].click();
    } else {
      throw new Error("Link not found");
    }

    await this.page.waitForNavigation();

    // Select and Click Photos link ---> goto Photo Album Page
    const linkHandlers1 = await this.page.$x("//a[contains(text(), 'Photos')]");
    if (linkHandlers1.length > 0) {
      await linkHandlers1[0].click();
    } else {
      throw new Error("Link not found");
    }

    await this.page.waitForNavigation('networkidle0')


    const albumInfo = await this.page.evaluate(() => {

      const data = [];

      // Select area that contains album list
      const firstAlbum = [...document.querySelectorAll('.ci.bw.cj.ck')];
      const secondAlbum = [...document.querySelectorAll('.ci.cj.cu.ck .t')]

      // Grab and push first album list in data array
      firstAlbum.map(d => {
        data.push({
          title: `${d.childNodes[0].innerText}`.trim(),
          num: `${d.childNodes[2].innerText}`.match(/\d/g).join(""),
          anchor: d.childNodes[2].innerText,
        });
      })

      // Grab and push second album list in data array
      secondAlbum.map(d => {
        let replc = d.childNodes[1].innerText.split(' ')[1];
        data.push({
          title: `${d.childNodes[0].innerText}`.trim(),
          num: `${d.childNodes[1].innerText}`.replace(replc, ''),
          anchor: d.childNodes[0].innerText
        })
      })
      return data;
    });

    const choices = albumInfo.map(d => {
      return {
        title: `${d.title}  ${d.num}`,
        value: d.anchor
      }
    })


    const result = await prompts({
      type: 'select',
      name: 'value',
      message: 'Pick a album',
      choices: choices,
      initial: 1
    })

    const anchorText = result.value

    await this.page.waitFor(4000);


    // Select and click user selected album --> goto that single album
    let selector = 'a';
    await this.page.$$eval(selector, (anchors, anchorText) => {

      const text = anchorText.join('');
      anchors.map(anchor => {
        if (anchor.textContent == text) {
          anchor.click();
        }
      })
    }, [...anchorText])

    await this.page.waitFor(5000);
    // print newline
    console.log('\n');

  }

  async grabFbid() {

    const fbids = await this.page.evaluate(() => {

      // Select anchor that contains photo img
      let ahref = [...document.querySelectorAll('#thumbnail_area a')];
      if (ahref.length === 0) ahref = [...document.querySelectorAll('.s a')];

      const regex = /\?.*?\&/
      const fbid = [];

      // itirate throw anchor collect fbid
      ahref.map(a => {
        let d = regex.exec(a.search);
        fbid.push(d[0].split('').slice(6, d[0].length - 1).join(''));
      })
      return fbid;
    })

    // print fbids
    fbids.map(d => console.log(d));
  }


}

module.exports = ReadInfo;