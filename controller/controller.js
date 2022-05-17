const { response } = require("../app");
const { fetchCategories, fetchReviews } = require("../model/model");

exports.returnCategories = (request, response, next) => {
  fetchCategories()
    .then((categories) => {
      response.status(200).send({ categories });
    })
    .catch((error) => {
      
      next(error);
    });
};

exports.returnReviews = (request, response, next) => {
  const { review_id } = request.params;
  fetchReviews(review_id)
    .then((review) => {
        response.status(200).send({review});
        
    })
    .catch((error) => {
      next(error);
      
    });
};
