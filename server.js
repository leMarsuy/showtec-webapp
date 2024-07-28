const express = require("express");
const path = require("path");
const http = require("http");

const APP_NAME = "showtec-webapp";
const PORT = "80";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(__dirname + `/dist/${APP_NAME}`));
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, `/dist/${APP_NAME}/index.html`));
});

app.set("port", PORT);
const server = http.createServer(app);
server.listen(PORT, () => console.log(`API running on localhost:${PORT}`));
