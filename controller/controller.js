const {fetchCategories} = require('../model/model')


exports.returnCategories = (request, response) => {
    
    fetchCategories().then((categories) => {
      
        response.status(200).send({categories})
    })
      
}
    
    