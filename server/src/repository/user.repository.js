import User from "../models/User.model.js";

export const findUserByEmail = (email) => {
  return User.findOne({ email }).select("+passwordHash");
};

export const createUser = (data) => {
  return User.create(data);
};

export const findUserById = (id) => {
  return User.findById(id);
};
