const axios = require("axios");

const instance = axios.create({
  baseURL: process.env.WOO_COMMERCE_URL,
  auth: {
    username: process.env.WOO_COMMERCE_CLIENT_ID,
    password: process.env.SECRET_KEY,
  },
});

exports.pushToWooCommerce = async (product) => {
  try {
    const { data } = await instance.post("/products", {
      name: product.name,
      description: product.description,
      regular_price: product.price.toString(),
      images: [{ src: product.imageUrl }],
    });
    return { success: true, id: data.id };
  } catch (err) {
    return { success: false, error: err.response?.data || err.message };
  }
};

exports.updateWooProduct = async (product) => {
  try {
    const { data } = await instance.put(`/products/${product.wooProductId}`, {
      name: product.name,
      description: product.description,
      regular_price: product.price.toString(),
      images: product.imageUrl ? [{ src: product.imageUrl }] : undefined,
    });
    return { success: true, id: data.id };
  } catch (err) {
    return { success: false, error: err.response?.data || err.message };
  }
};

exports.deleteFromWooCommerce = async (wooProductId) => {
  try {
    await instance.delete(`/products/${wooProductId}`, {
      params: { force: true }, // to delete permanently
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err.response?.data || err.message };
  }
};
