const { By} = require("selenium-webdriver");
 const getLeadDetails = async (result) => {
    try {
      let name = await result.findElement(By.css(".entity-result__title-text")).getText();
      let title = await result.findElement(By.css(".entity-result__primary-subtitle")).getText();
      let location = await result.findElement(By.css(".entity-result__secondary-subtitle")).getText();
      let profileLink = await result.findElement(By.css("a.app-aware-link"));
  
      return { name, title, location, profileLink };
    } catch (err) {
      console.error("Error fetching lead details:", err);
      return null;
    }
  };
  module.exports = { getLeadDetails };