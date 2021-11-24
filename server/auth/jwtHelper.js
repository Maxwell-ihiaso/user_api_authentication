const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const Client = require("./redis_init");

const signAccessToken = (userid) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      audience: userid,
      expiresIn: "30m",
    };
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err);
        return reject(createError.InternalServerError());
      }
      resolve(token);
    });
  });
};

verifyAccessToken = (req, res, next) => {
  if (!req.headers["authorization"]) return next(createError.Unauthorized());
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      console.log(err.message);
      return err.name === "JsonWebTokenError"
        ? next(createError.Unauthorized())
        : next(createError.Unauthorized(`You are logged out`));
    }
    req.payload = payload;
    next();
  });
};

const signRefreshToken = (userid) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      audience: userid,
      expiresIn: "1y",
    };
    JWT.sign(payload, secret, options, (err, refToken) => {
      if (err) {
        console.log(err);
        return reject(createError.InternalServerError());
      }
      Client.SET(userid, refToken, "EX", 365 * 24 * 60 * 60, (err, result) => {
        if (err) return reject(createError.InternalServerError());
        resolve(refToken);
      });
    });
  });
};

verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    if (!refreshToken) return reject(createError.Unauthorized());
    JWT.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, payload) => {
        if (err) return reject(createError.Unauthorized());
        const userid = payload.aud;

        Client.GET(userid, (err, reply) => {
          if (err) return reject(createError.InternalServerError());
          if (refreshToken === reply) return resolve(userid);
          reject(createError.Unauthorized());
        });
      }
    );
  });
};

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
