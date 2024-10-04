const { createObjectCsvStringifier } = require("csv-writer");

const writeCsv = async (leads) => {
  try {
    if (!leads || leads.length === 0) {
      throw new Error("No leads to export");
    }

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: "name", title: "Name" },
        { id: "title", title: "Title" },
        { id: "location", title: "Location" },
        { id: "companyName", title: "Company Name" },
        { id: "email", title: "Email" },
        { id: "phoneNumber", title: "Phone Number" },
        { id: "totalExperience", title: "Total Experience" },
        { id: "profileUrl", title: "Profile URL" },
        { id: "about", title: "About" },
      ],
    });

    const sanitizeData = (input) => {
      if (typeof input !== "string") return input;
    
      let sanitized = input;
    
      sanitized = sanitized.replace(/Â·/g, '·'); // Replace Â· with middle dot
      sanitized = sanitized.replace(/Â/g, ''); // Remove standalone Â
      sanitized = sanitized.replace(/[^\x00-\x7F]/g, ""); // Remove non-ASCII characters
      sanitized = sanitized.replace(/\./g, ' '); // Replace dots with spaces
    
      return sanitized;
    };

    const processedLeads = leads.map((lead) => {
      let companyName = "";
      if (lead.companyData && lead.companyData.length > 0) {
        companyName = lead.companyData.map(sanitizeData).join(" | ");
      }

      let totalExperience = "";
      if (lead.experienceData && lead.experienceData.length > 0) {
        totalExperience = lead.experienceData.map(sanitizeData).join(" | ");
      }

      return {
        name: sanitizeData(lead.name),
        title: sanitizeData(lead.title),
        location: sanitizeData(lead.location),
        companyName,
        email: sanitizeData(lead.email),
        phoneNumber: sanitizeData(lead.phoneNumber),
        totalExperience,
        profileUrl: sanitizeData(lead.profileUrl),
        about: sanitizeData(lead.about),
      };
    });

    const csvHeader = csvStringifier.getHeaderString();
    const csvRecords = csvStringifier.stringifyRecords(processedLeads);

    return csvHeader + csvRecords;
  } catch (error) {
    console.error("Error creating CSV:", error);
    throw new Error("Failed to write CSV file");
  }
};

module.exports = { writeCsv };
