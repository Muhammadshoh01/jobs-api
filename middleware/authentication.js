const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors/index");

const authentication = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Please provide valid headers");
  }
  const reqtoken = authorizationHeader.split(" ")[1];

  try {
    const decodeToken = jwt.verify(reqtoken, process.env.JWT_SECRET);
    req.user = { userId: decodeToken.userId, name: decodeToken.name };

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication failed");
  }
};

module.exports = authentication;
