const express = require('express');
const { returnCategories } = require('./controller/controller');
const app = express();


app.get('/api/categories', returnCategories)

app.all('/*',(request,response,next) => {
    response.status(404).send({msg:'Invalid Path'})
})

// app.use((error,request,response,next) => {
// response.status(404).send({msg: 'Invalid Path'})
//     next(error)
// })

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Server Error!');
  });

module.exports = app