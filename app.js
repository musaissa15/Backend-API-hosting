const express = require('express');
const { returnCategories } = require('./controller/controller');
const app = express();


app.get('/api/categories', returnCategories)

app.all('/*',(request,response,next) => {
    response.status(404).send({'Invalid Path'})
})


app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Server Error!');
  });

module.exports = app