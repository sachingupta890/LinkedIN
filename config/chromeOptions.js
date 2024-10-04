const chrome = require("selenium-webdriver/chrome");
const proxy = require("selenium-webdriver/proxy");

const getChromeOptions = (PROXY) => {
  const options = new chrome.Options();
  
  options.addArguments("--start-maximized");
  
  if (PROXY && PROXY.trim() !== "") {
    options.setProxy(
      proxy.manual({
        http: PROXY,
        https: PROXY,
      })
    );
  }
  
  options.addArguments("--disable-gpu");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");

  return options;
};

module.exports = getChromeOptions;
