const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");
const productRoutes = require("./product");

router.use("/auth", authRoutes);
router.use("/products", productRoutes);

module.exports = router;
