const Product = require("../models/Product");
const {
  pushToWooCommerce,
  updateWooProduct,
  deleteFromWooCommerce,
} = require("../services/wooService");
const HttpStatus = require("../constants/statusCodes");

exports.createProduct = async (req, res) => {
  try {
    const userData = req.user;

    // Check if product with the exact same name (case-insensitive)
    const existingProduct = await Product.findOne({
      name: {
        $regex: `^${req.body.name}$`,
        $options: "i",
      },
    });

    if (existingProduct) {
      console.log("Existing Product==>", existingProduct);
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Product with the same name already exists.",
      });
    }

    console.log("User Data-->", userData);

    const newProduct = await Product.create({
      ...req.body,
      user: userData._id,
    });

    try {
      const wooRes = await pushToWooCommerce(newProduct);

      if (wooRes?.success) {
        newProduct.status = "Synced";
        newProduct.wooProductId = wooRes.id;
      } else {
        newProduct.status = "Sync Failed";
      }
    } catch (wooError) {
      console.error("WooCommerce Sync Error:", wooError);
      newProduct.status = "Sync Failed";
    }

    await newProduct.save();

    return res
      .status(HttpStatus.CREATED)
      .json({ success: true, data: newProduct });
  } catch (err) {
    console.log("Server Error:", err);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Something went wrong" });
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    let { page, limit, search, sortBy, sortOrder } = req.query;

    // Default pagination
    limit = parseInt(limit) || 10;
    page = parseInt(page) >= 1 ? parseInt(page) : 1;
    const skip = (page - 1) * limit;

    // Search filter
    const query = {
      user: req.user.id,
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting logic
    let sort = { createdAt: -1 }; // default sort by createdAt descending
    if (sortBy === "price") {
      const order = sortOrder === "asc" ? 1 : -1;
      sort = { price: order };
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate({ path: "user", select: "name email" })
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query),
    ]);
    return res.json({
      success: true,
      count: total,
      data: products,
    });
  } catch (err) {
    console.error("Error in getMyProducts:", err);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Something went wrong" });
  }
};
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findOne({ _id: id, user: req.user.id });

    if (!product) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Product not found",
      });
    } else if (product.name !== updates?.name) {
      const findSameProduct = await Product.findOne({
        _id: { $ne: id },
        name: {
          $regex: `^${updates.name}$`,
          $options: "i",
        },
      });
      if (findSameProduct) {
        return res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          message: "Product with the same name already exists.",
        });
      }
    }
    // Update product fields
    Object.assign(product, updates);

    // If product is already synced, update in WooCommerce too
    if (product.wooProductId) {
      try {
        const { success, error } = await updateWooProduct(product);
        if (!success) {
          product.status = "Sync Failed";
          console.error("Woo update error:", error);
        } else {
          product.status = "Synced";
        }
      } catch (wooErr) {
        product.status = "Sync Failed";
        console.error("Woo update error:", wooErr);
      }
    }

    await product.save();

    return res.status(HttpStatus.OK).json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (err) {
    console.error("Update product error:", err);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ _id: id, user: req.user.id });

    if (!product) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete from WooCommerce if synced
    if (product.wooProductId) {
      await deleteFromWooCommerce(product.wooProductId);
    }

    await Product.deleteOne({ _id: id });

    return res
      .status(HttpStatus.OK)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Something went wrong" });
  }
};
