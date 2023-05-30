const jwt = require("jsonwebtoken");
import * as ResponseHandler from '../../../helpers/responseHandler';
const config = process.env;

const verifyToken = (req, res, next) => {

  console.log("Request cookies ===>", req.cookies);
  const authHeader = req.cookies.token ? req.cookies.token : req.headers.authorization;
  if (authHeader === undefined) {
    res.locals.data = {};
    res.locals.message = 'Token not found';
    ResponseHandler.JSONSUCCESS(req, res);
  } else {
    const headerParts = authHeader.split(' ');
    const token: string = req.cookies.token ? headerParts[0] : headerParts[1];

    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    const decoded = jwt.verify(token, config.JWTTOKENSECRETKEY, function (err, result) {
      if (err && err.name === 'TokenExpiredError') {

        return res.status(401).send({ success: false, message: 'Unauthorized! Access Token was expired!' });
      }
      if (err && err.name === 'NotBeforeError') {
        return res.status(401).send({ success: false, message: 'jwt not active' });
      }
      if (err && err.name === 'JsonWebTokenError') {
        return res.status(401).send({ success: false, message: 'jwt malformed' });
      }
      else {
        res.locals.user = result;
        console.log("request user ====>", res.locals.user)
        return next();
      }
    });
  }
};

module.exports = verifyToken;