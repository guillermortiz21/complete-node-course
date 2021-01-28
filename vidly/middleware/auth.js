const jwt = require('jsonwebtoken');

module.exports = function (req, res, next){
  const token = req.header('x-auth-token');
  if(!token) return res.status(401).send('Access denied. No token provided');

  // Verify it is a valid token
  try{
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);
    // set the user object in request.
    // This has the decoded payload of the jwt
    req.user = decoded;
    next();
  }catch(err){
    res.status(400).send('Invalid token.');
  }
}
