const express = require("express");
const app = express();

app.get("/recipeSearch", (req, res) => {
  const { search } = req.body;
  res.send(search);
});
app.listen(4000, () => console.log("server started on 4000"));
