const express = require("express");
const { Pool } = require("pg");
const app = express();
const port = process.env.PORT;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/data", function (req, res) {
  pool.query("SELECT movie, hero FROM movie_hero", [], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ data: result.rows });
  });
});

app.listen(port, () => {
  console.log(`Backend REST API listening on port ${port}!`);
});
//
