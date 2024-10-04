const { Builder, By, Key, until } = require("selenium-webdriver");
 const getContactInfo = async (driver) => {
    let phoneNumber = "";
    let profileUrl = "";
    let email = "";
  
    try {
      let contactInfoButton = await driver.findElement(By.css(".ember-view.link-without-visited-state"));
      await contactInfoButton.click();
      await driver.wait(until.elementLocated(By.css(".pv-contact-info__contact-type")), 20000);
      await new Promise((resolve) => setTimeout(resolve, 6000));
  
      let profileUrlElement = await driver.findElement(By.css(".pv-contact-info__contact-type a.link-without-visited-state"));
      profileUrl = await profileUrlElement.getAttribute("href");
  
      phoneNumber = await driver.findElement(By.css("ul.list-style-none li span.t-14.t-black.t-normal")).getText().catch(() => "");
      email = await driver.findElement(By.css(".pv-contact-info__contact-type a[href^='mailto:']")).getText().catch(() => "");
  
      await driver.findElement(By.css("button.artdeco-modal__dismiss")).click();
    } catch (err) {
      console.error("Error retrieving contact information:", err);
    }
  
    return { phoneNumber, profileUrl, email };
  };
  module.exports = { getContactInfo };