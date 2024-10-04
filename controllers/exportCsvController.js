const fs = require("fs");
const path = require("path");
const { writeCsv } = require("../services/csvWriter");

const exportCsvHandler = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../services/leads.json");
    const data = await fs.promises.readFile(filePath, "utf-8");
    let leads = JSON.parse(data);

    console.log("Exporting CSV for leads from JSON:", leads);

    if (leads.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No leads to export" });
    }
    const csvData = await writeCsv(leads);
    res.header("Content-Type", "text/csv");
    res.attachment("leads.csv");
    res.status(200).send(csvData);
    await fs.promises.writeFile(filePath, JSON.stringify([]));
    console.log("Leads JSON file has been cleaned for new data.");
  } catch (error) {
    console.error("Error in exportCsvHandler:", error);
    res.status(500).json({ success: false, message: "Failed to export CSV" });
  }
};

module.exports = { exportCsvHandler };
