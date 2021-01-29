require('dotenv').config();

const {User} = require('../../../models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {
  it('should return a valid json web token', () => {
    const userObject = {
      _id: new mongoose.Types.ObjectId().toHexString(), 
      isAdmin: true
    };
    const user = new User(userObject);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);
    expect(decoded).toMatchObject(userObject);
  });
});