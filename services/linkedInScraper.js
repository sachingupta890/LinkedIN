const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");
const getChromeOptions = require("../config/chromeOptions");
const randomDelay = require("./randomDealy");
const pauseForCaptcha = require("./captchaHandler");
const PROXY = require("../config/scraperProxy");

const scrapeLinkedIn = async (url) => {
  console.log("start main",url)
  const leads = [];
  const options = getChromeOptions(PROXY);
  console.log("check chrome", options)
  let driver = await new Builder()
    .forBrowser("chrome")

    .build();
  
  console.log("Dtiver .....",driver)
  try {
    const email = process.env.LINKEDIN_EMAIL;
    const password = process.env.LINKEDIN_PASSWORD;
    console.log("Email check" , email);
    console.log("pass check" , password);
    if (!email || !password) {
      throw new Error(
        "LinkedIn credentials are not set in the environment variables"
      );
    }
    await driver.get("https://www.linkedin.com/login");
    await randomDelay();
    await driver.findElement(By.id("username")).sendKeys(email);
    await randomDelay();
    await driver.findElement(By.id("password")).sendKeys(password, Key.RETURN);
    await driver.wait(until.urlContains("/feed"), 40000);
    await randomDelay();
    let captchaPresent = await driver.findElements(By.css("div.g-recaptcha"));
    if (captchaPresent.length > 0) {
      await pauseForCaptcha();
    }
    await driver.get(url);
    await driver.wait(
      until.elementLocated(By.css(".reusable-search__result-container")),
      50000
    );
    await randomDelay();
    let userCount = 0;
    // // let count = await driver.findElement(
    // //   By.xpath(`/html/body/div[5]/div[3]/div[2]/div/div[1]/main/div/div/div[1]`)
    // // );
    // let str = await count.getText();
    // const match = str.match(/\d+/);
    const desiredUserCount = 50;

    let currentPage = 1;
    while (userCount < desiredUserCount) {
      let results = await driver.findElements(
        By.css(".reusable-search__result-container")
      );
      await randomDelay();
      for (let i = 0; i < results.length; i++) {
        if (userCount >= desiredUserCount) break;
        let upsellElement = await results[i].findElements(
          By.css(".text-heading-medium.card-upsell-v2__headline")
        );

        if (upsellElement.length > 0) {
          await upsellElement[0].getText();
          continue;
        }
        let result = results[i];
        console.log("after resile",result)
        try {
          let name = await result
            .findElement(By.css(".entity-result__title-text"))
            .getText();
            console.log("after login name",name)
          await randomDelay();
          let title = await result
            .findElement(By.css(".entity-result__primary-subtitle"))
            .getText();
          await randomDelay();
          let location = await result
            .findElement(By.css(".entity-result__secondary-subtitle"))
            .getText();
          await randomDelay();
          let profileLink = await result.findElement(
            By.css("a.app-aware-link")
          );
          if(name != "LinkedIn Member"){
          await profileLink.click();
          await driver.wait(until.urlContains("/in/"), 9000);
          await randomDelay();
          let phoneNumber = "";
          let profileUrl = "";
          let email = "";
          try {
            let contactInfoButton = await driver.findElement(
              By.css(
                ".ember-view.link-without-visited-state.cursor-pointer.text-heading-small.inline-block.break-words"
              )
            );
            await contactInfoButton.click();
            await driver.wait(
              until.elementLocated(By.css(".pv-contact-info__contact-type")),
              20000
            );
            await new Promise((resolve) => setTimeout(resolve, 6000));
            let profileUrlElement = await driver.findElement(
              By.css(
                ".pv-contact-info__contact-type a.link-without-visited-state"
              )
            );
            profileUrl = await profileUrlElement.getAttribute("href");

            try {
              let phoneNumberElement = await driver.findElement(
                By.css("ul.list-style-none li span.t-14.t-black.t-normal")
              );
              phoneNumber = await phoneNumberElement.getText();
            } catch (err) {
              console.log("Phone number not found.");
            }
            try {
              let emailElement = await driver.findElement(
                By.css(".pv-contact-info__contact-type a[href^='mailto:']")
              );
              email = await emailElement.getText();
            } catch (err) {
              console.log("Email not found.");
            }
            await driver
              .findElement(By.css("button.artdeco-modal__dismiss"))
              .click();
            await driver.wait(until.stalenessOf(profileUrlElement), 10000);
          
          } catch (err) {
            console.error("Failed to retrieve contact info or profile URL.");
          }

          for (let j = 0; j < 1; j++) {
            await driver.executeScript("window.scrollBy(0, 500);");
            await randomDelay(1000, 2000);
            await driver.executeScript("window.scrollBy(0, -500);");
            await randomDelay(1000, 2000);
          }

          let experienceSectionFound = false;
          let maxScrollAttempts = 4;
          let currentScrollAttempts = 0;

          while (
            !experienceSectionFound &&
            currentScrollAttempts < maxScrollAttempts
          ) {
            try {
              await driver.executeScript("window.scrollBy(0, 500);");
              await randomDelay(1000, 2000);

              await driver.findElement(
                By.xpath(
                  `//h2[contains(@class,"pvs-header__title")]//span[contains(text(),"Experience")])[1]`
                
              ));
              experienceSectionFound = true;
            } catch (err) {
              currentScrollAttempts++;
              console.log(
                "Experience section not found, continuing to scroll..."
              );
            }
          }

          let companyName = "Not Found";
          let companyData = [];
          let totalExperience = "Not Found";
          let experienceData = [];
          let aggregatedExperience = "";
          let about = "Not found";

          for (let i = 2; i <= 5; i++) {
            try {
              await new Promise((resolve) => setTimeout(resolve, 9000));
              let section = await driver.findElement(
                By.xpath(
                `  //*[@id="profile-content"]/div/div[2]/div/div/main/section[${i}]`
                )
              );
              let dd = await section.getText();
              let firstWord = dd.split(/\s+/)[0];
              if ("About" === firstWord) {
                try {
                  let aboutSectionElement = await driver.findElement(
                    By.xpath(
                     ` //*[@id="profile-content"]/div/div[2]/div/div/main/section[${i}]/div[3]/div/div/div/span[1]`
                    )
                  );
                  about = await aboutSectionElement.getText();
                } catch (error) {
                  console.error(
                    "Error finding or extracting About section:",
                    error
                  );
                }

                break;
              }
            } catch (error) {
              console.error(
                "Error finding or extracting company name or experience:",
                error
              );
            }
          }

          for (let i = 2; i <= 5; i++) {
            try {
              await new Promise((resolve) => setTimeout(resolve, 9000));

              let section = await driver.findElement(
                By.xpath(
               `//*[@id="profile-content"]/div/div[2]/div/div/main/section[${i}]`
                )
              );

              let dd = await section.getText();
              let firstWord = dd.split(/\s+/)[0];

              if ("Experience" === firstWord) {
                try {
                  let experienceItems = await driver.findElements(
                    By.xpath(
                      `//*[@id="profile-content"]/div/div[2]/div/div/main/section[${i}]/div[3]/ul/li`
                    )
                  );

                  if (experienceItems.length === 0) {
                    continue;
                  }

                  for (let j = 1; j <= experienceItems.length; j++) {
                    let lilength = await driver.findElement(
                      By.xpath(
                        `//*[@id="profile-content"]/div/div[2]/div/div/main/section[${i}]/div[3]/ul/li[${j}]`
                      )
                    );

                    let companyNamePart1Element = await lilength.findElements(
                      By.xpath(
                        `//*[@id="profile-content"]/div/div[2]/div/div/main/section[${i}]/div[3]/ul/li[${j}]/div/div[2]/div[1]/a/div/div/div/div/span[1]`
                      )
                    );
                    let companyNamePart1 =
                      companyNamePart1Element.length > 0
                        ? await companyNamePart1Element[0].getText()
                        : "";

                    let companyNamePart2Element = await lilength.findElements(
                      By.xpath(`//*[@id="profile-content"]/div/div[2]/div/div/main/section[${i}]/div[3]/ul/li[${j}]/div/div[2]/div[1]/div/span[1]/span[1]`
                    ));
                    let companyNamePart2 =
                      companyNamePart2Element.length > 0
                        ? await companyNamePart2Element[0].getText()
                        : "";

                    let company3Element = await lilength.findElements(
                      By.xpath(`//div/div[2]/div[1]/a/div/div/div/div/span[1]`
                    ));
                    let company3 =
                      company3Element.length > 0
                        ? await company3Element[0].getText()
                        : "";

                    companyName =
                    `${companyNamePart1} ${companyNamePart2} ${company3}`.trim();
                    console.log("company name",companyName)

                    companyData.push(companyName);

                    let totalExperienceElement = await lilength.findElements(
                      By.xpath(`//*[@id="profile-content"]/div/div[2]/div/div/main/section[${i}]/div[3]/ul/li[${j}]/div/div[2]/div[1]/a/span[1]/span[1]`
                    ));
                    let ex1 =
                      totalExperienceElement.length > 0
                        ? await totalExperienceElement[0].getText()
                        : "";

                    let totalExperienceElement1 = await lilength.findElements(
                      By.xpath(`//*[@id="profile-content"]/div/div[2]/div/div/main/section[${i}]/div[3]/ul/li[${j}]/div/div[2]/div[1]/div/span[2]/span[1]`
                    ));
                    let ex2 =
                      totalExperienceElement1.length > 0
                        ? await totalExperienceElement1[0].getText()
                        : "";

                        let totalExperience = `${ex1} ${ex2}`.trim();

                    experienceData.push(totalExperience);

                    if (experienceData.length > 0) {
                      function experienceToMonths(experienceString) {
                        const durationMatch = experienceString.match(
                          /(\d+)\s*(yr|yrs|mons|mo)/gi
                        );
                        if (!durationMatch) return 0;

                        let totalMonths = 0;

                        durationMatch.forEach((match) => {
                          const parts = match.match(
                            /(\d+)\s*(yr|yrs|mons|mo)/i
                          );
                          if (parts) {
                            const value = parseInt(parts[1], 10);
                            const unit = parts[2].toLowerCase();
                            totalMonths +=
                              unit === "yr" || unit === "yrs"
                                ? value * 12
                                : value;
                          }
                        });

                        return totalMonths;
                      }

                      function aggregateExperience(experienceArray) {
                        let totalMonths = 0;

                        for (const exp of experienceArray) {
                          const durationPart = exp.split("·").pop().trim();
                          totalMonths += experienceToMonths(durationPart);
                        }

                        const years = Math.floor(totalMonths / 12);
                        const months = totalMonths % 12;

                        let experienceString = "";
                        if (years > 0) {
                          experienceString += `${years}yr `;
                        }
                        if (months > 0) {
                          experienceString += `${months}mons`;
                        }
                        

                        return experienceString.trim();
                      }

                      aggregatedExperience =
                        aggregateExperience(experienceData);

                      console.log("Total Experience:", aggregatedExperience);
                    }
                  }const totalExperienceString = `Total Experience: ${aggregatedExperience}`;

                  experienceData.push(totalExperienceString);
                } catch (error) {
                  console.error(
                    "Error finding or extracting company name or experience:",
                    error
                  );
                }

                break;
              }
            } catch (error) {
              console.error(`Error in section ${i}:`, error);

            }
          }

          leads.push({
            name,
            title,
            location,
            companyData,
            email,
            phoneNumber,
            experienceData,
            profileUrl,
            about,
          });
          userCount++;
          console.log("ffff",userCount)
          

          for (let j = 0; j < 3; j++) {
            await driver.navigate().back();
            await driver.findElements(
              By.css(".reusable-search__result-container")
            );
            await randomDelay();
          }
          results = await driver.findElements(
            By.css(".reusable-search__result-container")
          );
        }
       } catch (err) {
        console.error(`Error scraping profile: ${err}`);

          await driver.navigate().back();
          results = await driver.findElements(
            By.css(".reusable-search__result-container")
          );
        }
      }
      await driver.executeScript(
        "window.scrollTo(0, document.body.scrollHeight);"
      );
      await new Promise((resolve) => setTimeout(resolve, 8000));
      await randomDelay(8000, 9000);
      try {
        let nextButton = await driver.findElement(
          By.css("button.artdeco-pagination__button--next")
        );
        await nextButton.click();
      } catch (err) {
        console.log("No more pages available or pagination button not found.");
        break;
      }
      await driver.wait(
        until.elementLocated(By.css(".reusable-search__result-container")),
        10000
      );
      currentPage++;
    }

    const filePath = path.join(__dirname, "leads.json");
    fs.writeFileSync(filePath, JSON.stringify(leads, null, 2));
    return leads;
  } 
  catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await driver.quit();
  }
}

;

module.exports = { scrapeLinkedIn };
  