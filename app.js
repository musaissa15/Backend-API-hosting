const express = require("express");
const {
  returnCategories,
  returnReviews,
  returnUpdatedReviews,
  returnUsers,
  returnAllReviews, returnComments
} = require("./controller/controller");
const app = express();

app.use(express.json());

app.get("/api/categories", returnCategories);

app.get("/api/reviews/:review_id", returnReviews);

app.patch("/api/reviews/:review_id", returnUpdatedReviews);

app.get("/api/users", returnUsers);

app.get("/api/reviews", returnAllReviews);

app.get("/api/reviews/:review_id/comments", returnComments)

app.all("/*", (request, response, next) => {
  response.status(404).send({msg: "Invalid Path"});
  
});

app.use((error, request, response, next) => {
  if (error.status && error.msg) {
    response.status(error.status).send({ msg: error.msg });
  } else next(error);
});

app.use((error, request, response, next) => {
  if (error.code === "23502" || error.code === "22P02") {
    response.status(400).send({ msg: "Bad Request" });
  } else {
    next(error);
  }
});

app.use((error, request, response, next) => {
  console.log(error, 'Uncaught Error')
  response.status(500).send("Server Error!");
});

module.exports = app;
