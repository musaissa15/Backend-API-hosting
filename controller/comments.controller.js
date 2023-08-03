
const {
  fetchComments,
  insertCommentsByReviewId,
  deleteTheComments,
} = require("../model/comments.model");
const { fetchReviews } = require("../model/reviews.model");


exports.returnComments = (request, response, next) => {
  const { review_id } = request.params;

  Promise.all([fetchReviews(review_id), fetchComments(review_id)])
    .then(([, review_idComments]) => {
      response.status(200).send({ review_idComments });
    })
    .catch((error) => {
      next(error);
    });
};

exports.postCommentByReviewId = (request, response, next) => {
  const { body } = request;
  const { reviews: review_id } = request.params;
  insertCommentsByReviewId(body, review_id)
    .then((returnComment) => {
      response.status(201).send({ returnComment });
    })
    .catch((error) => {
      next(error);
    });
};

exports.removedComments = (request, response, next) => {
  const { comment_id } = request.params;
  deleteTheComments(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch((error) => {
      next(error);
    });
};
