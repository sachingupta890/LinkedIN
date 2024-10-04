const pauseForCaptcha = async () => {
    console.log(
      "Please solve the CAPTCHA manually and then press Enter to continue..."
    );
    await new Promise((resolve) => process.stdin.once("data", resolve));
  };
  
  module.exports = pauseForCaptcha;
  