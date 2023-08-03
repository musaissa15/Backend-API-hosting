const db = require("../db/connection");

exports.fetchComments = (review_id) => {
  return db
    .query(`SELECT * FROM comments WHERE review_id = $1`, [review_id])
    .then((results) => {
      return results.rows;
    });
};

exports.insertCommentsByReviewId = ({ author, body }, review_id) => {
  return db
    .query(
      `INSERT INTO comments (author, body, review_id)
    VALUES ($1, $2, $3)
    RETURNING author, body`,
      [author, body, review_id]
    )
    .then((results) => {
      if (!author && body) {
        Promise.reject({
          status: 400,
          msg: "Bad Request",
        });
      }

      return results.rows[0];
    });
};

exports.deleteTheComments = (comment_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE 
  comment_id = $1`,
      [comment_id]
    )
    .then((results) => {
      if (!results.rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
        });
      } else {
        return db.query(`DELETE FROM comments WHERE comment_id = $1`, [
          comment_id,
        ]);
      }
    });
};
