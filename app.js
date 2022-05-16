const express = require('express');
const { returnCategories } = require('./controller/controller');
const app = express();


app.get('/api/categories', returnCategories)



module.exports = app