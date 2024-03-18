const jwt = require("jsonwebtoken");

class SessionService {
  static generateToken({ email }) {
    if (!email) {
      throw new Error("Email is required");
    }

    return jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "30s",
    });
  }
}

module.exports = SessionService;
