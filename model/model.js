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
    });
};

exports.updateReviews = (review_id, inc_votes) => {
  return db
    .query(
      `UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *`,
      [inc_votes, review_id]
    )
    .then((results) => {
      if (!results.rows[0]) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
        });
	  }
	  else if (!inc_votes) {
		 return Promise.reject({
				status: 400,
				msg: "Nothing inputed",
			});
	  }
      return results.rows[0];
    })
};
