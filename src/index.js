const express = require("express");

const { ServerConfig, Logger } = require("./config");
const apiRoutes = require("./routes");
const { CRONS } = require("../src/utils/common");
const app = express();

app.use(express.json()); //Helps to parse the incoming request body as json
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);
app.use("/bookingservice/api", apiRoutes);
app.listen(ServerConfig.PORT, () => {
  console.log(`Server started at PORT: ${ServerConfig.PORT}`);
  Logger.info("Server up and running.");
  CRONS();
});
