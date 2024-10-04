const express = require("express");
const { scrapeHandler } = require("../controllers/scraperController");
const {exportCsvHandler} = require("../controllers/exportCsvController");

const router = express.Router();

router.post("/scrape", scrapeHandler);
router.get("/exportCsv", exportCsvHandler);

module.exports = router;
