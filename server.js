require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/database");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./src/docs/swagger");

const app = express();
app.use(express.json());

connectDB();

app.use("/api", require("./src/routes"));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📚 Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
