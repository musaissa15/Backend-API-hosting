

exports.handleCustomErrors = (error, request, response, next) => {
  if (error.status && error.msg) {
    response.status(error.status).send({ msg: error.msg });
  } else next(error);
}

exports.handlePsqlErrors = (error, request, response, next) => {
  if (error.code === "23502" || error.code === "22P02") {
    response.status(400).send({ msg: "Bad Request" });
  } else if (error.code === "23503") {
    response.status(404).send({ msg: "Not Found" });
  }

  next(error);
};

exports.handleServerErrrors = (error, request, response, next) => {
	console.log(error, "Uncaught Error");
	response.status(500).send("Server Error!");
}