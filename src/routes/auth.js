const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { registerSchema, loginSchema } = require("../validations/auth");
const validator = require("express-joi-validation").createValidator({});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: MyP@ssw0rd
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/register", validator.body(registerSchema), register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: MyP@ssw0rd
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.post("/login", validator.body(loginSchema), login);

module.exports = router;
