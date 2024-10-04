 const extractAboutSection = async (driver, sectionIndex) => {
    try {
      let aboutSectionElement = await driver.findElement(
        By.xpath(`//*[@id="profile-content"]/div/div[2]/div/div/main/section[${sectionIndex}]/div[3]/div/div/div/span[1]`)
      );
      return await aboutSectionElement.getText();
    } catch (error) {
      console.error("Error extracting 'About' section:", error);
      return "Not found";
    }
  };
  module.exports = { extractAboutSection };