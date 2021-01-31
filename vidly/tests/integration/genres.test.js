const request = require('supertest');
const {Genre} = require('../../models/genre');
const mongoose = require('mongoose');
const {User} = require('../../models/user');

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

  describe('GET /:id', () => {
    it('should return a genre with a given id if the genre exists', async () => {
      const genre = new Genre({name: 'genre1'});
      await genre.save();

      const res = await request(server).get(`/api/genres/${genre._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', genre.name);
    });

    it('should return a 404 error if the genre does not exist', async () =>{
      const res = await request(server).get('/api/genres/1');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {

    // Define the success path and then, in each test, change one parameter
    // that aligns with the name of the test.

    let token;
    let name;

    const exec = async () => {
      return res = await request(server)
        .post('/api/genres')
        .set('x-auth-token', token) // set the token
        .send({name}); // Less than 3 chars
    }

    beforeEach(() => {
      // Simulate a log in in each test
      token = new User().generateAuthToken();
      name = 'genre1'
    });

    it('should return 401 if client is not logged in', async () =>{
      token = ''; // Client is not logged in
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return 400 if genre is less than 3 characters', async () =>{
      // First we need to log in!
      name = 'aa'; // genre less than 3 characters
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should save the genre if it is valid', async () =>{
      // First we need to log in!
      const res = await exec();
      const genre = await Genre.find({name: 'genre1'});
      expect(res.status).toBe(200);
      expect(genre).not.toBe(null);
    });

    it('should return the genre if it is valid', async () =>{
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1');
    });
  });
});
