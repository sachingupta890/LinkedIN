const { Builder, By, until, Key } = require("selenium-webdriver");
const getChromeOptions = require("../config/chromeOptions");
const randomDelay = require("../services/randomDealy");
const PROXY = require("../config/scraperProxy");

const loginToLinkedIn = async (email, password, PROXY) => {
  if (!email || !password) {
    throw new Error("LinkedIn credentials are not set in the environment variables");
  }

  const options = getChromeOptions(PROXY);
  
  const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
  
  await driver.get("https://www.linkedin.com/login");
  await randomDelay();

  await driver.wait(until.elementLocated(By.id("username")), 10000);
  const usernameField = await driver.findElement(By.id("username"));
  await usernameField.sendKeys(email);
  await randomDelay();
  await driver.findElement(By.id("password")).sendKeys(password, Key.RETURN);
  await driver.wait(until.urlContains("/feed"), 40000);
  const captchaPresent = await driver.findElements(By.css("div.g-recaptcha"));
  if (captchaPresent.length > 0) {
    await pauseForCaptcha();
  }
  return driver;
};

module.exports = { loginToLinkedIn };
