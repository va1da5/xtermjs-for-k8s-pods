const express = require("express");
const app = express();
const env = require("./env");
const { setupSocket } = require("./socketProxy");

app.get("/", express.static("public"));
app.use("/static", express.static("public/static"));

// Start the server
const server = app.listen(env.PORT);

setupSocket(server);
