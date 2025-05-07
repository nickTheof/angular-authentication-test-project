const jwt = require("jsonwebtoken");
const userService = require("../services/user.services");
const secUtil = require("../utils/secUtil");

function generateAccessToken(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    roles: user.roles,
  };

  const secret = process.env.JSONWEBTOKEN_SECRET;
  const options = {
    expiresIn: "1h",
  };
  return jwt.sign(payload, secret, options);
}

function verifyAccessToken(token) {
  const secret = process.env.JSONWEBTOKEN_SECRET;
  try {
    const payload = jwt.verify(token, secret);
    return {
      verified: true,
      data: payload,
    };
  } catch (err) {
    return {
      verified: false,
      data: err.message,
    };
  }
}

async function loginUser(email, password) {
  const fetchedUser = await userService.findUserDetailsForJWT(email);
  let isMatch = false;
  if (fetchedUser && fetchedUser.isActive) {
    isMatch = await secUtil.comparePassword(password, fetchedUser.password);
  }
  if (
    fetchedUser &&
    fetchedUser.isActive &&
    fetchedUser.email === email &&
    isMatch
  ) {
    let token = generateAccessToken(fetchedUser);
    return {
      status: true,
      data: token,
    };
  } else {
    return {
      status: false,
      data: "Invalid Login Credentials",
    };
  }
}

module.exports = {
  loginUser,
  generateAccessToken,
  verifyAccessToken,
};
