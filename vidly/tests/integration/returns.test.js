const {Rental} = require('../../models/rental');
const mongoose = require('mongoose');
const request = require('supertest');
const {User} = require('../../models/user');

describe('/api/returns', () => {
  // Load and unload the server before and after each test
  let server;
  let rental;
  let customerId;
  let movieId;
  let token;

  beforeEach( async () => {
    server = require('../../index');

    token = new User(
      {name:'user1', isAdmin: true}
    ).generateAuthToken();

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: 'customer1',
        phone: '12345'
      },
      movie:{
        _id: movieId,
        title: 'movie1',
        dailyRentalRate: 2
      }
    });

    await rental.save();
  });
  
  it('should run the beforeEach code', async () => {
    const res = await Rental.findById(rental._id);
    expect(res).not.toBeNull();
  });

  afterEach( async () => {
    await server.close();
    await Rental.deleteMany({});
  });

  describe('POST /', () => {

    const exec = () => {
      return request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({customerId, movieId})
    };

    it('should return 401 if the client is not logged in', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });
  });


});