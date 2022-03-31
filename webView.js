const puppeteer = require('puppeteer');

const webView = {
  browser: null,
  page: null,

  // Initialinzing the browser and going to the page
  initialize: async (website, fileName) => {
    webView.browser = await puppeteer.launch({
      product: 'firefox',
      headless: true,
    });

    webView.page = await webView.browser.newPage();

    webView.page.setViewport({
      width: 1080,
      height: 800,
    });

    await webView.page.goto('https://' + website, {
      timeout: 30000,
      waitUntil: 'load',
    });

    //Check until the page be fully loaded
    await waitTillHTMLRendered(webView.page);

    //Scroll the page
    await autoScroll(webView.page);

    //take the screenshot of the full page
    await webView.page.screenshot({ path: fileName + '.png', fullPage: true });

    console.log('Screenshot!');

    await webView.browser.close();
  },
};

//This function will check if the page is fully loaded
const waitTillHTMLRendered = async (page, timeout = 30000) => {
  const checkDurationMsecs = 1000;
  const maxChecks = timeout / checkDurationMsecs;
  let lastHTMLSize = 0;
  let checkCounts = 1;
  let countStableSizeIterations = 0;
  const minStableSizeIterations = 3;

  while (checkCounts++ <= maxChecks) {
    let html = await page.content();
    let currentHTMLSize = html.length;

    let bodyHTMLSize = await page.evaluate(
      () => document.body.innerHTML.length
    );

    console.log(
      'last: ',
      lastHTMLSize,
      ' <> curr: ',
      currentHTMLSize,
      ' body html size: ',
      bodyHTMLSize
    );

    if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize)
      countStableSizeIterations++;
    else countStableSizeIterations = 0; //reset the counter

    if (countStableSizeIterations >= minStableSizeIterations) {
      console.log('Page rendered fully..');
      break;
    }

    lastHTMLSize = currentHTMLSize;
    await page.waitFor(checkDurationMsecs);
  }
};

// This function is to scroll the page until the end
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
  console.log('Scrolled fully!');
}

module.exports = webView;
