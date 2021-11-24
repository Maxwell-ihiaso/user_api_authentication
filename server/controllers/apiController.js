const createError = require("http-errors");
const Client = require("../auth/redis_init");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../auth/jwtHelper");
const User = require("../models/UserModel");
const { authUserSchema } = require("../auth/JoiValidation");

const registerHandler = async (req, res, next) => {
  try {
    const { email, password } = await authUserSchema.validateAsync(req.body);
    const isExistingUser = await User.findOne({ email });
    if (isExistingUser)
      throw createError.Conflict(`${email} is already existing!`);

    const user = new User({ email, password });
    const savedUser = await user.save();
    const accessToken = await signAccessToken(savedUser.id);
    const refreshToken = await signRefreshToken(savedUser.id);

    res.status(200).json({
      status: "success",
      isLoggedIn: false,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error.isJoi) error.status = 422;
    next(error);
  }
};

const loginHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const isExistingUser = await User.findOne({ email });
    if (!isExistingUser)
      throw createError.Unauthorized(`${email} is not registered`);
    const isCorrectPassword = await isExistingUser.isValidPassword(password);
    if (!isCorrectPassword)
      throw createError.Unauthorized(`Username/ Password is incorrect`);

    const accessToken = await signAccessToken(isExistingUser.id);
    const refreshToken = await signRefreshToken(isExistingUser.id);
    res.status(200).json({
      status: "success",
      isLoggedIn: true,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error.isJoi) error.status = 422;
    next(error);
  }
};

const dashboardHandler = async (req, res, next) => {
  try {
    const { aud: userid } = req.payload;
    const user = await User.findById({ _id: userid });
    res.status(200).render("dashboard", {
      user: { ...user },
    });
  } catch (error) {
    next(error);
  }
};

const refreshHandler = async (req, res, next) => {
  try {
    const { refToken } = req.body;
    const userid = await verifyRefreshToken(refToken);

    const accessToken = await signAccessToken(userid);
    const refreshToken = await signRefreshToken(userid);
    res.status(200).json({
      status: "success",
      isLoggedIn: true,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

const logoutHandler = async (req, res, next) => {
  const { aud: userid } = req.payload;
  Client.DEL(userid, (err, val) => {
    if (err) console.log(err);
    console.log(val);
    res.status(200).redirect("/");
  });
};

module.exports = {
  registerHandler,
  loginHandler,
  dashboardHandler,
  refreshHandler,
  logoutHandler,
};
