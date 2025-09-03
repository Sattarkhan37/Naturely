const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync.js');
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  newUser.password = undefined;
  res.status(201).json({
    data: {
      user: newUser,
    },
  });
});
