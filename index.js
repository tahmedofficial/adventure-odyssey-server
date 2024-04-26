const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: ["localhost url", "live url"] }));
app.use(express.json());

console.log(process.env.S3_BUCKET);





app.get("/", (req, res) => {
    res.send("Tourism Management Server is Running")
})

app.listen(port, () => {
    console.log("Tourism Server Running on", port);
})