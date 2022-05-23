const {
	fetchUsers,
} = require("../model/users.model");


exports.returnUsers = (request, response) => {
	fetchUsers().then((users) => {
		response.status(200).send({ users });
	});
};


exports.fetchUsers = () => {
	return db.query("SELECT * FROM users").then((users) => {
		return users.rows;
	});
};