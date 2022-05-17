const {fetchCategories} = require('../model/model')


exports.returnCategories = (request, response, next) => {
    fetchCategories()
    .then((categories) => {
    response.status(200).send({categories})
    }).catch((error) =>{
        console.log(error)
        next(error)
    })
        
  
}
    
    