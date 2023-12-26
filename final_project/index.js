const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if the session and authorization data exist
    if (req.session && req.session.authorization && req.session.authorization.accessToken) {
      // Optionally, verify the access token for extra security
      try {
        jwt.verify(req.session.authorization.accessToken, "access");
  
        // If verification is successful, proceed to the next middleware/route handler
        next();
      } catch (err) {
        // If the token is invalid or expired, send an unauthorized response
        return res.status(401).json({ message: "Unauthorized access - Invalid token" });
      }
    } else {
      // If session or authorization data is missing, send an unauthorized response
      return res.status(401).json({ message: "Unauthorized access - Please log in" });
    }
  });

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
