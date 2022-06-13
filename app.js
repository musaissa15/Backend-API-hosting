const cors = require("cors");

const express = require("express");
const app = express();
const {
	returnReviews,
	returnUpdatedReviews,
	returnAllReviews,
} = require("./controller/reviews.controller");
const {returnCategories} = require("./controller/categories.controller");
const {getAPI} = require('./controller/api.controller')
const {
	returnComments,
	postCommentByReviewId,
	removedComments,
} = require("./controller/comments.controller");
const { returnUsers } = require("./controller/users.controller");
const {
	handleCustomErrors,
	handlePsqlErrors,
	handleServerErrrors,
} = require("./errorHandlers");

app.use(cors());

app.use(express.json());

app.get('/api', getAPI)

app.get("/api/categories", returnCategories);

app.get("/api/reviews/:review_id", returnReviews);

app.patch("/api/reviews/:review_id", returnUpdatedReviews);

app.get("/api/users", returnUsers);

app.get("/api/reviews", returnAllReviews);

app.get("/api/reviews/:review_id/comments", returnComments);

app.post("/api/reviews/:reviews/comments", postCommentByReviewId);

app.delete("/api/comments/:comment_id", removedComments);

app.all("/*", (request, response, next) => {
	response.status(404).send({ msg: "Invalid Path" });
});

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrrors);

module.exports = app;
