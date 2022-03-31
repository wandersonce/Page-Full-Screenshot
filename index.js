const webView = require('./webView.js');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

(async () => {
  readline.question('Which website you want to go?', async (website) => {
    readline.question(
      'Please write your screenshot name?',
      async (fileName) => {
        console.log(`You will be redirect to ${website}!`);
        await webView.initialize(website, fileName);
        readline.close();
      }
    );
  });

  // debugger;
})();
