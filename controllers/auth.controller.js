const User = require('../models/user.model');
const authUtil = require('../util/authentication');
const validation = require('../util/validation');
const sessionFlash = require('../util/session-flash');

function getSignup(request, response) {
  let sessionData = sessionFlash.getSessionData(request);

  if (!sessionData) {
    sessionData = {
      email: '',
      confirmEmail: '',
      password: '',
      fullname: '',
      street: '',
      postal: '',
      city: ''
    }
  }
  response.render('customer/auth/signup', {inputData: sessionData});
}

//! SignUp Customer
async function signup(request, response, next) {
  const enteredData = {
    email: request.body.email, 
    confirmEmail: request.body['confirm-email'],
    password: request.body.password,
    fullname: request.body.fullname, 
    street: request.body.street, 
    postal: request.body.postal,
    city: request.body.city
  };
  //! Validate User input
  if (!validation.userDatailsAreValid(
      request.body.email, 
      request.body.password,
      request.body.fullname, 
      request.body.street, 
      request.body.postal,
      request.body.city
      ) || !validation.emailIsConfirmed(request.body.email, 
        request.body['confirm-email'])
      ) {
    sessionFlash.flashDataToSession(request, {
      errorMessage: 'Please check your input',
      ...enteredData
    }, function() {
      response.redirect('/signup');
    });
    //response.redirect('/signup');
    return;
  }

  const user = new User(
    request.body.email,
    request.body.password,
    request.body.fullname,
    request.body.street,
    request.body.postal,
    request.body.city
  );

  try {
    const existsAlready = await user.existsAlready();

    if (existsAlready) {
      sessionFlash.flashDataToSession(request, {
        errorMessage: 'User exists already!',
        ...enteredData
      }, function() {
        response.redirect('/signup');
      });
      //response.redirect('customer/auth/signup');
      return;
    }
  
    await user.signup();
  }catch(error) {
    next(error);
    return;
  }

  response.redirect('/login');
}

function getLogin(request, response) {
  let sessionData = sessionFlash.getSessionData(request);

  if (!sessionData) {
    sessionData = {
      email: '',
      password: ''
    };
  }
  response.render('customer/auth/login', {inputData: sessionData});
}

async function login(request, response, next) {
  const user = new User(request.body.email, request.body.password);
  let existingUser;

  try {
    existingUser = await user.getUserWithSameEmail();
  }catch(error) {
    next(error);
    return;
  }

  const sessionErrorData = {
    errorMessage: 'Username or password incorrect',
      email: user.email,
      password: user.password
  };

  if (!existingUser) {
    sessionFlash.flashDataToSession(request,sessionErrorData, function() {
      response.redirect('/login');
    });
    //response.redirect('/login');
    return;
  }
  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password);

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(request,sessionErrorData, function() {
      response.redirect('/login');
    });
    //response.redirect('/login');
    return;
  }
  authUtil.createUserSession(request, existingUser, function() {
    response.redirect('/');
  });
}

//! logout function
function logout(request, response) {
  authUtil.destroyUserAuthSession(request);
  response.redirect('/login');
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout
};