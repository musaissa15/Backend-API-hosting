const express = require("express");
const {
  returnCategories,
  returnReviews,
  returnUpdatedReviews,
} = require("./controller/controller");
const app = express();

app.use(express.json());

app.get("/api/categories", returnCategories);

app.get("/api/reviews/:review_id", returnReviews);

app.patch("/api/reviews/:review_id", returnUpdatedReviews);

app.all("/*", (request, response, next) => {
  response.status(404).send({ msg: "Invalid Path" });
});

app.use((error, request, response, next) => {
  if (error.status && error.msg) {
    response.status(error.status).send({ msg: error.msg });
  } else if (error.code === "22P02") {
    response.status(400).send({msg: "Invalid input"});
   }
  else next(error);
});

app.use((error, request, response, next) => {
	if (error.code === "23502") {
		response.status(400).send({ msg: "Nothing inputed" });
	} else {
		next(error);
	}
});

app.use((error, request, response, next) => {
  response.status(500).send("Server Error!");
});

module.exports = app;
