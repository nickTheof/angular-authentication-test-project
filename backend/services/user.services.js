const User = require("../models/user.model");
const logger = require("../utils/logger");
const AppError = require("../utils/AppError");

function sanitizeUserForLog(user) {
  const { password, __v, ...safeUser } = user;
  return safeUser;
}

async function isValidEmail(email) {
  const results = await User.countDocuments({ email: email });
  return results === 0;
}

async function findAll() {
  const result = await User.find();
  return result;
}

async function findOneById(id) {
  const user = await User.findById(id);
  if (!user) throw new AppError(`User with id ${id} was not found`, 404);
  return user;
}

async function findOneByEmail(email) {
  const user = await User.findOne({ email: email });
  if (!user) throw new AppError(`User with email ${email} was not found`, 404);
  return user;
}

async function createOne(user) {
  if (!(await isValidEmail(user.email)))
    throw new AppError(`User already exists`, 400);
  const newUser = new User(user);
  const result = await newUser.save();
  logger.info("User created successfully", sanitizeUserForLog(result._doc));
  return result;
}

async function deleteOneById(id) {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new AppError(`User with id ${id} was not found`, 404);
  logger.info("User deleted", sanitizeUserForLog(user._doc));
  return user;
}

async function updateOneById(id, updateData) {
  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new AppError(`User with id ${id} was not found`, 404);
  logger.info("User updated", sanitizeUserForLog(user._doc));
  return user;
}

async function findUserDetailsForJWT(email) {
  const user = await User.findOne(
    { email: email },
    { _id: 1, email: 1, password: 1, roles: 1, isActive: 1 }
  );
  if (!user) {
    throw new AppError(`Invalid login credentials`, 400);
  }
  return user;
}

async function findUserByIdIncludingPassword(id) {
  const user = await User.findById(id).select("+password");
  if (!user) throw new AppError(`User with id ${id} was not found`, 404);
  return user;
}

module.exports = {
  findAll,
  findOneById,
  findOneByEmail,
  createOne,
  deleteOneById,
  updateOneById,
  findUserDetailsForJWT,
  findUserByIdIncludingPassword,
  isValidEmail,
};
