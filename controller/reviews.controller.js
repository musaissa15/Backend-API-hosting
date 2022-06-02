const {
  fetchReviews,
  updateReviews,
  fetchAllReviews,
} = require("../model/reviews.model");

exports.returnReviews = (request, response, next) => {
  const { review_id } = request.params;
  fetchReviews(review_id)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch((error) => {
      next(error);
    });
};

exports.returnUpdatedReviews = (request, response, next) => {
  const { review_id } = request.params;
  const { inc_votes } = request.body;
  updateReviews(review_id, inc_votes)
    .then((newReview) => {
      response.status(200).send({ review: newReview });
    })
    .catch((error) => {
      next(error);
    });
};

exports.returnAllReviews = (request, response, next) => {
  const {sort_by} = request.query
  fetchAllReviews(sort_by)
		.then((reviews) => {
			response.status(200).send({ reviews });
		})
		.catch((error) => {
			next(error);
		});
};
