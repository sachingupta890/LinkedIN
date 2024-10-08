const {scrapeLinkedIn} = require("../services/linkedInScraper");
const fs = require('fs');
const path = require('path');

const ipDataFilePath = path.join(__dirname, 'ipRequestCounts.json');

const loadIPRequestCounts = () => {
  if (fs.existsSync(ipDataFilePath)) {
    const data = fs.readFileSync(ipDataFilePath, 'utf8');
    return JSON.parse(data);
  }
  return {};
};

const saveIPRequestCounts = (ipRequestCounts) => {
  fs.writeFileSync(ipDataFilePath, JSON.stringify(ipRequestCounts, null, 2), 'utf8');
};

let ipRequestCounts = loadIPRequestCounts();

const maxRequestsPerDay = 5;
const resetTime = 24 * 60 * 60 * 1000;

setInterval(() => {
  ipRequestCounts = {};
  saveIPRequestCounts(ipRequestCounts);
  console.log("IP request limits have been reset.");
}, resetTime);

const scrapeHandler = async (req, res) => {
  const { url } = req.body;
  const ipAddress = req.ip;

  console.log("url is ", url);
  console.log("ipAddress is ", ipAddress);
  
  if (!url) {
    return res.status(400).send("URL is required.");
  }

  if (!ipRequestCounts[ipAddress]) {
    ipRequestCounts[ipAddress] = 0;
  }

  if (ipRequestCounts[ipAddress] >= maxRequestsPerDay) {
    return res.status(429).json({ error: "Daily request limit exceeded." });
  }

  try {
    
    ipRequestCounts[ipAddress]++;
    saveIPRequestCounts(ipRequestCounts);
    
    const leads = await scrapeLinkedIn(url);
    console.log("Scraping result:", leads);
    res.json({ message: "Scraping completed", leads });


  } catch (error) {
    res.status(500).json({ error: "Failed to scrape" ,error});
  }
};

module.exports = { scrapeHandler };
