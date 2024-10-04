const fs = require('fs');

 const saveUserCount = (count) => {
    fs.writeFileSync("userCount.txt", count.toString());
  };
  
  const loadUserCount = () => {
    if (fs.existsSync("userCount.txt")) {
      return parseInt(fs.readFileSync("userCount.txt", "utf-8"), 10);
    }
    return 0;
  };
  module.exports = { saveUserCount,loadUserCount };