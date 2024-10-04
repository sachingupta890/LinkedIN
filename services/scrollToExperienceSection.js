const randomDelay = require("./randomDealy");
const { Builder, By, Key, until } = require("selenium-webdriver");

 const scrollToExperienceSection = async (driver) => {
    let experienceSectionFound = false;
    let maxScrollAttempts = 4;
    let currentScrollAttempts = 0;
  
    while (!experienceSectionFound && currentScrollAttempts < maxScrollAttempts) {
      try {
        await driver.executeScript("window.scrollBy(0, 500);");
        await randomDelay(1000, 2000);
        await driver.findElement(By.xpath(`//h2[contains(text(), "Experience")]`));
        experienceSectionFound = true;
      } catch (err) {
        currentScrollAttempts++;
        console.log("Experience section not found, scrolling further...");
      }
    }
  
    return experienceSectionFound;
  };
  module.exports = { scrollToExperienceSection };