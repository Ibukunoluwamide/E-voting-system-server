const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/user.route");
const partyRoute = require("./routes/party.route");

dotenv.config();

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 3500;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Define a middleware function to log requests
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  if (Object.keys(req.body).length !== 0) {
    console.log(`Request body: ${JSON.stringify(req.body)}`);
  }
  next();
});

// Define a middleware function to log responses
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    originalSend.call(this, body);
    console.log(`Response sent: ${JSON.stringify(body)}`);
  };
  next();
});

// Enable CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
    methods: ["GET", "PUT", "POST"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Credentials",
    ],
  })
);

// Enable CORS
app.use(cors());

// User Routes
app.use("/api/users", userRoutes);
app.use("/api/parties", partyRoute);

// Swagger UI
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`E-Voting Server has started on port ${PORT}..`);
});
