const {Rental} = require('../../models/rental');
const mongoose = require('mongoose');

describe('/api/returns', () => {
  // Load and unload the server before and after each test
  let server;
  let rental;
  let customerId;
  let movieId;

  beforeEach( async () => {
    server = require('../../index');
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
    server.close();
    await Rental.deleteMany({});
  });


});