const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { required: true, type: String },
    description: { required: false, type: String, default: "" },
    price: { required: true, type: Number },
    imageUrl: { type: String, required: false, default: "" },
    wooProductId: { type: Number, required: false, default: null },

    status: {
      type: String,
      enum: ["Created Locally", "Synced", "Sync Failed"],
      default: "Created Locally",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
