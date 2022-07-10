const json = require("../endpoints.json");

exports.getAPI = (request, response, next) => {
	response.status(200).send(json);
};


