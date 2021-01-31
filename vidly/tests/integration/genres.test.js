const request = require('supertest');
const {Genre} = require('../../models/genre');

let server;

describe('/api/genres', () => {
  // Jest will call this function before it calls each of the testing functions
  // inside this suit.
  beforeEach(() => {server = require('../../index')});
    
  // Jest will call this function after it calls each of the testing functions
  // inside this suit
  afterEach(async () => {
    server.close();
    // Remove all the Genres after doing the tests
    await Genre.remove({});
  });

  // The last two functions will start and close the server with every function in this testing suit.

  // A test suit for every http verb
  describe('GET /', () => {
    it('should return all genres', async () => {
      // Create some genres
      await Genre.collection.insertMany([
        {name: 'genre1'},
        {name: 'genre2'}
      ]);

      const res = await request(server).get('/api/genres');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      // Check if the two genres were fetched from the db.
      expect(res.body.some(genre => genre.name === 'genre1')).toBeTruthy(); 
      expect(res.body.some(genre => genre.name === 'genre2')).toBeTruthy();
    });
  });
});
