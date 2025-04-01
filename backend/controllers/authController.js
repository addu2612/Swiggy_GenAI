const User = require('../models/User');
const JsonResponse = require('../helper/JsonResponse');
const Messages = require('../constants/Message');
const jwt = require('jsonwebtoken');

const messages = new Messages();

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.locals.message = 'Please provide all required fields';
    res.locals.status_code = 400;
    return new JsonResponse(req, res).jsonError();
  }

  try {
    const user = new User({ name, email, password });
    const result = await user.register();
    
    const token = jwt.sign(
      { id: result.insertedId, email, name, role: user.role },
      process.env.JWTSECRET,
      { expiresIn: '30d' }
    );

    return new JsonResponse(req, res).jsonSuccess(
      { token, user: { id: result.insertedId, name, email, role: user.role } },
      'User registered successfully'
    );
  } catch (error) {
    res.locals.message = error.message;
    res.locals.status_code = 400;
    return new JsonResponse(req, res).jsonError();
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.locals.message = 'Please provide email and password';
    res.locals.status_code = 400;
    return new JsonResponse(req, res).jsonError();
  }

  try {
    const user = await User.findByEmail(email);
    
    if (!user) {
      res.locals.message = messages.INVALID_CREDENTIALS;
      res.locals.status_code = 401;
      return new JsonResponse(req, res).jsonError();
    }

    const isMatch = await User.comparePassword(password, user.password);
    
    if (!isMatch) {
      res.locals.message = messages.INVALID_CREDENTIALS;
      res.locals.status_code = 401;
      return new JsonResponse(req, res).jsonError();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      process.env.JWTSECRET,
      { expiresIn: '30d' }
    );

    return new JsonResponse(req, res).jsonSuccess(
      { 
        token, 
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role,
          profilePicture: user.profilePicture 
        } 
      },
      'Login successful'
    );
  } catch (error) {
    res.locals.message = error.message;
    res.locals.status_code = 500;
    return new JsonResponse(req, res).jsonError();
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.apiUser.id);
    
    if (!user) {
      res.locals.message = 'User not found';
      res.locals.status_code = 404;
      return new JsonResponse(req, res).jsonError();
    }

    return new JsonResponse(req, res).jsonSuccess(
      { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt
      },
      'Profile retrieved successfully'
    );
  } catch (error) {
    res.locals.message = error.message;
    res.locals.status_code = 500;
    return new JsonResponse(req, res).jsonError();
  }
};
