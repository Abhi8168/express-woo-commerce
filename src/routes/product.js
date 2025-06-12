const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const validator = require("express-joi-validation").createValidator({});

const {
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { productSchema } = require("../validations/product");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management for logged-in sellers
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductInput:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           example: "iPhone 14"
 *         description:
 *           type: string
 *           example: "Latest Apple smartphone"
 *         price:
 *           type: number
 *           example: 999.99
 *         imageUrl:
 *           type: string
 *           example: "https://example.com/iphone14.jpg"
 *         status:
 *           type: string
 *           enum: [Created Locally, Synced, Sync Failed]
 *           example: Created Locally
 *
 *     ProductResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ProductInput'
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "64e2a9afc3fb3a2bb03b53a9"
 *             createdAt:
 *               type: string
 *               format: date-time
 *             updatedAt:
 *               type: string
 *               format: date-time
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/", auth, validator.body(productSchema), createProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get list of products by the logged-in seller
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductResponse'
 *       401:
 *         description: Unauthorized
 */
router.get("/", auth, getMyProducts);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.put("/:id", auth, validator.body(productSchema), updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.delete("/:id", auth, deleteProduct);

module.exports = router;
