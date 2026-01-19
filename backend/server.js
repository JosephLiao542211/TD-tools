const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
