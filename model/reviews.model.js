const db = require("../db/connection");

exports.fetchReviews = (review_id) => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id):: int AS comment_count
            FROM reviews
            LEFT JOIN comments
            ON comments.review_id = reviews.review_id
            WHERE reviews.review_id = $1
            GROUP BY reviews.review_id`,
      [review_id]
    )
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
      } else if (!inc_votes) {
        return Promise.reject({
          status: 400,
          msg: "Bad Request",
        });
      }
      return results.rows[0];
    });
};

exports.fetchAllReviews = (sort_by = "created_at", order = "desc", category) => {
  let queryString = `SELECT reviews.review_id, reviews.title, reviews.owner, reviews.review_img_url, reviews.category, reviews.created_at, reviews.votes, COUNT(comments.comment_id):: int AS comment_count
      FROM reviews
      LEFT JOIN comments
      ON comments.review_id = reviews.review_id
      GROUP BY reviews.review_id
            `;

  const validSortBy = ["created_at", "votes", "owner", "title"];

  const validOrder = ["asc, desc"];

  const validCategory = []

  if (validSortBy.includes(sort_by)) {
    queryString += ` ORDER BY ${sort_by} desc`;
  } else if (validOrder.includes(order)) {
    queryString += `ORDER BY ${sort_by} ${order}`;
  } else if
            (category) {
     ` SELECT *
      FROM categories
      WHERE slug = $1
      `;
      
    
  }
  console.log(category);
  return db.query(queryString).then((reviews) => {
    return reviews.rows;
  });
};
