const app = require('../app')
const request = require('supertest')
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data/index")



beforeEach(() => {
   return seed(testData);
})

afterAll(() => {
    return db.end();
})



describe('Get /api/categories', () => {
    test('200: response with all categories, with slug and description', () => {
        return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({body}) => {
      
        const {categories} = body
        expect(body.categories.length).toBe(4)
        categories.forEach((category) => {
        expect(category).toMatchObject({
            slug: expect.any(String),
            description : expect.any(String)
         })
        
        })
    })});
});