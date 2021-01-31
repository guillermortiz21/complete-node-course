const request = require('supertest');
const {User} = require('../../models/user');
const {Genre} = require('../../models/genre');

let server;
let token;

describe('auth middleware', () => {

  beforeEach(() => {
    server = require('../../index');
    token = new User().generateAuthToken();
  });

  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });

  const exec = () => {
    // we can pick any endpoint that requires authorization.
    return request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({name: 'genre'});
  }

  it('should return 401 if no token is provided', async () =>{
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it('should return 400 if the token is invalid', async () =>{
    token = 'a';
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it('should return 200 if the token is valid', async() => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
