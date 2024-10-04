const express = require("express");
const cors = require("cors");
require("./config/dotenvConfig");

const routes = require("./routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", routes);

const PORT = process.env.PORT || 9033;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
