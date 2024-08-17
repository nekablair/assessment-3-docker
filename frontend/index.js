const express = require("express");

const request = require("request");

const app = express();
const port = process.env.PORT;
const restApiUrl = process.env.REST_API_URL;

app.get("/", function (req, res) {
  request(restApiUrl, { method: "GET" }, function (err, resp, body) {
    if (err) {
      console.error("Error making request:", err);
      return res.status(500).send("Error making request to backend");
    }

    if (resp.statusCode === 200) {
      var objData = JSON.parse(body);
      var data = objData.data;

      var responseString = `<html><head><title>Movie Heroes</title></head><body>`;
      responseString += `<h1>Movie Heroes</h1>`;
      responseString += `<table border='1'><tr><th>Movie</th><th>Hero</th></tr>`;

      data.forEach((item) => {
        responseString += `<tr><td>${item.movie}</td><td>${item.hero}</td></tr>`;
      });

      responseString += `</table></body></html>`;
      res.send(responseString);
    } else {
      console.error("Backend responded with error:", resp.statusCode);
      res.status(resp.statusCode).send("Backend responded with error");
    }
  });
});

app.listen(port, () => console.log(`Frontend app listening on port ${port}!`));
