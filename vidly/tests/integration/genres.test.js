const request = require('supertest');

let server;

describe('/api/genres', () => {
  // Jest will call this function before it calls each of the testing functions
  // inside this suit.
  beforeEach(() => {server = require('../../index')});
    
  // Jest will call this function after it calls each of the testing functions
  // inside this suit
  afterEach(() => {server.close()});

  // The last two functions will start and close the server with every function in this testing suit.

  // A test suit for every http verb
  describe('GET /', () => {
    it('should return all genres', async () => {
      const res = await request(server).get('/api/genres');
      expect(res.status).toBe(200);
    });
  });
});
