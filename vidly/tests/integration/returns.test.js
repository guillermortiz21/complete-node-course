const {Rental} = require('../../models/rental');
const {Movie} = require('../../models/movie');
const mongoose = require('mongoose');
const request = require('supertest');
const {User} = require('../../models/user');
const moment = require('moment');

describe('/api/returns', () => {
  // Load and unload the server before and after each test
  let server;
  let rental;
  let customerId;
  let movieId;
  let token;
  let payload;
  let movie;

  beforeEach( async () => {
    server = require('../../index');

    token = new User(
      {name:'user1', isAdmin: true}
    ).generateAuthToken();

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    payload = {customerId, movieId};

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

    movie = new Movie({
      _id: movieId,
      title: 'movie1',
      genre: {name: 'genre1'},
      numberInStock: 5,
      dailyRentalRate: 2
    });

    await movie.save();
  });
  
  it('should run the beforeEach code', async () => {
    const res = await Rental.findById(rental._id);
    expect(res).not.toBeNull();
  });

  afterEach( async () => {
    await server.close();
    await Rental.deleteMany({});
    await Movie.deleteMany({});
  });

  describe('POST /', () => {

    const exec = () => {
      return request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send(payload)
    };

    it('should return 401 if the client is not logged in', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });
    
    it('should return 400 if customerId is not provided', async () => {
      delete payload.customerId;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is not provided', async () => {
      delete payload.movieId;
      const res = await exec();
      expect(res.status).toBe(400);
    });
    
    it('should return 404 if no retal found for this customer/movie', async () => {
      await Rental.deleteMany({});
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it('should return 400 if return is already processed', async () => {
      // I need to simulate the return
      rental.dateReturned = new Date();
      await rental.save();

      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 200 if the request is valid', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it('should set the return date if the request is valid', async () => {
      const res = await exec();

      const result = await Rental.findOne({_id: rental._id});
      const diff = new Date() - result.dateReturned;
      // We expect the date difference to be less than 10 seconds.

      expect(res.status).toBe(200);
      expect(res.body.dateReturned).not.toBeNull();
      expect(diff).toBeLessThan(10 * 1000);
    });

    it('should set the rental fee if the request is valid', async () => {
      // Modify dateOut to simulate 7 days of rental.
      const daysOut = 7;
      rental.dateOut = moment().add(-daysOut, 'days').toDate();
      await rental.save();

      const res = await exec();

      // The rental fee should be the number of days rented times
      // the daily rental rate
      const result = await Rental.findOne({_id: rental._id});
      const rentalFee = daysOut * result.movie.dailyRentalRate;
      
      expect(res.status).toBe(200);
      expect(result.rentalFee).toBe(rentalFee);
    });

    it('should increase the stock of the movie if the request is valid', async () => {
      // get the current stock
      const stock = movie.numberInStock;
      
      const res = await exec();

      // get the movie again and check the stock
      movieInDb = await Movie.findOne({_id: payload.movieId});

      expect(res.status).toBe(200);
      expect(movieInDb.numberInStock).toBe(stock + 1);
    });

    it('should return the rental object if the request is valid', async () => {
      const res = await exec();

      expect(Object.keys(res.body)).toEqual(
        expect.arrayContaining(['dateOut','dateReturned','customer','movie'])
      )
    });
  });
});