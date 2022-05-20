const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
require('jest-sorted')

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("Get /api/categories", () => {
  test("200: response with all categories, with slug and description", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories.length).toBe(4);
        categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("status:404, response to an error message when passed the wrong route", () => {
    return request(app)
      .get("/api/InvalidPath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Path");
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("200: response with all revies with all its properties", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toMatchObject({
          review_id: 1,
          title: "Agricola",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Farmyard fun!",
          category: "euro game",
          created_at: "2021-01-18T10:00:20.514Z",
          votes: 1,
        });
      });
  });
  test("status:400, response to an error message when passed the wrong route", () => {
    return request(app)
      .get("/api/reviews/notAnumber")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status:404, response to an error message when passed a number with no review", () => {
    return request(app)
      .get("/api/reviews/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("Responses with the updated Review ", () => {
    const updatedVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/reviews/2")
      .send(updatedVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 2,
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 6,
        });
      });
  });
  test("status:400, response with an error message when user passes something not a number in inc_votes", () => {
    const updatedVotes = { inc_votes: "wrongDataType" };
    return request(app)
      .patch("/api/reviews/2")
      .send(updatedVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status:404, response with an error message when user passes in a valid number with no review", () => {
    return request(app)
      .patch("/api/reviews/99")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  test("status:400, response with an error message when something that is not a number is passed an id in the path", () => {
    const updatedVotes = { inc_votes: "1" };
    return request(app)
      .patch("/api/reviews/NotaNumber")
      .send(updatedVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("status:400, response with an error message when the inc_votes key missing", () => {
    const updatedVotes = {};
    return request(app)
      .patch("/api/reviews/2")
      .send(updatedVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET api/users", () => {
  test("Status:200 Responds withan array of objects each object should have the following property", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("200: reponses with a comment_count object ", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toMatchObject({ comment_count: 3 })
      });
  });
});


describe("GET /api/reviews", () => {
	test("200:Responds withan array of objects each object should have the following property", () => {
		return request(app)
			.get("/api/reviews")
			.expect(200)
			.then(({ body }) => {
				const { reviews } = body;
        expect(reviews.length).toBe(13);
				
        reviews.forEach((review) => {
					expect(review)
						.toMatchObject({
							review_id: expect.any(Number),
							title: expect.any(String),
							owner: expect.any(String),
							review_img_url: expect.any(String),
							category: expect.any(String),
							created_at: expect.any(String),
							votes: expect.any(Number),
							comment_count: expect.any(Number),
						})
						
        });
        expect(reviews).toBeSortedBy("created_at", { descending: true });
			});
	});
});

describe('GET /api/reviews/:review_id/comments', () => {
  
  test('comments should have properties', () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({body}) => {
        const {review_idComments} = body;
        expect(review_idComments.length).toBe(3);
        review_idComments.forEach((comment) => {
          expect(comment).toEqual(expect.objectContaining({
						comment_id: expect.any(Number),
						body: expect.any(String),
						votes: expect.any(Number),
						author: expect.any(String),
						review_id: 2,
						created_at: expect.any(String),
					}));
        })
      });
  })
  test('200: Responds with an array of comments for the given review_id of which each comment should have the following properties in the test ', () => {
    return request(app).get('/api/reviews/2/comments').expect(200).then(({body}) => {
      const {review_idComments} = body
      expect(review_idComments).toEqual([
				{
					comment_id : 1 ,
          body: "I loved this game too!",
					votes: 16,
					author: "bainesface",
					review_id: 2,
					created_at: "2017-11-22T12:43:33.389Z",
				},
        {
          comment_id : 4,
					body: "EPIC board game!",
					votes: 16,
					author: "bainesface",
					review_id: 2,
					created_at: "2017-11-22T12:36:03.389Z",
				},
        {
          comment_id : 5,
					body: "Now this is a story all about how, board games turned my life upside down",
					votes: 13,
					author: "mallionaire",
					review_id: 2,
					created_at: "2021-01-18T10:24:05.410Z",
				},
			]);

    }) 
  });

  test('Status :400 Should respond with an error message when something not a number passed as the id in the path ', () => {
     return request(app)
				.get("/api/reviews/NotANumber/comments")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad Request");
				});
  });

  test('Status : 404 responds with an error message when a valid number but not a number that matches an id in path', () => {
    return request(app)
			.get("/api/reviews/999/comments")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("Not Found");
			});
  });
  test("status : 200 Responds with an  empty array if review_id has no comment ", () => {
    return request(app)
			.get("/api/reviews/1/comments")
			.expect(200)
			.then(({ body }) => {
				expect(body.review_idComments).toEqual([]);
			});
  });
});

