const mongoose = require('mongoose');
const auth = require('../../../middleware/auth');
const {User} = require('../../../models/user');

describe('auth middleware', () => {
  // let server;

  // beforeEach(() => {
  //   server = require('../../../index');
  // });

  // afterEach(async () => {
  //   server.close();
  // });

  it('should populate req.user with the payload of a valid JWT', () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    }
    const token = new User(user).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token),
      user: ''
    };

    const res = {};

    const next = jest.fn();

    auth(req, res, next);

    expect(req.user).toMatchObject(user);
    expect(next).toHaveBeenCalled();
  });
})