const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

const crypto = require("crypto");

function hashPassword(password) {
  return crypto.createHash("md5").update(password).digest("hex");
}

function verifyPassword(password, storedPassword) {
  console.log({
    password,
    hash: hashPassword(password),
    hash2: hashPassword(password),
    hash3: hashPassword("test3"),
    stored: storedPassword,
  });
  return storedPassword === hashPassword(password);
}

function getDecodedPayload(token) {
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.log(`Error while verifying token : ${error}`);
  }

  return payload;
}

module.exports = {
  generateAccessToken: function (payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
  },

  hashPassword,
  verifyPassword,
  getDecodedPayload,
  verifyToken: function (req, res, next) {
    const token = req.header("Authorization");

    console.log(token);

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Access denied. - ntk",
      });
    }
    try {
      const decoded = getDecodedPayload(token);
      console.log(decoded);
      req.userId = decoded.userId;
      next();
    } catch (error) {
      res.status(401).json({
        status: false,
        message: "Access denied.etc",
      });
    }
  },
};

function test() {
  const hash1 = hashPassword("password");
  const hash2 = hashPassword("password");
  const hash3 = hashPassword("password2");
  console.log({ hash1, hash2, hash3 });

  const res1 = verifyPassword("password", hash1);
  const res2 = verifyPassword("password3", hash1);
  console.log({ res1, res2 });
}
