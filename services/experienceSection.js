 const extractExperience = async (driver, sectionIndex) => {
    let experienceData = [];
    let experienceItems = await driver.findElements(
      By.xpath(`//*[@id="profile-content"]/div/div[2]/div/div/main/section[${sectionIndex}]/div[3]/ul/li`)
    );
  
    for (let i = 0; i < experienceItems.length; i++) {
      let companyName = await experienceItems[i].findElement(By.xpath(`.//span[1]`)).getText().catch(() => "");
      let totalExperience = await experienceItems[i].findElement(By.xpath(`.//span[2]`)).getText().catch(() => "");
  
      experienceData.push({ companyName, totalExperience });
    }
  
    return experienceData;
  };
  module.exports = { extractExperience };