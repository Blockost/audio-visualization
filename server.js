const path = require("path");
const express = require("express");
const app = express();

app.use("/", express.static(path.join(__dirname, "src/static")));

app.get("/", (req, res) => {
  res.sendFile("index.html", {root: 'src/static/'});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}...`);
});
