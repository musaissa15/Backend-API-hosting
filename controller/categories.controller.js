
const { fetchCategories } = require("../model/catergories.model");

exports.returnCategories = (request, response, next) => {
	console.log("in the categories.controller.js");
	fetchCategories()
		.then((categories) => {
			response.status(200).send({ categories });
		})
		.catch((error) => {
			next(error);
		});
};
