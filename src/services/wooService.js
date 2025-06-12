require("dotenv").config(); // Make sure env vars load

const axios = require("axios");

// ✅ FIX: baseURL should end with /wp-json/wc/v3 — NOT include /products
const instance = axios.create({
  baseURL: "https://promotedrug.s3-tastewp.com/wp-json/wc/v3",
  auth: {
    username: process.env.WOO_COMMERCE_CLIENT_ID,
    password: process.env.SECRET_KEY,
  },
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ CREATE PRODUCT
exports.pushToWooCommerce = async (product) => {
  try {
    const { data } = await instance.post("/products", {
      name: product.name,
      description: product.description,
      regular_price: product.price.toString(),
      images: product.imageUrl ? [{ src: product.imageUrl }] : [],
    });
    return { success: true, id: data.id };
  } catch (err) {
    console.error(
      "❌ Error pushing to WooCommerce:",
      err.response?.data || err.message
    );
    return { success: false, error: err.response?.data || err.message };
  }
};

// ✅ UPDATE PRODUCT
exports.updateWooProduct = async (product) => {
  try {
    const { data } = await instance.put(`/products/${product.wooProductId}`, {
      name: product.name,
      description: product.description,
      regular_price: product.price.toString(),
      images: product.imageUrl ? [{ src: product.imageUrl }] : [],
    });
    return { success: true, id: data.id };
  } catch (err) {
    console.error(
      "❌ Error updating WooCommerce product:",
      err.response?.data || err.message
    );
    return { success: false, error: err.response?.data || err.message };
  }
};

// ✅ DELETE PRODUCT
exports.deleteFromWooCommerce = async (wooProductId) => {
  try {
    await instance.delete(`/products/${wooProductId}`, {
      params: { force: true }, // permanently delete
    });
    return { success: true };
  } catch (err) {
    console.error(
      "❌ Error deleting WooCommerce product:",
      err.response?.data || err.message
    );
    return { success: false, error: err.response?.data || err.message };
  }
};
