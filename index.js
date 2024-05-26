const express = require("express");
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

// User Routes
app.use("/api/users", userRoutes);
app.use("/api/parties", partyRoute);

// Error handling middleware
// app.use(notFound);
// app.use(errorHandler);

// Swagger UI
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(PORT, () => {
  console.log(`E-Voting Server has started on port ${PORT}..`);
});
