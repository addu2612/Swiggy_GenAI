const jwt = require("jsonwebtoken");
const JsonResponse = require('../helper/JsonResponse');
const Messages = require('../constants/Message');

const messages = new Messages();

exports.verifyToken = function (req, res, next) {
  try {
    const bearerToken = req.headers["authorization"];
    
    if (!bearerToken) {
      res.locals.message = messages.UNAUTHORIZED;
      res.locals.status_code = 401;
      return new JsonResponse(req, res).jsonError();
    }

    const bearer = bearerToken.split(" ");
    
    if (bearer.length !== 2 || bearer[0] !== 'Bearer') {
      res.locals.message = messages.UNAUTHORIZED;
      res.locals.status_code = 401;
      return new JsonResponse(req, res).jsonError();
    }

    const token = bearer[1];
    req.apiUser = jwt.verify(token, process.env.JWTSECRET);
    next();
  } catch (error) {
    res.locals.data = {
      isVaild: false, 
      authorizationFailed: true,
    };

    if (error.name === 'TokenExpiredError') {
      res.locals.message = messages.UNAUTHORIZED_SESSION_EXPIRED;
    } else {
      res.locals.message = messages.UNAUTHORIZED;
    }
    
    res.locals.status_code = 401;
    new JsonResponse(req, res).jsonError();
  }
};

exports.adminOnly = function (req, res, next) {
  try {
    if (req.apiUser.role !== 'admin') {
      res.locals.message = 'Admin access required';
      res.locals.status_code = 403;
      return new JsonResponse(req, res).jsonError();
    }
    next();
  } catch (error) {
    res.locals.message = error.message;
    res.locals.status_code = 500;
    new JsonResponse(req, res).jsonError();
  }
};
