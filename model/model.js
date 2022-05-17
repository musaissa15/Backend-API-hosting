const db = require("../db/connection");
const reviews = require("../db/data/test-data/reviews");

exports.fetchCategories = () => {
  return db.query("SELECT * FROM categories").then((results) => {
    return results.rows;
  });
};

exports.fetchReviews = (review_id) => {
  return db
		.query("SELECT * FROM reviews WHERE review_id = $1", [review_id])
		.then((results) => {
			const pickedReview = results.rows[0];
			if (!pickedReview) {
				return Promise.reject({
					status: 404,
                    msg: "Not Found",
				}); 
			} 
			return pickedReview;
        })
};
