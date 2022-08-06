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

exports.fetchAllReviews = async ({
	sort_by = "created_at",
	order = "desc",
	category,
}) => {
	const validSortBy = ["created_at", "votes", "owner", "title"];
	const validOrderBy = ["asc", "desc"];
	const validCategory = [];

	let reviewsQueryStr = `
  SELECT reviews.*, COUNT(comments.review_id) AS comment_count
  FROM reviews
  LEFT JOIN comments
  ON comments.review_id = reviews.review_id`;

	if (
		!validOrderBy.includes(order) ||
		!validSortBy.includes(sort_by) ||
		!isNaN(category)
	) {
		return Promise.reject({ status: 400, msg: "Bad Request" });
	}

	if (category) {
		let checkCategoryQueryStr = `
      SELECT *
      FROM categories
      WHERE slug = $1
      `;
		const checkCategory = [category];

		const { rows } = await db.query(checkCategoryQueryStr, checkCategory);

		if (!rows.length) {
			return Promise.reject({
				status: 404,
				msg: 'Not Found',
			});
		} else {
			reviewsQueryStr += ` WHERE reviews.category = $1`;
			validCategory.push(category);
		}
	}

	reviewsQueryStr += ` 
    GROUP BY reviews.review_id
    ORDER BY reviews.${sort_by} ${order}`;

	const { rows } = await db.query(reviewsQueryStr, validCategory);

	return rows;
};


